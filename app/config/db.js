import pgp from 'pg-promise';
import monitor from 'pg-monitor';
import Bluebird from 'bluebird';

const options = {
    promiseLib: Bluebird
};

const db = pgp(options)(process.env.POSTGRES_DSN);
monitor.attach(options);

export default db;
