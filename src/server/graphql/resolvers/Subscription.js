const Subscription = {
	message: {
		subscribe(parent, args, { pubsub }, info) {
			console.log(args.msgBoxId);
			return pubsub.asyncIterator(`msg ${args.msgBoxId}`);
		},
	},
};

export { Subscription as default };
