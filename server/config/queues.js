'use strict';

const bull = require('bull');
const pino = require('../config/pino');
const sentry = require('./sentry');

function addListenersToQueue(queue) {
    queue
        .on('error', (error) => {
            pino.error(error, 'Error occured during full import');
            sentry.captureException(error);
        })
        .on('stalled', (job) => {
            pino.warn('Job stalled', job);
            sentry.captureMessage('Job stalled', {level: 'warning', extra: {job: job.data}});
        })
        .on('failed', (job, error) => {
            pino.error(error, 'Job failed with error', job);
            sentry.captureException(error, {extra: {job: job.data}});
        });

    return queue;
}

const importQueue = addListenersToQueue(bull('wikidot-import', 6379, '127.0.0.1'));
const commonQueue = addListenersToQueue(bull('common-import', 6379, '127.0.0.1'));

module.exports = {
    importQueue,
    commonQueue
};
