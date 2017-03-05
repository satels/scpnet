'use strict';

const {importQueue, commonQueue} = require('../config/queues');
const wk = require('../config/wikidot-kit');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const importPage = require('../tasks/import-wikidot-page');
const {fetchMembersList, importUserProfile} = require('../tasks/import-wikidot-members');
const extractObjectTitles = require('../tasks/extract-object-titles');
const addDiscordMemberRoles = require('../tasks/add-discord-member-roles');

const QUEUE_INSERTS_CONCURRENCY = 4;

pino.info('Import worker ready');

importQueue.process((job) => {
    const params = job.data;

    switch (params.action) {

        case 'full-import':
            pino.info(`Performing full import from ${params.wiki.name}`);
            return wk.fetchPagesList({wiki: params.wiki.name})
                .map((pageName) => {
                    return importQueue.add({
                        action: 'page-import',
                        wiki: params.wiki.name,
                        name: pageName
                    });
                }, {concurrency: QUEUE_INSERTS_CONCURRENCY})
                .catch((error) => {
                    pino.error(error, 'Error occured during full import', params);
                    sentry.captureException(error, {extra: params});
                });

        case 'page-import':
            return importPage({wiki: params.wiki, name: params.name});

        case 'members-import':
            pino.info(`Performing members import from ${params.wiki.name}`);
            return fetchMembersList({wiki: params.wiki})
                .map(({uid}) => {
                    return importQueue.add({
                        action: 'user-profile-import',
                        wiki: params.wiki,
                        uid
                    });
                }, {concurrency: QUEUE_INSERTS_CONCURRENCY})
                .catch((error) => {
                    pino.error(error, 'Error occured during members import', params);
                    sentry.captureException(error, {extra: params});
                });

        case 'user-profile-import':
            pino.info(`Performing UID ${params.uid} import from ${params.wiki.name}`);
            return importUserProfile({uid: params.uid, wiki: params.wiki});

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

        case 'add-discord-member-roles':
            return addDiscordMemberRoles();

        default:
            pino.error(`Rejecting job with unknown action "${params.action}"`);
            return Promise.reject(`Unknown job import job type "${params.type}"`);
    }
});
