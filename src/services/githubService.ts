import axios, { AxiosInstance } from 'axios';
import { GITHUB_API_URL, GITHUB_TOKEN } from '../config';
import limitConcurrency from '../utils/rateLimiter';
import { runWorker } from '../utils/workerHelper';

export class GitHubService {
  private axiosInstance: AxiosInstance;
  private token: string;

  constructor(baseUrl: string = GITHUB_API_URL || 'https://api.github.com', token: string = GITHUB_TOKEN || '') {
    if (!token) {
      throw new Error('GitHub token is required');
    }

    this.token = token;

    // init Axios instance with base URL and Authorization header
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // Helper method to get the authenticated user login (username)
  private async getUserLogin(): Promise<string> {
    try {
      const response = await this.axiosInstance.get('/user');
      return response.data.login;
    } catch (error : any) {
      console.error('Error fetching authenticated user login:', error.message);
      throw new Error('Error fetching authenticated user login');
    }
  }

  // Method to list repositories
  public async listRepositories(): Promise<Repository[]> {
    try {
      const response = await this.axiosInstance.get('/user/repos');
      return response.data.map((repo: any) => ({
        name: repo.name,
        size: repo.size,
        owner: {
          login: repo.owner.login || '',
          id: repo.owner.id,
          avatar_url: repo.owner.avatar_url || '',
          url: repo.owner.url,
          html_url: repo.owner.html_url || '',
          repos_url: repo.owner.repos_url,
          type: repo.owner.type,
          site_admin: repo.owner.site_admin || false,
        },
      }));
    } catch (error: any) {
      console.error('Error fetching repositories:', error.message);
      throw new Error('Error fetching repositories');
    }
  }

  // Method to get webhooks for a repository
  public async getWebhooks(path: string): Promise<Webhook[]> {
    try {
      const webhooksResponse = await this.axiosInstance.get(path);
      return webhooksResponse.data.map((hook: any) => ({
        id: hook.id,
        name: hook.name,
        url: hook.config.url,
        active: hook.active,
        config: {
          content_type: hook.config.content_type,
          insecure_ssl: hook.config.insecure_ssl,
          url: hook.config.url,
        },
      }));
    } catch (error : any) {
      console.error('Error fetching webhooks:', error.message);
      throw new Error(`Error fetching webhooks from ${path}`);
    }
  }

  // Method to get repository details and fetch the first .yml file content
  public async getRepositoryDetails(repoName: string): Promise<RepositoryDetail> {
    try {
      const login = await this.getUserLogin();  // Get the authenticated user login (username)
      const repoResponse = await this.axiosInstance.get(`/repos/${login}/${repoName}`);
      const { size, private: isPrivate, owner: Owner } = repoResponse.data;

      // Use workers to scan the repo tree for better performance, with a config max worker limit
      const tasks = [() => runWorker(repoName, '', login, this.token)];
      const [{ fileCount, ymlFileContent }] = await limitConcurrency(tasks, 4);

      // Fetch webhooks for the repository
      const webhooks = await this.getWebhooks(`/repos/${login}/${repoName}/hooks`);

      return {
        name: repoName,
        size,   // Repository size
        owner: Owner,
        private: isPrivate, // Repository private status
        fileCount: fileCount || 0,           // Total number of files
        ymlFileContent,      // Content of the first .yml file found
        activeWebhooks: webhooks,  // Webhooks
      };
    } catch (error: unknown) {
      console.error('Error fetching repository details:', error);
      throw new Error(`Error fetching repository details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
