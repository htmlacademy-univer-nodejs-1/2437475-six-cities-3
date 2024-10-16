import { injectable } from 'inversify';
import config from './load-env.js';
import logger from './src/logger.js';

@injectable()
export class Application {
  private initialized = false;

  public init(): void {
    if (this.initialized) {
      logger.warn('An attempt to initialize an already initialized application');
      return;
    }

    this.initialized = true;
    logger.info(`The application has been successfully initialized at port ${config.get('port')}`);
  }
}