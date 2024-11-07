import { Container } from 'inversify';
import { Application } from './application.js';
import RentOfferModel from '../db/models/rent-offer.js';
import UserModel from '../db/models/user.js';
import userService from '../db/services/user-service.js';
import rentOfferService from '../db/services/rent-offer-service.js';

export const diContainer = new Container();

diContainer.bind<Application>('Application').to(Application);

diContainer.bind<typeof UserModel>('UserModel').toConstantValue(UserModel);
diContainer.bind<typeof RentOfferModel>('RentOfferModel').toConstantValue(RentOfferModel);

diContainer.bind<typeof userService>('UserService').toConstantValue(userService);
diContainer.bind<typeof rentOfferService>('RentOfferService').toConstantValue(rentOfferService);

export default diContainer;
