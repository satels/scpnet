'use strict';

const Promise = require('bluebird');
const wk = require('../config/wikidot-kit');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const importPage = require('../tasks/wikidot-page-import');

const WIKIDOT_IMPORT_CONCURRENCY = 2;

module.exports = () => {
    pino.info('Performing full import');

    return Promise.props(wk.wikiList.reduce((acc, wiki) => {
        acc[wiki.name] = wk.fetchPagesList({wiki: wiki.name});
        return acc;
    }, {}))
    .then((pagesByWiki) => {
        const pagesToImport = [];
        Object.keys(pagesByWiki).forEach((wikiName) => {
            pagesByWiki[wikiName].forEach((pageName) => {
                pagesToImport.push({
                    wiki: wikiName,
                    name: pageName
                });
            });
        });
        return pagesToImport;
    })
    .map(({wiki, name}) => {
        return importPage({wiki, name})
            .catch((error) => {
                pino.error(error, 'Error occured during page import', wiki);
                sentry.captureException(error, {extra: {wiki, name}});
            });
    }, {concurrency: WIKIDOT_IMPORT_CONCURRENCY})
    .catch((error) => {
        pino.error(error, 'Error occured during full import');
        sentry.captureException(error);
    });
};
