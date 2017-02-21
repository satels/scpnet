'use strict';

require('../config/boot');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const wk = require('../config/wikidot-kit');
const db = require('../config/db');

exports.fetchMembersList = function importMembers({wiki}) {
    return wk.fetchMembersList({wikiURL: wiki.url})
        .catch((error) => {
            pino.error(error, 'Error importing members list');
            sentry.captureException(error, {extra: {wikiName: wiki.name}});
        });
};

exports.importUserProfile = function importMember({uid, wiki}) {
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
        });
};
