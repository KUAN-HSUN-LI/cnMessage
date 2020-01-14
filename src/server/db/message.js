import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	id: {
		type: String,
		required: [true, 'id is required'],
	},
	author: {
		type: String,
		required: [true, 'name is required'],
	},
	body: {
		type: String,
		required: [true, 'body is required'],
	},
});

module.exports = mongoose.model('message', MessageSchema);
