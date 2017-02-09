import './boot';
import queue from 'bull';

const importQueue = queue('Wikidot Data Importer', process.env.REDIS_PORT, '127.0.0.1');

export {
    importQueue
};
