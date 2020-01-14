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
