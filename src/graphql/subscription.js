import { gql } from 'apollo-boost';

export const MSG_SUBSCRIPTION = gql`
	subscription($msgBoxId: ID!) {
		message(msgBoxId: $msgBoxId) {
			data {
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
