import dotenv from 'dotenv';
import config from './config.js';
import logger from '../logger/logger.js';

dotenv.config();

if (!process.env.PORT || !process.env.DB_HOST || !process.env.SALT) {
  throw new Error('Необходимо установить все обязательные переменные окружения');
}

config.set('port', Number(process.env.PORT));
config.set('dbHost', process.env.DB_HOST);
config.set('salt', process.env.SALT);

logger.info(`Application initialized at port ${config.get('port')}`);
logger.info(`Application initialized at host ${config.get('dbHost')}`);
logger.info(`Application initialized with salt ${config.get('salt')}`);

logger.debug('The configuration has been uploaded successfully');

export default config;
