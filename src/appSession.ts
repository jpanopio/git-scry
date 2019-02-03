import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { APP_SESSION_SECRET } from './constants/env';
import logger from './logger';

const redisClient = redis.createClient();
const RedisStore = connectRedis(session);

redisClient.on('error', (err) => {
  logger.error(`Redis Client Error - ${err}`);
});

export default session({
  name: 'id',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: APP_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
