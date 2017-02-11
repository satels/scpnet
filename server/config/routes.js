'use strict';

const routes = [
    {
        name: 'index',
        path: '/'
    },
    {
        name: 'api/pages',
        path: '/api/pages/:wiki/:page'
    }
];

module.exports = function initRoutes(router) {
    routes.forEach((route) => {
        const method = route.method || 'get';
        router[method](route.path, require(`../controllers/${route.name}`));
    });
};
