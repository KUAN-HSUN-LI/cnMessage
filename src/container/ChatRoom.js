import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import { useMutation, useSubscription } from 'react-apollo';
import Message from '../component/Message';
import GetFile from './GetFile';
import AddFriend from '../component/AddFriend';

import { CREATE_MSG_MUTATION, UPLOAD_FILE_MUTATION, FRIEND_SUBSCRIPTION } from '../graphql';

const ChatRoom = props => {
	const name = localStorage.getItem('name');
	const [msgBoxId, setMsgBoxId] = useState(null);
	const [friend, setFriend] = useState(null);
	const [newMsg, setNewMsg] = useState('');
	const [friends, setFriends] = useState(JSON.parse(localStorage.getItem('friends')));
	const [createMsgMutation] = useMutation(CREATE_MSG_MUTATION);
	const [uploadFileMutation] = useMutation(UPLOAD_FILE_MUTATION);

	const newFriend = useSubscription(FRIEND_SUBSCRIPTION, { variables: { name: name } });

	const handleSubmit = e => {
		e.preventDefault();
		if (newMsg === '') return;
		createMsgMutation({
			variables: {
				messageBoxId: msgBoxId,
				author: name,
				body: newMsg,
			},
		}).then(setNewMsg(''));
	};

	const handleUploadFile = e => {
		const file = e.target.files[0];
		uploadFileMutation({
			variables: { file: file, msgBoxId: msgBoxId, reciever: friend },
		});
	};
	useEffect(() => {
		if (newFriend.data) {
			setFriends(friends => friends.concat(newFriend.data.friend.data));
		}
	}, [newFriend.data]);

	useEffect(() => {
		localStorage.setItem('friends', JSON.stringify(friends));
	}, [friends]);

	useEffect(() => {
		var current = document.getElementById(friend);
		if (current) {
			current.classList.remove('Friend_list_black');
			current.classList.add('Friend_list_white');
			return () => {
				current.classList.remove('Friend_list_white');
				current.classList.add('Friend_list_black');
			};
		}
	}, [friend]);

	return (
		<div className="ChatRoom">
			<div className="Sidebar">
				<div className="snow-container">
					<div className="snow middleground"></div>
					<div className="snow middleground layered"></div>
					<div className="snow background"></div>
					<div className="snow background layered"></div>
				</div>
				<p className="left-title">
					<i className="fa fa-address-book"></i>通訊錄
				</p>

				<AddFriend name={name} />
				{friends.map((d, idx) => (
					<div
						className="Friend_list Friend_list_black"
						key={idx}
						onClick={() => {
							setMsgBoxId(d.messageBox);
							setFriend(d.name);
						}}
						id={d.name}>
						{d.name}
					</div>
				))}
			</div>
			<div className="Header">
				<p className="right-title">
					<i className="fa fa-commenting-o"></i>Message
				</p>
			</div>
			{msgBoxId ? (
				<>
					<Message messageBox={msgBoxId} name={name}></Message>
					<GetFile name={name} msgBoxId={msgBoxId}></GetFile>
				</>
			) : (
				<div className="Body" id="Body">
					<h1>Choose a friend</h1>
				</div>
			)}

			<div className="Footer">
				<label htmlFor="file-upload" className="custom-file-upload">
					<i className="fa fa-folder"></i> File
				</label>
				<input id="file-upload" type="file" onChange={e => handleUploadFile(e)} />

				<textarea
					className="textbox"
					type="text"
					onChange={e => setNewMsg(e.target.value)}
					onKeyPress={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							handleSubmit(e);
						}
					}}
					value={newMsg}></textarea>
			</div>
		</div>
	);
};

export default ChatRoom;
