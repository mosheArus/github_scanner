// Interface for the "Owner" type in GraphQL
interface Owner {
    login: string;
    id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    repos_url: string;
    type: string;
    site_admin: boolean;
}

// Interface for the "Config" type for webhook configuration
interface Config {
    content_type: string;
    insecure_ssl: string;
    url: string;
}

// Interface for the "Webhook" type in GraphQL
interface Webhook {
    id: number;
    name: string;
    url: string;
    active: boolean;
    config: Config; // The config field references the Config interface
}

// Interface for the "Repository" type in GraphQL
interface Repository {
    name: string;
    size: number;
    owner: Owner; // The "owner" field references the Owner interface
}

// Interface for the "RepositoryDetail" type in GraphQL
interface RepositoryDetail {
    name: string;
    size: number;
    owner: Owner | string; // The "owner" field references the Owner interface
    private: boolean; // Matches with GraphQL field "private"
    fileCount: number; // File count for the repository
    ymlFileContent: string | null; // Nullable content for the first .yml file found
    activeWebhooks: Webhook[]; // Array of webhooks
}


