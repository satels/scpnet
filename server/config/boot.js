'use strict';

require('dotenv').config();
require('./db');

process.env.REDIS_PORT = process.env.REDIS_PORT || 6379;
