import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export abstract class Controller {
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
