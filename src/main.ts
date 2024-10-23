import 'reflect-metadata';
import { Application } from './rest/application.js';
import { diContainer } from './rest/container.js';


diContainer.load();

const app = diContainer.get<Application>('Application');

app.init();
