import { GitHubService } from '../../services/githubService';
import limitConcurrency from '../../utils/rateLimiter';

const githubService = new GitHubService(); // Create an instance of GitHubService

const resolvers = {
  Query: {
    // Resolver for listing repositories (no concurrency limiting needed)
    listRepositories: async (): Promise<Repository[]> => {
      try {
        return await githubService.listRepositories();
      } catch (error) {
        throw new Error('Failed to fetch repositories');
      }
    },

    // Resolver for getting repository details with concurrency limiting
    repositoryDetails: async (_: unknown, { repoName }: { repoName: string }): Promise<RepositoryDetail> => {
      if (typeof repoName !== 'string' || !repoName.trim()) {
        throw new Error('repoName must be a valid non-empty string');
      }

      try {
        // Limit concurrency to 2 repo scans at the same time
        const tasks = [() => githubService.getRepositoryDetails(repoName)];
        const [repositoryDetail] = await limitConcurrency(tasks, 2);  // Max 2 concurrent tasks

        return repositoryDetail;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch repository details: ${error.message}`);
        }
        throw new Error('Failed to fetch repository details');
      }
    },
  },
};

export default resolvers;
