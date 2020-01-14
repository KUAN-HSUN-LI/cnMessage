import React, { useState } from 'react';
import './ChatRoom.css';
import { useMutation } from 'react-apollo';

import Message from '../component/Message';

import { CREATE_MSG_MUTATION } from '../graphql';

const ChatRoom = props => {
	const friends = props.location.state.friends;
	const name = props.location.state.name;
	const [messageBox, setMessageBox] = useState(friends[0].messageBox);
	const [newMsg, setNewMsg] = useState('');

	const [createMsgMutation] = useMutation(CREATE_MSG_MUTATION);
	const handleSubmit = e => {
		e.preventDefault();
		if (newMsg === '') return;
		createMsgMutation({
			variables: {
				messageBoxId: messageBox,
				author: name,
				body: newMsg,
			},
		}).then(setNewMsg(''));
	};

	return (
		<div className="ChatRoom">
			<div className="Sidebar">
				<p className="left-title">通訊錄</p>
				{friends.map((d, idx) => (
					<p
						key={idx}
						onClick={e => {
							setMessageBox(d.messageBox);
						}}>
						{d.name}
					</p>
				))}
			</div>
			<div className="Header">
				<p className="right-title">Message</p>
			</div>
			<Message messageBox={messageBox} name={name}></Message>
			<div className="Footer">
				<textarea
					className="textbox"
					type="text"
					onChange={e => setNewMsg(e.target.value)}
					onKeyPress={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							// e.preventDefault();
							handleSubmit(e);
						}
					}}
					value={newMsg}></textarea>
				<button
					className="Send"
					type="submit"
					onClick={e => {
						handleSubmit(e);
					}}>
					submit
				</button>
			</div>
		</div>
	);
};

export default ChatRoom;
