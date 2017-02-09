import './config/boot';
import db from './config/db';
import * as queues from './config/queues';
import repl from 'repl';

const context = {db, queues};

if (require.main === module) {
    const replServer = repl.start();
    replServer.context = Object.assign(replServer.context, context);
} else {
    module.exports = context;
}
