'use strict';

const sentry = require('../config/sentry');
const pino = require('../config/pino');
const wk = require('../config/wikidot-kit');
const db = require('../config/db');

const UID_BLACKLIST = [2335308];
const WIKIDOT_IMPORT_CONCURRENCY = 2;

function fetchMembersList({wiki}) {
    return wk.fetchMembersList({wikiURL: wiki.url})
        .filter((user) => !UID_BLACKLIST.includes(user.uid))
        .catch((error) => {
            pino.error(error, 'Error importing members list');
            sentry.captureException(error, {extra: {wikiName: wiki.name}});
        });
}

function importUserProfile({uid, wiki}) {
    return wk.fetchUserProfile({uid, wikiURL: wiki.url})
        .then(({username, about, userSince, memberSince}) => {
            const memberships = {[wiki.name]: memberSince};
            return db.query(`
                        INSERT INTO wikidot_users AS wk_users (uid, username, about, registration_date, memberships)
                        VALUES($(uid), $(username), $(about), $(userSince), $(memberships))
                        ON CONFLICT (uid) DO UPDATE SET
                            username = $(username),
                            about = $(about),
                            memberships = wk_users.memberships || $(memberships)
                    `, {uid, username, about, userSince, memberships});
        })
        .catch((error) => {
            pino.error(error, 'Error importing member profile');
            sentry.captureException(error, {extra: {uid, wikiName: wiki.name}});
        });
}

module.exports = function importWikiMembers(wikiName) {
    const wiki = wk.wiki[wikiName];
    if (!wiki) {
        return Promise.reject(new Error(`Unknown wiki ${wikiName}`));
    }
    return fetchMembersList({wiki})
        .map(({uid}) => {
            return importUserProfile({uid, wiki});
        }, {concurrency: WIKIDOT_IMPORT_CONCURRENCY})
        .catch((error) => {
            pino.error(error, 'Error occured during members import', wiki);
            sentry.captureException(error, {extra: wiki});
        });
};
