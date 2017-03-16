'use strict';

const routes = [
    {
        name: 'index',
        path: '/'
    },
    {
        name: 'api/pages',
        path: '/api/pages/:wiki'
    },
    {
        name: 'api/pages',
        path: '/api/pages/:wiki/:page'
    },
    {
        name: 'api/random-page',
        path: '/api/random_page'
    },
    {
        name: 'api/tags-list',
        path: '/_api/wikidot_tags_search/list'
    },
    {
        name: 'api/tags-search',
        path: '/_api/wikidot_tags_search/find'
    },
    {
        name: 'api/untranslated-list',
        path: '/_api/wanted_translations/list'
    },
    {
        name: 'wikidot/random-page',
        path: '/wikidot_random_page'
    },
    {
        name: 'wikidot/mobile-redirect',
        path: '/wikidot_mobile_redirect_frame/:name'
    },
    {
        name: 'wikidot/last-thread-post-redirect',
        path: '/wikidot_last_thread_post_redirect'
    }
];

module.exports = function initRoutes(router) {
    routes.forEach((route) => {
        const method = route.method || 'get';
        router[method](route.path, require(`../controllers/${route.name}`));
    });
};
