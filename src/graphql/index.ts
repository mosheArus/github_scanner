import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schemas/repositorySchema';
import resolvers from './resolvers';

export default class GraphQLServer {
  private server: ApolloServer;

  constructor() {
    // Initialize the ApolloServer with the typeDefs and resolvers
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
    });
  }

  // Method to start the standalone server
  public async startServer(): Promise<string | void> {
    try {
      const { url } = await startStandaloneServer(this.server, {
        listen: { port: 4000 },
      });
      console.log(`🚀 Server ready at ${url}`);
      return url; // Return the URL if the server starts successfully
    } catch (error) {
      console.error('Error starting server:', error);
      return; // Return void in case of an error
    }
  }
}

