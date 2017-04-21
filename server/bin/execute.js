'use strict';

const sentry = require('../config/sentry');
const pino = require('../config/pino');

const exit = () => process.nextTick(() => process.exit());
const task = process.argv[2];
const taskArgument = process.argv[3];

require(`../tasks/${task}`)(taskArgument)
    .then(exit)
    .catch((error) => {
        pino.error(error, 'Error occured during task execution', {task, taskArgument});
        sentry.captureException(error, {extra: {task, taskArgument}});
        exit();
    });
