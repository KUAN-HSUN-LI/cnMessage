import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageBoxSchema = new Schema({
	id: {
		type: String,
		required: [true, 'id is required'],
	},
	messages: {
		type: Array,
	},
});

module.exports = mongoose.model('messageBox', MessageBoxSchema);
