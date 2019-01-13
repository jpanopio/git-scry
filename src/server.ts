import app from './app';

const port = app.get('port');

const server = app.listen(
  port,
  () => {
    console.log(`App running on port ${port}`);
  }
);

export default server;
