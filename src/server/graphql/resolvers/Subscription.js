const Subscription = {
	message: {
		subscribe(parent, args, { pubsub }, info) {
			console.log(args.msgBoxId);
			return pubsub.asyncIterator(`msg ${args.msgBoxId}`);
		},
	},
	file: {
		subscribe: async (parent, args, { pubsub }, info) => {
			console.log(args);
			return pubsub.asyncIterator(`file ${args.msgBoxId} ${args.reciever}`);
		},
	},
};

export { Subscription as default };
