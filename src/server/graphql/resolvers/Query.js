const Query = {
	getMessage: async (parent, args, { db, models, req }, info) => {
		const { messageBoxId } = args;
		const msgBox = await models.MessageBox.findOne({ id: messageBoxId });
		const msg = await models.Message.find({ id: msgBox.messages });
		return msg;
	},
};

export { Query as default };
