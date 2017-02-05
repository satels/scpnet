
const routes = [
    {
        name: 'index',
        path: '/'
    }
];

export default function initRoutes(router) {
    routes.forEach((route) => {
        const method = route.method || 'get';
        router[method](route.path, require(`../controllers/${route.name}`).default);
    });
}
