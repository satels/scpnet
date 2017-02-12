'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

module.exports = (req, res) => {
    const wiki = req.query.wiki;

    if (wiki) {
        db.many(`
            SELECT DISTINCT jsonb_array_elements_text(data -> 'tags') as tag
            FROM "pages"
            WHERE "pages"."wiki" = $(wiki);
        `, {wiki})
            .then((result) => {
                res.send(result.map((t) => t.tag));
            })
            .catch((error) => {
                res.status(500).send({error: 'Unhandled internal error'});
                sentry.captureException(error, {
                    tags: {location: 'api/tags-list'},
                    extra: {wiki}
                });
                pino.error(error);
            });
    } else {
        res.status(400).send({error: 'Wiki is not specified'});
    }
};

