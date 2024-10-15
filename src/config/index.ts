import dotenv from 'dotenv';
import * as path from "node:path";
import * as process from "node:process";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env.staging');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error(`Failed to load environment variables from ${envPath}:`, result.error);
    throw new Error(`Could not load .env.staging file`);
}
console.log("Loaded environment file:", envPath);

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_API_URL || !GITHUB_TOKEN) {
    throw new Error('Environment variables GITHUB_API_URL or GITHUB_TOKEN are missing');
}

export { GITHUB_API_URL, GITHUB_TOKEN };
