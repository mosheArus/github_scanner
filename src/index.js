import GraphQLServer from './graphql/index';
// Create an instance of the server
const graphQLServer = new GraphQLServer();
// Start the server and handle the URL string or void
graphQLServer.startServer().then((url) => {
    if (url) {
        console.log(`Server instance running at ${url}`);
    }
    else {
        console.log('Failed to start server or no URL returned');
    }
});
