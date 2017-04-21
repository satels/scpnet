'use strict';

const db = require('./../config/db');
const wk = require('./../config/wikidot-kit');
const sentry = require('./../config/sentry');
const repl = require('repl');

const context = {db, wk, sentry};

if (require.main === module) {
    const replServer = repl.start();
    replServer.context = Object.assign(replServer.context, context);
} else {
    module.exports = context;
}
