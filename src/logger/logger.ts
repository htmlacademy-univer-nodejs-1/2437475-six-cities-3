import { pino } from 'pino';
import dotenv from 'dotenv';
dotenv.config();

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
    },
  },
});

export default logger;
