import mongoose from 'mongoose';
import User from './user';
import MessageBox from './messageBox';
import Message from './message';

mongoose.Promise = global.Promise;

export const startDB = ({ URL }) => {
	mongoose
		.connect(URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('MongoDB connected'))
		.catch(err => console.error(err));
};

export const models = {
	User,
	MessageBox,
	Message,
};
