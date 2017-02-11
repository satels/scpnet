const NODE_ENV = 'development';

module.exports = {
    apps: [
        {
            name: 'web',
            script: './server/services/web.js',
            watch: false,
            env: {NODE_ENV},
            interpreter: 'babel-node'
        },
        {
            name: 'worker',
            script: './server/services/worker.js',
            watch: false,
            env: {NODE_ENV},
            interpreter: 'babel-node'
        },
        {
            name: 'scheduler',
            script: './server/services/scheduler.js',
            watch: false,
            env: {NODE_ENV},
            interpreter: 'babel-node'
        }
    ]
};
