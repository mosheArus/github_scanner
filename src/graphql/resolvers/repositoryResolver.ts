import { GitHubService } from '../../services/githubService';
import limitConcurrency from '../../utils/rateLimiter';

const githubService = new GitHubService();

const resolvers = {
  Query: {
    // Resolver for listing repositories
    listRepositories: async (): Promise<Repository[]> => {
      try {
        return await githubService.listRepositories();
      } catch (error) {
        throw new Error('Failed to fetch repositories');
      }
    },

    // Resolver for fetching repository details with a max concurrency of 2 repository scans
    repositoryDetails: async (_: unknown, { repoName }: { repoName: string }): Promise<RepositoryDetail> => {
      if (typeof repoName !== 'string' || !repoName.trim()) {
        throw new Error('repoName must be a valid non-empty string');
      }

      try {
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
