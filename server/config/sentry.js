import Sentry from 'raven';

const SENTRY_DSN = process.env.SENTRY_DSN;

let sentry;

if (SENTRY_DSN) {
    Sentry.config(SENTRY_DSN).install();
    sentry = Sentry;
} else {
    sentry = {
        captureMessage: () => {},
        captureExecption: () => {},

        requestHandler: () => (req, res, next) => next(),
        errorHandler: () => (err, req, res, next) => next(err)
    };
}

export default sentry;
