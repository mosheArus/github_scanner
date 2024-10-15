const typeDefs = `#graphql
  # The "Repository" type defines the fields for every repository in the data source.
  type Repository {
    name: String!
    size: Int!
    owner: Owner!
  }

  # The "Owner" type defines more detailed fields for a specific Owner.
  type Owner {
    login: String
    id: ID!
    avatar_url: String!
    url: String!
    html_url: String!
    repos_url: String!
    type: String!
    site_admin: Boolean!
  }

  # The "RepositoryDetail" type defines more detailed fields for a specific repository.
  type RepositoryDetail {
    name: String!
    size: Int!
    owner: Owner!
    private: Boolean!
    fileCount: Int!  # The count of all files in the repository.
    ymlFileContent: String  # The content of the first .yml file found.
    activeWebhooks: [Webhook]
  }

  # The "Config" type defines the fields for webhook config details.
  type Config {
    content_type: String!
    insecure_ssl: String!
    url: String!
  }

  # The "Webhook" type defines the fields for repository webhooks.
  type Webhook {
    id: ID!
    name: String!
    url: String!
    active: Boolean!
    config: Config!
  }

  # The "Query" type defines all available queries for the client to execute.
  # The "listRepositories" query returns a list of repositories.
  # The "repositoryDetails" query returns detailed information about a specific repository.
  type Query {
    listRepositories: [Repository!]!    
    repositoryDetails(repoName: String!): RepositoryDetail!   # Only repoName is required
  }
`;
export default typeDefs;
