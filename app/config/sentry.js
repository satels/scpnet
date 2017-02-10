import Sentry from 'raven';

const SENTRY_DSN = process.env.SENTRY_DSN;

let sentry = null;

if (SENTRY_DSN) {
    Sentry.config(SENTRY_DSN).install();
    sentry = Sentry;
}


export default sentry;
