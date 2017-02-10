import '../config/boot';
import sentry from '../config/sentry';
import wk from '../config/wikidot-kit';
import db from '../config/db';

export default function importPage({wiki, name}) {
    return wk.fetchPage({wiki, name})
        .catch((error) => {
            console.error('Error fetching page from Wikidot', error);
            sentry.captureException(error);
        })
        .then((data) => {
            return db.query(`
                INSERT INTO pages (name, wiki, data) VALUES ($(name), $(wiki), $(data))
                ON CONFLICT (name, wiki) DO UPDATE SET data = $(data);
            `, {name, wiki, data});
        })
        .then(() => {
            console.log(`[DONE] ${wiki}/${name}`);
        })
        .catch((error) => {
            console.error('Error saving page', error);
            sentry.captureException(error);
        });
}
