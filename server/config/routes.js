
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

export default function initRoutes(router) {
    routes.forEach((route) => {
        const method = route.method || 'get';
        router[method](route.path, require(`../controllers/${route.name}`).default);
    });
}
