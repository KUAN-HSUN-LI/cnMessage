import { gql } from 'apollo-boost';

export const LOGIN_USER_MUTATION = gql`
	mutation loginUser($name: String!, $pwd: String!) {
		loginUser(data: { name: $name, pwd: $pwd }) {
			id
			friends {
				name
				messageBox
			}
			# name
			# pwd
		}
	}
`;

export const CREATE_MSG_MUTATION = gql`
	mutation createMessage($messageBoxId: ID!, $author: String!, $body: String!) {
		createMessage(data: { messageBoxId: $messageBoxId, author: $author, body: $body })
	}
`;
