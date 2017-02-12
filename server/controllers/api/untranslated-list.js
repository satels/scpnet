'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

module.exports = (req, res) => {
    db.manyOrNone(`
        SELECT
          wp1.name,
          coalesce(wp1.data -> 'extracted_title', wp1.data -> 'title') AS title,
          wp1.data -> 'rating'                                         AS rating
        FROM pages wp1
        WHERE name ~ '^scp-[0-9]{3,4}$' AND wiki = 'scp-wiki' -- begin string, SCP, 3 or 4 numbers, end string
              AND NOT EXISTS(SELECT 1
                             FROM pages wp2
                             WHERE wp2.wiki = 'scp-ru' AND wp2.name = wp1.name)
        ORDER BY rating DESC;
    `)
        .then(result => res.send(result))

        .catch((error) => {
            if (error.received === 0) {
                res.send([]);
            } else {
                res.status(500).send({error: 'Unhandled internal error'});
                sentry.captureException(error, {
                    tags: {location: 'api/untranslated-list'}
                });
                pino.error(error);
            }
        });
};
