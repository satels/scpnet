'use strict';

const NODE_ENV = 'development';

module.exports = {
    apps: [
        {
            name: 'web',
            script: './server/services/web.js',
            watch: false,
            env: {NODE_ENV}
        },
        {
            name: 'worker',
            script: './server/services/worker.js',
            watch: false,
            env: {NODE_ENV}
        }
    ]
};
