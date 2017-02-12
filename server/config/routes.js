'use strict';

const routes = [
    {
        name: 'index',
        path: '/'
    },
    {
        name: 'api/pages',
        path: '/api/pages/:wiki/:page'
    },
    {
        name: 'api/tags-list',
        path: '/_api/wikidot_tags_search/list'
    },
    {
        name: 'api/tags-search',
        path: '/_api/wikidot_tags_search/find'
    }
];

module.exports = function initRoutes(router) {
    routes.forEach((route) => {
        const method = route.method || 'get';
        router[method](route.path, require(`../controllers/${route.name}`));
    });
};
