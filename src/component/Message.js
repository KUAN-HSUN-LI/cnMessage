import React, { useState, useRef, useLayoutEffect } from 'react';
import '../container/ChatRoom.css';
import { useQuery } from 'react-apollo';

import { GET_MESSAGE_QUERY, MSG_SUBSCRIPTION } from '../graphql';

const Message = props => {
	const messageBox = props.messageBox;
	const name = props.name;
	const { data, loading, subscribeToMore } = useQuery(GET_MESSAGE_QUERY, {
		variables: { messageBoxId: messageBox },
	});
	const ref = useRef(null);
	const [scribe, setScribe] = useState(false);
	useLayoutEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	});
	if (loading) return <p>Loading...</p>;
	if (!data) return <></>;
	if (!scribe) {
		setScribe(true);
		subscribeToMore({
			document: MSG_SUBSCRIPTION,
			variables: {
				msgBoxId: messageBox,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newMsg = subscriptionData.data.message.data;
				return {
					...prev,
					getMessage: [...prev.getMessage, newMsg],
				};
			},
		});
	}

	return (
		<div className="Body" ref={ref}>
			{data.getMessage.map((msg, idx) => {
				if (msg.author === name) {
					return (
						<div className="message" key={idx}>
							<div className="me" type="txt">
								{msg.body}
							</div>
						</div>
					);
				} else {
					return (
						<div className="message" key={idx}>
							<div className="friend" type="txt">
								{msg.body}
							</div>
						</div>
					);
				}
			})}
		</div>
	);
};

export default Message;
