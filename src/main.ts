import 'reflect-metadata';
import { Application } from './rest/application.js';
import { diContainer } from './rest/container.js';
import logger from './logger/logger.js';


diContainer.load();

const app = diContainer.get<Application>('Application');

try {
  await app.init();
} catch (err) {
  if (err instanceof Error) {
    logger.error(`Failed to initialize the application: ${err.message}`);
  } else {
    logger.error(`Unknown error during initialization: ${JSON.stringify(err)}`);
  }
}
