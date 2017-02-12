'use strict';

require('./boot');
const bull = require('bull');
const sentry = require('./sentry');

function addListenersToQueue(queue) {
    queue
        .on('error', (error) => sentry.captureException(error))
        .on('stalled', (job) => sentry.captureMessage('Job stalled', {level: 'warning', extra: {job: job.data}}))
        .on('failed', (job, error) => sentry.captureException(error, {extra: {job: job.data}}));

    return queue;
}

const importQueue = addListenersToQueue(bull('wikidot-import', process.env.REDIS_PORT, '127.0.0.1'));
const commonQueue = addListenersToQueue(bull('common-import', process.env.REDIS_PORT, '127.0.0.1'));

module.exports = {
    importQueue,
    commonQueue
};
