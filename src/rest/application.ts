import express, { Express } from 'express';
import { injectable } from 'inversify';
import logger from '../logger/logger.js';
import RentOfferController from './middleware/controllers/rent-offer-controller.js';
import { exceptionFilter } from './middleware/exceptionFilter.js';
import connectToDatabase from '../db/db.js';
// import RentOfferModel from '../db/models/rent-offer.js';
import UserController from './middleware/controllers/user-controller.js';
import FavoriteController from './middleware/controllers/favorite-controller.js';

/*
в cmd, в этой папке:
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\",\"password\":\"password123\",\"name\":\"Test User\",\"type\":\"pro\"}"
curl -X GET http://localhost:3000/api/users/6748af592282ed9dc2c19e2f
 */

@injectable()
export class Application {
  private app: Express;
  private initialized = false;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    if (this.initialized) {
      logger.warn('An attempt to initialize an already initialized application');
      return;
    }

    await connectToDatabase();

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerExceptionFilters();

    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });

    this.app.get('/', (_req, res) => {
      res.send('Welcome to the API!');
      logger.info('Get request success');
    });

    // this.app.get('/', async (_req, res, next) => {
    //   try {
    //     const rentOffers = await RentOfferModel.find();
    //     res.json(rentOffers);
    //     logger.info('rentOffers get')
    //   } catch (error) {
    //     next(error);
    //   }
    // })

    this.initialized = true;
    logger.info(`The application has been successfully initialized at port ${port}`);
  }

  private registerMiddlewares(): void {
    this.app.use(express.json());
  }

  private registerRoutes(): void {
    this.app.use('/api/rent-offers', RentOfferController);
    this.app.use('/api/users', UserController);
    this.app.use('/api/favorites', FavoriteController);
  }

  private registerExceptionFilters(): void {
    this.app.use(exceptionFilter);
  }
}
