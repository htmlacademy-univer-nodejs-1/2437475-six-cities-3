import 'reflect-metadata';
import { Application } from '../application.js';
import { diContainer } from '../container.js';


diContainer.load();

const app = diContainer.get<Application>('Application');

app.init();
