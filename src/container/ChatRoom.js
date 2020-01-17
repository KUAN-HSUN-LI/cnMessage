import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import { useMutation } from 'react-apollo';
import Message from '../component/Message';
import GetFile from './GetFile';
import { CREATE_MSG_MUTATION, UPLOAD_FILE_MUTATION } from '../graphql';
const ChatRoom = props => {
	const friends = props.location.state.friends;
	const name = props.location.state.name;
	const [msgBoxId, setMsgBoxId] = useState(friends[0].messageBox);
	const [friend, setFriend] = useState(friends[0].name);
	const [newMsg, setNewMsg] = useState('');

	const [createMsgMutation] = useMutation(CREATE_MSG_MUTATION);
	const [uploadFileMutation] = useMutation(UPLOAD_FILE_MUTATION);

	// const test = useSubscription(FILE_SUBSCRIPTION);

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
		var current = document.getElementById(friend);
		if (current) {
			current.classList.remove('Friend_list_black');
			current.classList.add('Friend_list_white');
			return () => {
				current.classList.remove('Friend_list_white');
				current.classList.add('Friend_list_black');
			};
		}
		console.log('in');
	}, [friend]);
	// useEffect(() => {
	// 	console.log(test);
	// 	// if (test.data) {
	// 	// 	var { stream, filename, mimetype, encoding } = test.data.file.data;
	// 	// 	var output = Buffer.from(stream, 'base64');
	// 	// 	fileDownload(output, filename, mimetype);
	// 	// }
	// });
	return (
		<div className="ChatRoom">
			<div className="Sidebar">
				<p className="left-title">通訊錄</p>
				<GetFile name={name} msgBoxId={msgBoxId}></GetFile>
				<input className="add_friend" type="text" />
				<input className="add_friend_button" value="加好友" type="button" />
				{friends.map((d, idx) => (
					<div
						className="Friend_list"
						key={idx}
						onClick={e => {
							setMsgBoxId(d.messageBox);
							setFriend(d.name);
						}}
						id={d.name}>
						{d.name}
					</div>
				))}
			</div>
			<div className="Header">
				<p className="right-title">Message</p>
			</div>
			<Message messageBox={msgBoxId} name={name}></Message>

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
