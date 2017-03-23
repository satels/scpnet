'use strict';

const express = require('express');
const http = require('http');
const sentry = require('../config/sentry');
const pino = require('../config/pino');
const expressPino = require('express-pino-logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const initRoutes = require('../config/routes');

const bullUI = require('bull-ui/app')({
    redis: {url: 'redis://localhost'}
});

const port = process.env.PORT || 4444;
const app = express();
const router = express.Router(); // eslint-disable-line new-cap

app.get('/ping', (req, res) => res.send('pong'));

app.disable('x-powered-by');
app.use(sentry.requestHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressPino({logger: pino}));

if (process.NODE_ENV !== 'production') {
    app.use(serveStatic(`${__dirname}/../public`));
}

initRoutes(router);
app.use('/', router);

app.use('/admin/queue', (req, res, next) => {
    if (req.cookies['admin_token'] === process.env.ADMIN_TOKEN) {
        res.basepath = '/admin/queue';
        res.locals.basepath = '/admin/queue';
        return next();
    } else {
        return res.send(403);
    }
}, bullUI);

app.use(sentry.errorHandler());

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    pino.error(err, 'Unhandled error');
    res.end('Internal server error');
});

const server = http.createServer(app);
server.on('listening', () => {
    pino.info(`Express server is listening on port ${server.address().port}`);
});
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            pino.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            pino.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.listen(port);
