import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to run worker threads
export const runWorker = (repoName: string, pathToScan: string, login: string, token: string): Promise<{ fileCount: number; ymlFileContent: string | null }> => {
    return new Promise((resolve, reject) => {
        const workerPath = path.resolve(__dirname, 'worker.mjs');

        const worker = new Worker(workerPath, {
            workerData: { repoName, path: pathToScan, login, token },  // Pass the necessary data to the worker
        });

        worker.on('message', (message) => {
            if (message.error) {
                console.error('Worker error:', message.error);
                reject(new Error(message.error));
            } else {
                resolve(message);  // Return the result (fileCount and ymlFileContent)
            }
        });

        worker.on('error', (error) => {
            console.error('Worker thread error:', error);
            reject(error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};
