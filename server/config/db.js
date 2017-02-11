const pgp = require('pg-promise');
const monitor = require('pg-monitor');
const Bluebird = require('bluebird');

const options = {
    promiseLib: Bluebird
};

const db = pgp(options)(process.env.POSTGRES_DSN);
monitor.attach(options);

module.exports = db;
