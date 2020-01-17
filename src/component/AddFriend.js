import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import './AddFriend.css';
import { CREATE_FRIEND_MUTATION } from '../graphql';

const AddFriend = props => {
	const name = props.name;
	const [createFriendMutation] = useMutation(CREATE_FRIEND_MUTATION);
	const [newFriend, setNewFriend] = useState('');
	const handleSubmit = () => {
		if (!newFriend) {
			return;
		}
		createFriendMutation({
			variables: {
				username: name,
				friendname: newFriend,
			},
		});
		setNewFriend('');
	};

	return (
		<>
			<input
				className="add_friend"
				type="text"
				onKeyPress={e => {
					if (e.key === 'Enter') {
						e.preventDefault();
						handleSubmit();
					}
				}}
				onChange={e => setNewFriend(e.target.value)}
				value={newFriend}
			/>
			<label htmlFor="add_friend_button" className="add_friend_button_label" onClick={() => handleSubmit()}>
				<i className="fa fa-user-plus"></i>
				<input className="add_friend_button" type="button" />
			</label>
		</>
	);
};

export default AddFriend;
