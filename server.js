import { GraphQLServer, PubSub } from 'graphql-yoga';
import { startDB, models } from './src/server/db';
import Subscription from './src/server/graphql/resolvers/Subscription';
import Mutation from './src/server/graphql/resolvers/Mutation';
import Query from './src/server/graphql/resolvers/Query';
import path from 'path';
import express from 'express';

const db = startDB({ URL: 'YOUR MONGODB URL' });

const pubsub = new PubSub();

const context = {
	pubsub,
	db,
	models,
};

const server = new GraphQLServer({
	typeDefs: `${__dirname}/src/server/graphql/schema.graphql`,
	resolvers: {
		Query,
		Mutation,
		Subscription,
	},
	context,
});

if (process.env.NODE_ENV === 'production') {
	const root = path.join(__dirname, 'build');
	server.express.use(express.static(root));
	server.express.get('*', (req, res) => {
		res.sendFile('index.html', { root });
	});
}

// const opts = {
//     port: process.env.PORT || 4000,
//     cors: {
//       credentials: true,
//       origin: ['http://localhost:3000','http://localhost:3001']
//     },
// };

server.start({ port: process.env.PORT | 4000 }, () => {
	console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});
