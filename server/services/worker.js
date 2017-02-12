'use strict';

const {importQueue, commonQueue} = require('../config/queues');
const wk = require('../config/wikidot-kit');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const importPage = require('../jobs/import-wikidot-page');
const extractObjectTitles = require('../jobs/extract-object-titles');

pino.info('Import worker ready');

const WIKIDOT_IMPORT_CONCURRENCY = 2;

importQueue.process((job) => {
    const params = job.data;

    switch (params.action) {

        case 'full-import':
            pino.info(`Performing full import from ${params.wiki}`);
            return wk.fetchPagesList({wiki: params.wiki})
                .then((pages) => {
                    pino.info(`Full import from ${params.wiki} enqueued`);
                    sentry.captureMessage('Full wiki pages import scheduled', {
                        level: 'info',
                        extra: {
                            wiki: params.wiki,
                            pagesNumber: pages.length
                        }
                    });

                    job.progress(`0/${pages.length}`);

                    return pages.map((pageName) => {
                        return {
                            name: pageName,
                            wiki: params.wiki,
                            total: pages.length
                        };
                    });
                })

                .map(({name, wiki, total}) => {
                    return importPage({wiki, name}).then(() => {
                        const current = parseInt(job.progress().split('/')[0], 10) + 1;
                        return job.progress(`${current}/${total}`);
                    });
                }, {concurrency: WIKIDOT_IMPORT_CONCURRENCY})

                .then(() => {
                    sentry.captureMessage('Full wiki pages import succeeded', {
                        level: 'info',
                        extra: {
                            wiki: params.wiki
                        }
                    });
                    pino.info(`Full import from ${params.wiki} completed`);

                    return 'done';
                })
                .catch((error) => {
                    pino.error(error, 'Error occured during full import', params);
                    sentry.captureException(error, {extra: params});
                });

        case 'page-import':
            return importPage({wiki: params.wiki, name: params.name});

        default:
            pino.error(`Rejecting job with unknown action "${params.action}"`);
            return Promise.reject(`Unknown job import job type "${params.type}"`);
    }
});

commonQueue.process((job) => {
    const params = job.data;

    switch (params.action) {

        case 'extract-object-titles':
            return extractObjectTitles();

        default:
            pino.error(`Rejecting job with unknown action "${params.action}"`);
            return Promise.reject(`Unknown job import job type "${params.type}"`);
    }
});
