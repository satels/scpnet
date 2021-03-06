'use strict';

const db = require('../../config/db');
const sentry = require('../../config/sentry');
const pino = require('../../config/pino');

module.exports = (req, res) => {
    db.one('SELECT name FROM random_page')
        .then((result) => {
            res.send({name: result.name});
        })
        .catch((error) => {
            res.status(500).send({error: 'Unhandled internal error'});
            sentry.captureException(error, {
                tags: {location: 'api/random-page'}
            });
            pino.error(error);
        });
};

