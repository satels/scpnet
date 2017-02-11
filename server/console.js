import './config/boot';
import db from './config/db';
import sentry from './config/sentry';
import * as queues from './config/queues';
import repl from 'repl';

const context = {db, queues, sentry};

if (require.main === module) {
    const replServer = repl.start();
    replServer.context = Object.assign(replServer.context, context);
} else {
    module.exports = context;
}
