const config = require('config');
const express = require('express');

const PORT = config.get('port');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
