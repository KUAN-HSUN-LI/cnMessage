const Subscription = {
	message: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator(`msg ${args.msgBoxId}`);
		},
	},
	file: {
		subscribe: (parent, args, { pubsub }, info) => {
			return pubsub.asyncIterator(`file ${args.msgBoxId} ${args.reciever}`);
		},
	},
	friend: {
		subscribe: (parent, args, { pubsub }, info) => {
			var data = pubsub.asyncIterator(`friend ${args.name}`);
			return pubsub.asyncIterator(`friend ${args.name}`);
		},
	},
};

export { Subscription as default };
