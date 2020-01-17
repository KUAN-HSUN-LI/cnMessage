import { GraphQLServer, PubSub } from 'graphql-yoga';
import { startDB, models } from './db';
import Subscription from './graphql/resolvers/Subscription';
import Mutation from './graphql/resolvers/Mutation';
import Query from './graphql/resolvers/Query';

const db = startDB({ URL: 'YOUR MONGODB URL' });

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

if (process.env.NODE_ENV === 'production') {
	const root = path.join(__dirname, 'build');
	server.express.use(express.static(root));
	server.express.get('*', (req, res) => {
		res.sendFile('index.html', { root });
	});
}

const opts = {
	port: process.env.PORT || 4000,
	cors: {
		credentials: true,
		origin: ['http://localhost:3000', 'http://localhost:3001'],
	},
};

server.start(opts, () => console.log(`Server is running on http://localhost:${opts.port}`));

// server.start({ port: process.env.PORT | 4000 }, () => {
// 	console.log(`The server is up on port ${process.env.PORT | 4000}!`);
// });
