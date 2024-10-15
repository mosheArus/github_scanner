import pLimit from 'p-limit';

// Modified limitConcurrency to accept a custom concurrency limit
const limitConcurrency = (tasks: any[], concurrencyLimit: number) => {
  const limit = pLimit(concurrencyLimit);
  return Promise.all(tasks.map(task => limit(() => task())));
};

export default limitConcurrency;
