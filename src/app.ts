import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import router from './router';
import logger from './logger';
import appSession from './appSession';

const app = express();

app.use(
  ({ originalUrl, method }, _, next) => {
    logger.info(`${method}: ${originalUrl}`);
    next();
  }
);

app.set('port', config.get('port'));
app.use(appSession);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/', router);

export default app;
