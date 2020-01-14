import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';

const Mutation = {
	createUser: async (parent, args, { db, pubsub, models }, info) => {
		await models.User.findOne({ name: args.data.name }).then(e => {
			if (e) {
				throw new Error('Name is used');
			}
		});
		const pwd = bcrypt.hashSync(args.data.pwd, 10);

		const user = {
			id: uuidv4(),
			name: args.data.name,
			pwd: pwd,
			friends: [],
		};
		const newUser = new models.User(user);
		await newUser.save().catch(e => {
			throw new Error('Cannot Save User!!!');
		});
		return user;
	},
	loginUser: async (parent, args, { db, pubsub, models }, info) => {
		const user = await models.User.findOne({ name: args.data.name });
		console.log(user);
		if (user) {
			if (bcrypt.compareSync(args.data.pwd, user.pwd)) {
				return user;
			} else {
				throw new Error('Password wrong!');
			}
		} else {
			throw new Error('User is not Registed');
		}
	},
	deleteUsers: async (parent, args, { db, pubsub, models }, info) => {
		console.log('in');
		models.User.deleteMany({})
			.then(console.log('del success'))
			.catch(e => {
				console.log('err');
			});
	},
	createFriend: async (parent, args, { db, pubsub, models }, info) => {
		const { username, friendname } = args.data;
		await models.User.findOne({ name: friendname })
			.then(d => {
				if (!d) return false;
			})
			.catch(e => {
				console.error(e);
			});

		const boxId = uuidv4();
		const messageBox = {
			id: boxId,
			messages: [],
		};
		const newMessageBox = new models.MessageBox(messageBox);
		await newMessageBox.save().catch(e => {
			throw new Error('Cannot Save MessageBox!!!');
		});

		await models.User.updateOne({ name: username }, { $push: { friends: { name: friendname, messageBox: messageBox.id } } });
		await models.User.updateOne({ name: friendname }, { $push: { friends: { name: username, messageBox: messageBox.id } } });
	},
	createMessage: async (parent, args, { db, pubsub, models }, info) => {
		const { messageBoxId, author, body } = args.data;
		const msgId = uuidv4();
		const msg = {
			id: msgId,
			author: author,
			body: body,
		};
		const newMsg = new models.Message(msg);
		await newMsg.save().catch(e => {
			throw new Error('Cannot Save Message!!!');
		});
		await models.MessageBox.updateOne({ id: messageBoxId }, { $push: { messages: msgId } });
		pubsub.publish(`msg ${messageBoxId}`, {
			message: {
				data: msg,
			},
		});
	},
};

export { Mutation as default };
