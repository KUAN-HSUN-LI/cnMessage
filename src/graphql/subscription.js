import { gql } from 'apollo-boost';

export const MSG_SUBSCRIPTION = gql`
	subscription($msgBoxId: ID!) {
		message(msgBoxId: $msgBoxId) {
			mutation
			data {
				id
				author
				body
			}
		}
	}
`;

export const FILE_SUBSCRIPTION = gql`
	subscription($msgBoxId: ID!, $reciever: String!) {
		file(msgBoxId: $msgBoxId, reciever: $reciever) {
			data {
				filename
				mimetype
				encoding
				stream
			}
		}
	}
`;

export const FRIEND_SUBSCRIPTION = gql`
	subscription($name: String!) {
		friend(name: $name) {
			data {
				name
				messageBox
			}
		}
	}
`;
