'use strict';

require('../config/boot');
require('../config/schedule');
const pino = require('../config/pino');

pino.info('Scheduler inited');
