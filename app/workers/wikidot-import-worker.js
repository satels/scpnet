import {importQueue} from '../config/queues';
import wk from '../config/wikidot-kit';
import sentry from '../config/sentry';
import importPage from '../jobs/import-wikidot-page';

console.log('Import worker ready');

importQueue.process((job) => {
    const params = job.data;

    switch (params.action) {

        case 'full-import':
            console.log(`Performing full import from ${params.wiki}`);
            return wk.fetchPagesList({wiki: params.wiki})
                .then((pages) => {
                    pages.forEach((pageName) => {
                        importQueue.add({
                            action: 'page-import',
                            wiki: params.wiki,
                            name: pageName
                        });
                    });
                    console.log(`Full import from ${params.wiki} enqueued`);

                    sentry.captureMessage('Full wiki pages import scheduled', {
                        level: 'info',
                        wiki: params.wiki,
                        pagesNumber: pages.length
                    });
                })
                .catch(sentry.captureException);

        case 'page-import':
            return importPage({wiki: params.wiki, name: params.name});

        default:
            console.error('Rejecting job with unknown action', params.action);
            return Promise.reject(`Unknown job import job type "${params.type}"`);
    }
});
