import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import fs, { Dir } from 'fs';
import path from 'path';
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
	uploadFile: async (parent, args, { db, pubsub, models }, info) => {
		// return '123';
		const { createReadStream, filename, mimetype, encoding } = await args.file;
		const id = uuidv4();

		const file_string = new Promise(function(resolve, reject) {
			const stream = createReadStream(filename);
			var buf = new Buffer('');
			stream.on('data', chunk => {
				buf = Buffer.concat([buf, chunk]);
			});
			stream.on('error', err => {
				reject(err);
			});
			stream.on('end', () => {
				var res = buf.toString('base64');
				buf = null; // Clean up memory
				stream.destroy();
				resolve(res);
			});
		});

		const stream = createReadStream(filename);
		var buf = new Buffer('');
		var res;
		stream.on('data', chunk => {
			buf = Buffer.concat([buf, chunk]);
		});
		stream.on('error', err => {
			reject(err);
		});
		stream.on('end', () => {
			res = buf.toString('base64');
			buf = null; // Clean up memory
			stream.destroy();
		});
		const output_file = {
			id: id,
			filename: filename,
			mimetype: mimetype,
			encoding: encoding,
			stream: file_string,
		};
		console.log(filename);
		pubsub.publish(`file ${args.msgBoxId} ${args.reciever}`, {
			file: {
				data: output_file,
			},
		});
		return output_file;
	},
};

export { Mutation as default };
