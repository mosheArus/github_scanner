import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { env } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '.env.staging');

//init environment variables
dotenv.config({ path: envPath });

if (!env.GITHUB_API_URL || !env.GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_API_URL or GITHUB_TOKEN in environment variables');
}

export const { GITHUB_API_URL, GITHUB_TOKEN } = env;
