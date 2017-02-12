'use strict';

const Sentry = require('raven');
const SENTRY_DSN = process.env.SENTRY_DSN;
const VERSION = require('../../package.json').version;

let sentry;

if (SENTRY_DSN) {
    Sentry.config(SENTRY_DSN, {release: VERSION}).install();
    sentry = Sentry;

    sentry.captureException = sentry.captureException.bind(sentry);
    sentry.captureMessage = sentry.captureMessage.bind(sentry);
} else {
    sentry = {
        captureMessage: () => {},
        captureException: () => {},

        requestHandler: () => (req, res, next) => next(),
        errorHandler: () => (err, req, res, next) => next(err)
    };
}

module.exports = sentry;
