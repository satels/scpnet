import '../config/boot';
import sentry from '../config/sentry';
import pino from '../config/pino';
import wk from '../config/wikidot-kit';
import db from '../config/db';

export default function importPage({wiki, name}) {
    return wk.fetchPage({wiki, name})
        .catch((error) => {
            pino.error(error, 'Error fetching page from Wikidot');
            sentry.captureException(error, {extra: {wiki, name}});
        })
        .then((data) => {
            return db.query(`
                INSERT INTO pages (name, wiki, data) VALUES ($(name), $(wiki), $(data))
                ON CONFLICT (name, wiki) DO UPDATE SET data = $(data);
            `, {name, wiki, data});
        })
        .then(() => {
            pino.info(`[DONE] ${wiki}/${name}`);
        })
        .catch((error) => {
            pino.error(error, 'Error saving page');
            sentry.captureException(error, {extra: {wiki, name}});
        });
}
