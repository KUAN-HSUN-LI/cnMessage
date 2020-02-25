import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ContextProvider } from './context';

const WS = window.location.origin.replace('http', 'ws');

const wsLink =
	process.env.NODE_ENV === 'production'
		? new WebSocketLink({
				uri: WS,
				options: { reconnect: true },
		  })
		: new WebSocketLink({
				uri: 'ws://localhost:4000/',
				options: { reconnect: true },
		  });

const upLink =
	process.env.NODE_ENV === 'production'
		? new createUploadLink({
				uri: '/',
		  })
		: new createUploadLink({
				uri: 'http://localhost:4000/',
		  });

const link = split(
	// split based on operation type
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	upLink
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache().restore({}),
});

const wrappedApp = (
	<ApolloProvider client={client}>
		<ContextProvider>
			<App />
		</ContextProvider>
	</ApolloProvider>
);

ReactDOM.render(wrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
