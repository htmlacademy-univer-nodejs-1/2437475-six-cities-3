import { Container } from 'inversify';
import { Application } from './application.js';

export const diContainer = new Container();

diContainer.bind<Application>('Application').to(Application);

export default diContainer;
