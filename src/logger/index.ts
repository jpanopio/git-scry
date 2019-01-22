import {
  createLogger,
  format,
  transports,
} from 'winston';

export default createLogger({
  level: 'info',
  transports: [
    (new transports.Console({ format: format.cli() })),
  ],
});
