import React, { useLayoutEffect } from 'react';
import '../container/ChatRoom.css';
import { useQuery } from 'react-apollo';
import './Message.css';
import { GET_MESSAGE_QUERY, DELETE_MSG_MUTATION, MSG_SUBSCRIPTION } from '../graphql';
import logo from '../img/x.png';
import { useMutation } from 'react-apollo';

const Message = props => {
	const messageBox = props.messageBox;
	const name = props.name;
	const { data, loading, subscribeToMore } = useQuery(GET_MESSAGE_QUERY, {
		variables: { messageBoxId: messageBox },
	});
	const [deleteMsgMutation] = useMutation(DELETE_MSG_MUTATION);

	const handleDeleteMsg = id => {
		deleteMsgMutation({
			variables: {
				messageBoxId: messageBox,
				messageId: id,
			},
		});
	};

	const changeHeight = e => {
		if (e) {
			e.scrollTop = e.scrollHeight;
		}
	};

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
			<div className="Body" id="Body">
				<p>Loading...</p>
			</div>
		);
	if (!data) return <></>;

	return (
		<div className="Body" id="Body" ref={changeHeight}>
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
