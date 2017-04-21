'use strict';

const wk = require('../config/wikidot-kit');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const importPage = require('../tasks/wikidot-page-import');

const WIKIDOT_IMPORT_CONCURRENCY = 2;

module.exports = ({wikiName}) => {
    pino.info(`Performing full import from ${wikiName}`);

    const wiki = wk.wiki[wikiName];
    return wk.fetchPagesList({wiki})
        .map((pageName) => {
            return importPage({wiki, name: pageName})
                .catch((error) => {
                    pino.error(error, 'Error occured during page import', wiki);
                    sentry.captureException(error, {extra: {wiki, page: pageName}});
                });
        }, {concurrency: WIKIDOT_IMPORT_CONCURRENCY})
        .catch((error) => {
            pino.error(error, 'Error occured during full import', wiki);
            sentry.captureException(error, {extra: {wiki}});
        });
};
