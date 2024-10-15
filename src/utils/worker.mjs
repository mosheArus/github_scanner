import { parentPort, workerData } from 'worker_threads';
import axios from 'axios';

// Worker data
const { repoName, path: scanPath, login, token } = workerData;

// Axios instance for API requests
const axiosInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: { Authorization: `Bearer ${token}` }
});

let fileCount = 0;
let ymlFileContent = null;

// Function to scan the directory recursively
const scanDirectory = async (path = '') => {
    try {
        // Fetch repository contents in parallel
        const contentsResponse = await axiosInstance.get(`/repos/${login}/${repoName}/contents/${path}`);
        const contents = contentsResponse.data;

        await Promise.all(contents.map(async (item) => {
            if (item.type === 'file' || item.type === 'blob') {
                fileCount++;
                if (!ymlFileContent && item.name.endsWith('.yml')) {
                    const fileResponse = await axiosInstance.get(item.url);
                    const base64Content = fileResponse.data.content;
                    ymlFileContent = Buffer.from(base64Content, 'base64').toString('utf-8');
                }
            } else if (item.type === 'dir') {
                await scanDirectory(item.path);  // Recursively scan subdirectories
            }
        }));
    } catch (error) {
        console.error(`Error scanning directory at path: ${path}`, error.message);
        throw error;
    }
};

// Start scanning
scanDirectory(scanPath)
    .then(() => {
        parentPort?.postMessage({ fileCount, ymlFileContent });
    })
    .catch((error) => {
        parentPort?.postMessage({ error: error.message });
    });
