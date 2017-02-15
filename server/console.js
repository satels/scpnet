'use strict';

require('./config/boot');
const db = require('./config/db');
const wk = require('./config/wikidot-kit');
const sentry = require('./config/sentry');
const queues = require('./config/queues');
const repl = require('repl');

const context = {db, wk, queues, sentry};

if (require.main === module) {
    const replServer = repl.start();
    replServer.context = Object.assign(replServer.context, context);
} else {
    module.exports = context;
}
