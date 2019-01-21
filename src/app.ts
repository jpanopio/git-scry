import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();

app.set('port', config.get('port'));
app.use(bodyParser.json());
app.use('/', router);

export default app;
