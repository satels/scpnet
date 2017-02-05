import express from 'express';
import http from 'http';
import mainStory from './storyboard';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import initRoutes from './routes';

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router(); // eslint-disable-line new-cap

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

router.use((req, res, next) => {
    req.story = mainStory.child({
        src: 'request',
        title: 'Express',
        level: 'INFO'
    });
    req.story.info('Incoming request', req.path);

    const end = res.end.bind(res);
    res.end = (...args) => {
        req.story.close();
        end(...args);
    };

    next();
});

initRoutes(router);
app.use('/', router);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    (req.story || mainStory).error('Unhandled error', {attach: err});
    res.end('Internal server error');
    setImmediate(process.exit);
});

const server = http.createServer(app);
server.on('listening', () => {
    mainStory.info(`Express server is listening on port ${server.address().port}`);
});
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            mainStory.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            mainStory.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.listen(port);

export default app;
