
---

# GitHub Scanner

## Overview

The **GitHub Scanner** is an Apollo GraphQL-based system that allows users to:
1. **List Repositories** from a user's GitHub account.
2. **Retrieve Repository Details**, including:
    - Basic repository information (name, size, owner).
    - Whether the repository is private or public.
    - The number of files in the repository.
    - Content of the first `.yml` file found.
    - Active webhooks associated with the repository.

This project is built using TypeScript, Apollo GraphQL, and GitHub's API.

## Setup Instructions

### 1. Install Dependencies
Make sure you have **Node.js** installed. Then, navigate to the project directory and install the dependencies using:

```bash
npm install
```

### 2. Start the Project
After installing the dependencies, you can start the server with:

```bash
npm start
```

### 3. GraphQL Queries
Once the server is running, you can query the available GraphQL API.

#### Example 1: Get Repository Details
This query fetches detailed information for a specific repository:

```graphql
query {
  repositoryDetails(repoName: "repoA") {
    name
    size
    owner {
      login
      id
      avatar_url
      url
      html_url
      repos_url
      type
      site_admin
    }
    private
    fileCount
    ymlFileContent
    activeWebhooks {
      id
      name
      url
    }
  }
}
```

#### Example 2: List Repositories
This query returns a list of repositories from the GitHub account:

```graphql
query {
  listRepositories {
    name
    size
    owner {
      login
      id
    }
  }
}
```

## Important Notes for Recruiters

### GitHub API Rate Limiting
The **GitHub API** enforces rate limits on the number of requests you can make per hour. In this project, we use worker threads to optimize repository scanning, which can trigger a high number of API requests. To prevent exceeding GitHub's rate limits, you may need to adjust the number of workers.

#### How to Adjust Workers:
By default, the concurrency limit is set to **4 workers** in the `githubService.ts` file:

```typescript
const [{ fileCount, ymlFileContent }] = await limitConcurrency(tasks, 4);  // Set to 4 concurrent tasks
```

To reduce the number of workers and lower the API request rate, you can change the number `4` to a lower value (such as `1` or `2`) to stay within the API rate limits.

---
# github_scanner
