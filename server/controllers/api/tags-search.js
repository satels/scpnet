'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

module.exports = (req, res) => {
    const wiki = req.query.wiki;
    const tags = Array.isArray(req.query.tag) ? req.query.tag.join(' ') : req.query.tag;

    if (wiki && tags) {
        db.many(`
            SELECT
              wp.id,
              wp.name,
              wp.data -> 'title' AS title,
              taglist.all_tags
            FROM
              (SELECT
                 id,
                 array_agg(lower(TAG)) AS all_tags
               FROM (
                      SELECT
                        id,
                        jsonb_array_elements_text(data -> 'tags') AS TAG
                      FROM pages
                      WHERE wiki = $(wiki)
                    ) inner_tags
               GROUP BY id
               HAVING string_to_array(lower($(tags)), ' ') <@ array_agg(lower(TAG))
              ) taglist
              INNER JOIN pages wp ON wp.id = taglist.id;
        `, {wiki, tags})
            .then((result) => {
                res.send(result);
            })
            .catch((error) => {
                if (error.received === 0) {
                    res.send([]);
                } else {
                    res.status(500).send({error: 'Unhandled internal error'});
                    sentry.captureException(error, {
                        tags: {location: 'api/tags-search'},
                        extra: {wiki, tags}
                    });
                    pino.error(error);
                }
            });
    } else {
        res.status(400).send({error: 'Wiki or tags are not specified'});
    }
};
