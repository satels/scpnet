import {importQueue} from '../config/queues';
import wk from '../config/wikidot-kit';
import sentry from '../config/sentry';
import pino from '../config/pino';
import importPage from '../jobs/import-wikidot-page';

pino.info('Import worker ready');

importQueue.process((job) => {
    const params = job.data;

    switch (params.action) {

        case 'full-import':
            pino.info(`Performing full import from ${params.wiki}`);
            return wk.fetchPagesList({wiki: params.wiki})
                .then((pages) => {
                    pages.forEach((pageName) => {
                        importQueue.add({
                            action: 'page-import',
                            wiki: params.wiki,
                            name: pageName
                        });
                    });
                    pino.info(`Full import from ${params.wiki} enqueued`);

                    sentry.captureMessage('Full wiki pages import scheduled', {
                        level: 'info',
                        wiki: params.wiki,
                        pagesNumber: pages.length
                    });
                })
                .catch((error) => {
                    pino.error(error, 'Error fetching page list during full import', params);
                    sentry.captureException(error, {data: params});
                });

        case 'page-import':
            return importPage({wiki: params.wiki, name: params.name});

        default:
            pino.error(`Rejecting job with unknown action "${params.action}"`);
            return Promise.reject(`Unknown job import job type "${params.type}"`);
    }
});
