import { GraphQLServer, PubSub } from 'graphql-yoga';
import { startDB, models } from './db';
import Subscription from './graphql/resolvers/Subscription';
import Mutation from './graphql/resolvers/Mutation';
import Query from './graphql/resolvers/Query';

const db = startDB({ URL: 'mongodb+srv://jingch:jingch1213@cluster0-tninn.gcp.mongodb.net/test?retryWrites=true&w=majority' });

const pubsub = new PubSub();

const context = {
	pubsub,
	db,
	models,
};

const server = new GraphQLServer({
	typeDefs: `${__dirname}/graphql/schema.graphql`,
	resolvers: {
		Query,
		Mutation,
		Subscription,
	},
	context,
});

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
