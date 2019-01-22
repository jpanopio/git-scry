import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import router from './router';
import logger from './logger';

const app = express();

app.use(
  ({ originalUrl, method }, _, next) => {
    logger.info(`${method}: ${originalUrl}`);
    next();
  }
);

app.set('port', config.get('port'));
app.use(bodyParser.json());
app.use('/', router);

export default app;
