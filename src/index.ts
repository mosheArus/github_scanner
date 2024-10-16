import GraphQLServer from './graphql/index';

// Create an instance of the server
const graphQLServer = new GraphQLServer();

// Start the server
graphQLServer.startServer().then((url) => {
    if (url) {
        console.log(`Server instance running at ${url}`);
    } else {
        console.log('Failed to start server or no URL returned');
    }
});
