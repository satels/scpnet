'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

const HEADER_API_V1 = 'application/vnd.scpnet.v1+json';

module.exports = (req, res) => {
    const wiki = req.params.wiki;
    const page = req.params.page;
    const tags = Array.isArray(req.query.tag) ?
        req.query.tag :
        [req.query.tag];

    if (req.headers.accept !== HEADER_API_V1) {
        res.set('API-Version-Warning',
            'API Version should be specified in accept header (example: "Accept: application/vnd.scpnet.v1+json")'
        );
    }

    if (wiki && page) {
        // /api/pages/scp-ru/scp-173
        db.oneOrNone(`
            SELECT
              data as meta,
              coalesce(data -> 'extracted_title', data -> 'title') AS title,
              data -> 'html' as html,
              data -> 'content' as content
            FROM pages
            WHERE wiki = $(wiki) AND name = $(page)
        `, {wiki, page})
            .then((result) => {
                if (result) {
                    const excessiveFields = ['html', 'content', 'title', 'extracted_title'];
                    excessiveFields.forEach((field) => delete result.meta[field]);
                    res.send(result, null, 2);
                } else {
                    res.status(404).send({result: 'Page not found'});
                }
            })
            .catch((error) => {
                res.status(500).send({error: 'Unhandled internal error'});
                sentry.captureException(error, {
                    tags: {location: 'api/pages'},
                    extra: {wiki, page}
                });
                pino.error(error);
            });
    } else if (wiki && tags) {
        // /api/pages/scp-ru/?tag=object
        db.manyOrNone(`
            SELECT
              id,
              name,
              data -> 'title' as title,
              data -> 'tags' as tags
            FROM pages
            WHERE
              wiki = $(wiki)
            AND
              data -> 'tags' @> $(tags:json)
        `, {wiki, tags})
            .then((result) => {
                if (result) {
                    res.send(result);
                } else {
                    res.status(200).send([]);
                }
            });
    } else {
        res.send(400);
    }
};
