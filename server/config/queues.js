require('./boot');
const queue = require('bull');
const sentry = require('./sentry');

const importQueue = queue('Wikidot Data Importer', process.env.REDIS_PORT, '127.0.0.1');

importQueue
    .on('error', (error) => sentry.captureException(error))
    .on('stalled', (job) => sentry.captureMessage('Job stalled', {level: 'warning', data: {job: job.data}}))
    .on('failed', (job, error) => sentry.captureException(error, {data: {job: job.data}}));

module.exports = {
    importQueue
};