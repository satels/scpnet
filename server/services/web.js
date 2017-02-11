import '../config/boot';
import express from 'express';
import http from 'http';
import sentry from '../config/sentry';
import pino from '../config/pino';
import expressPino from 'express-pino-logger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import initRoutes from '../config/routes';

const port = process.env.PORT || 4444;
const app = express();
const router = express.Router(); // eslint-disable-line new-cap

app.disable('x-powered-by');
app.use(sentry.requestHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressPino({logger: pino}));

app.use(serveStatic(`${__dirname}/../public`));

initRoutes(router);
app.use('/', router);

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

export default app;
