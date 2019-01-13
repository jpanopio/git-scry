import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.set('port', config.get('port'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

export default app;
