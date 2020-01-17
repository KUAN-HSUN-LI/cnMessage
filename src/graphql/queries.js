import { gql } from 'apollo-boost';

export const GET_MESSAGE_QUERY = gql`
	query getMessage($messageBoxId: ID!) {
		getMessage(messageBoxId: $messageBoxId) {
			id
			author
			body
		}
	}
`;
