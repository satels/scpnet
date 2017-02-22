'use strict';

const POSTGRES_DSN = process.env.SCPNET_POSTGRES_DSN || process.env.POSTGRES_DSN;

module.exports = {
    development: {
        client: 'pg',
        connection: POSTGRES_DSN
    },

    production: {
        client: 'pg',
        connection: POSTGRES_DSN
    }
};
