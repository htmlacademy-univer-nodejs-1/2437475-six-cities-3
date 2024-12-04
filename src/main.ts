import 'reflect-metadata';
import { Application } from './rest/application.js';
import { diContainer } from './rest/container.js';
import logger from './logger/logger.js';
// import { importData } from './cli/import.js';
// import mongoose from 'mongoose';


diContainer.load();

const app = diContainer.get<Application>('Application');

try {
  await app.init();
  // mongoose.connection.on('connected', async () => {
  //   try {
  //     await importData('./mocks/test_data.tsv');
  //     logger.info('Data has been successfully imported into the database.');
  //   } catch (error: any) {
  //     logger.error(`Error when saving data to the database: ${error.message}`);
  //   }
  // });
  // await mongoose.disconnect();
} catch (err) {
  if (err instanceof Error) {
    logger.error(`Failed to initialize the application: ${err.message}`);
  } else {
    logger.error(`Unknown error during initialization: ${JSON.stringify(err)}`);
  }
}
