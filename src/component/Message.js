import React, { useRef, useLayoutEffect } from 'react';
import '../container/ChatRoom.css';
import { useQuery } from 'react-apollo';
import './Message.css';
import { GET_MESSAGE_QUERY, DELETE_MSG_MUTATION, MSG_SUBSCRIPTION } from '../graphql';
import logo from '../img/x.png';
import { useMutation } from 'react-apollo';

// var curIndex = 0;
// function validate() {
// 	var arr = [];
// 	arr[0] = 'https://tps.forest.gov.tw/TPSWeb/wSite/public/Attachment/f1467039275461.jpg';
// 	arr[1] = 'https://tps.forest.gov.tw/TPSWeb/wSite/public/Attachment/f1467033715932.jpg';
// 	arr[2] = 'https://tps.forest.gov.tw/TPSWeb/wSite/public/Attachment/f1467036196503.jpg';
// 	arr[3] = 'https://tps.forest.gov.tw/TPSWeb/wSite/public/Attachment/f1515637338218.jpg';
// 	arr[4] = 'https://tps.forest.gov.tw/TPSWeb/wSite/public/Attachment/f1467038513288.jpg';
// 	arr[5] = 'https://www.marine.gov.tw/filesys/image/gallery/212/photo-5m456.jpg';
// 	arr[6] = 'https://www.marine.gov.tw/filesys/image/gallery/212/photo-sqhpp.jpg';
// 	arr[7] = 'https://www.marine.gov.tw/filesys/image/gallery/212/photo-4b4ss.jpg';
// 	if (curIndex == arr.length - 1) {
// 		curIndex = 0;
// 	} else {
// 		curIndex += 1;
// 	}
// 	document.getElementById('Body').style.backgroundImage = 'url(' + arr[curIndex] + ')';
// }

const Message = props => {
	const messageBox = props.messageBox;
	const name = props.name;
	const { data, loading, subscribeToMore } = useQuery(GET_MESSAGE_QUERY, {
		variables: { messageBoxId: messageBox },
	});
	const ref = useRef(null);
	const [deleteMsgMutation] = useMutation(DELETE_MSG_MUTATION);

	const handleDeleteMsg = id => {
		deleteMsgMutation({
			variables: {
				messageBoxId: messageBox,
				messageId: id,
			},
		});
	};

	useLayoutEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	});
	useLayoutEffect(() => {
		const s = subscribeToMore({
			document: MSG_SUBSCRIPTION,
			variables: {
				msgBoxId: messageBox,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				let mutationType = subscriptionData.data.message.mutation;
				if (mutationType === 'CREATED') {
					const newMsg = subscriptionData.data.message.data;
					return {
						...prev,
						getMessage: [...prev.getMessage, newMsg],
					};
				} else if (mutationType === 'DELETED') {
					const msgId = subscriptionData.data.message.data.id;
					const Msg = prev.getMessage.filter(msg => msg.id !== msgId);
					return {
						...prev,
						getMessage: Msg,
					};
				}
			},
		});
		return () => s();
	}, [messageBox, subscribeToMore]);
	if (loading)
		return (
			<div className="Body" id="Body" ref={ref}>
				<p>Loading...</p>
			</div>
		);
	if (!data) return <></>;

	/* <div className="Header">
				<p className="right-title">Message</p>
				<label htmlFor="change-background" className="custom-change-background">
					切換背景
				</label>
				<input type="button" id="change-background" className="change-background-button" onClick={validate} />
			</div> */

	return (
		<div className="Body" id="Body" ref={ref}>
			{data.getMessage.map((msg, idx) => {
				if (msg.author === name) {
					return (
						// <div className="message" key={idx}>
						<div className="me_block" key={idx}>
							<div className="me" type="txt">
								{msg.body}
							</div>
							<img src={logo} alt="X" className="msg_x" onClick={() => handleDeleteMsg(msg.id)} />
						</div>
						// </div>
					);
				} else {
					return (
						<div className="friend" type="txt" key={idx}>
							{msg.body}
						</div>
					);
				}
			})}
		</div>
	);
};

export default Message;
