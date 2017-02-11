'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

const HEADER_API_V1 = 'application/vnd.scpnet.v1+json';

module.exports = (req, res) => {
    const wiki = req.params.wiki;
    const page = req.params.page;

    if (req.headers.accept !== HEADER_API_V1) {
        res.set('API-Version-Warning',
            'API Version should be specified in accept header (example: "Accept: application/vnd.scpnet.v1+json")'
        );
    }

    if (wiki && page) {
        db.one('SELECT data from pages WHERE wiki = $(wiki) AND name = $(page)', {wiki, page})
            .then((result) => {
                res.send(result);
            })
            .catch((error) => {
                if (error.received === 0) {
                    res.status(404).send({result: 'Page not found'});
                } else {
                    res.status(500).send({error: 'Unhandled internal error'});
                    sentry.captureException(error, {
                        tags: {location: 'api/pages'},
                        extra: {wiki, page}
                    });
                    pino.error(error);
                }
            });
    } else {
        res.send(400);
    }
};
