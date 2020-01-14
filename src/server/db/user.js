import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: {
		type: String,
		required: [true, 'id is required'],
	},
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	pwd: {
		type: String,
		required: [true, 'pwd is required'],
	},
	friends: {
		type: Array,
	},
});

module.exports = mongoose.model('user', UserSchema);
