'use strict';

require('dotenv').config({path: '../.env'});

module.exports = {
    development: {
        client: 'pg',
        connection: process.env.POSTGRES_DSN
    },

    production: {
        client: 'pg',
        connection: process.env.POSTGRES_DSN
    }
};
