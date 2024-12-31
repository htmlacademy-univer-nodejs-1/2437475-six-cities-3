import express, { Express } from 'express';
import { injectable } from 'inversify';
import logger from '../logger/logger.js';
import RentOfferController from './middleware/controllers/rent-offer-controller.js';
import { exceptionFilter } from './middleware/exceptionFilter.js';
import connectToDatabase from '../db/db.js';
// import RentOfferModel from '../db/models/rent-offer.js';
import UserController from './middleware/controllers/user-controller.js';
import FavoriteController from './middleware/controllers/favorite-controller.js';
import CommentController from './middleware/controllers/comment-controller.js';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';

/*
в cmd, в этой папке:
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\",\"password\":\"password123\",\"name\":\"Test User\",\"type\":\"pro\"}"
curl -X GET http://localhost:3000/api/users/6748af592282ed9dc2c19e2f

curl -X POST http://localhost:3000/api/users/6748af592282ed9dc2c19e2f/avatar

Шесть предложений:
curl -X GET http://localhost:3000/api/rent-offers -H "Content-Type: application/json" -d "{\"limit\":6}"
60 предложений (без цифры):
curl -X GET http://localhost:3000/api/rent-offers
Конкретное предложение:
curl -X GET http://localhost:3000/api/rent-offers/67725f5ee9400affef92dc4b

Премиальные в городе:
curl -X GET "http://localhost:3000/api/rent-offers/premium?city=Paris"

Чтобы Войти (и получить токен):
curl -X POST http://localhost:3000/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"testtesttest1@example.com\",\"password\":\"test123test\"}"

Зарегистрировать фаворит (Аналогично с DELETE его снять):
curl -X POST http://localhost:3000/api/favorites -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"user\":\"675559ad7644d955eb55f334\",\"rentOffer\":\"67489fe569fc91a9a0259bfb\"}"

Узнать статус пользователя:
curl -X GET http://localhost:3000/api/users/status -H "Authorization: Bearer <token>"

Создать приложение (учитывать токен и id user):
curl -X POST http://localhost:3000/api/rent-offers -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"user\":\"675559ad7644d955eb55f334\", \"name\": \"Name name name\", \"description\": \"Name Name Name Name Name Name\", \"publishedAt\": \"2024-08-24T00:00:00.000Z\", \"city\": \"Brussels\", \"previewImage\": \"https://example.com/preview1.jpg\", \"images\": [\"https://example.com/photo1.jpg\", \"https://example.com/photo2.jpg\"], \"premium\": true, \"favorite\": false, \"rating\": 4, \"type\": \"apartment\", \"rooms\": 3, \"guests\": 4, \"price\": 85000, \"features\": [\"Wi-Fi\", \"TV\", \"Air Conditioning\", \"Fridge\"], \"coordinates\": {\"latitude\": 50.846557, \"longitude\": 4.351697}}"

Комментарий (токен, автор и предложение):
curl -X POST http://localhost:3000/api/comments -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"text\":\"teeeext\", \"rating\":4.5, \"author\":\"675559ad7644d955eb55f334\", \"rentOffer\":\"671a9a9ef68a7e515c41a72d\"}"

Узнать фавориты пользователя:
curl -X GET http://localhost:3000/api/favorites/675559ad7644d955eb55f334
 */

const ensureUploadsDir = () => {
  dotenv.config();
  const baseDir = process.env.UPLOADS_DIR || './uploads';
  const avatarsDir = path.join(baseDir, 'avatars');

  [baseDir, avatarsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

@injectable()
export class Application {
  private app: Express;
  private initialized = false;

  constructor() {
    this.app = express();
  }

  public async init(): Promise<void> {
    dotenv.config();
    if (this.initialized) {
      logger.warn('An attempt to initialize an already initialized application');
      return;
    }

    ensureUploadsDir();

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
    dotenv.config();
    this.app.use(express.json());

    const uploadsDir = process.env.UPLOADS_DIR || './uploads';
    this.app.use('/uploads', express.static(path.resolve(uploadsDir)));
    logger.info(`Static files served from ${uploadsDir}`);
  }

  private registerRoutes(): void {
    this.app.use('/api/rent-offers', RentOfferController);
    this.app.use('/api/users', UserController);
    this.app.use('/api/favorites', FavoriteController);
    this.app.use('/api/comments', CommentController);
  }

  private registerExceptionFilters(): void {
    this.app.use(exceptionFilter);
  }
}
