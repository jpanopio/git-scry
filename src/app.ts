import config from 'config';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { APP_SESSION_SECRET } from './constants/env';
import router from './router';
import logger from './logger';

const app = express();

app.use(
  ({ originalUrl, method }, _, next) => {
    logger.info(`${method}: ${originalUrl}`);
    next();
  }
);

app.use(
  session({
    name: 'id',
    secret: APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.set('port', config.get('port'));
app.use(bodyParser.json());
app.use('/', router);

export default app;
