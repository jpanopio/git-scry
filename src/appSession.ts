import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { APP_SESSION_SECRET } from './constants/env';
import logger from './logger';

const redisClient = redis.createClient();
const RedisStore = connectRedis(session);

redisClient.on('ready', () => logger.info('Redis client connection established'));

redisClient.on('error', (err) => {
  logger.error(`Redis client error - ${err}`);
});

export default session({
  name: 'scry-id',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: APP_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
