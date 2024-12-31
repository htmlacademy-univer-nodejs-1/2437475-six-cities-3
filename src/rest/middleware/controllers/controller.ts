import { Response, NextFunction, Router, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from '../middleware.js';

interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  // Не вполне уверена, как это починить, не переписывая половину проекта((
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: RequestHandler<any, any, any, any>;
  middlewares: Middleware[];
}

export abstract class Controller {

  public router: Router;

  constructor() {
    this.router = Router();
  }

  protected addRoute(route: Route): void {
    const { path, method, handler, middlewares } = route;
    this.router[method](path, ...middlewares, handler);
  }

  protected sendResponse<T>(res: Response, statusCode: number, data?: T): void {
    res.status(statusCode).json(data || {});
  }

  protected handleSuccess<T>(res: Response, data?: T): void {
    this.sendResponse(res, StatusCodes.OK, data);
  }

  protected handleCreated<T>(res: Response, data?: T): void {
    this.sendResponse(res, StatusCodes.CREATED, data);
  }

  protected handleError(
    next: NextFunction,
    error: Error
  ): void {
    next(error);
  }
}
