const NODE_ENV = 'production';

module.exports = {
    apps: [
        {
            name: 'web',
            script: './server/services/web.js',
            watch: true,
            instances: 4,
            exec_mode: 'cluster',
            env: {NODE_ENV}
        },
        {
            name: 'worker',
            script: './server/services/worker.js',
            watch: true,
            env: {NODE_ENV}
        },
        {
            name: 'scheduler',
            script: './server/services/scheduler.js',
            watch: true,
            env: {NODE_ENV}
        }
    ]
};
