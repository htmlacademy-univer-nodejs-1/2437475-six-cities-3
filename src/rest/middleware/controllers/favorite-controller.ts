import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import FavoriteService from '../../../db/services/favorite-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { FavoriteDTO } from '../../../db/dto/favorite.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';

class FavoriteController extends Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.addRoute({
      path: '/',
      method: 'post',
      handler: asyncHandler(this.addFavorite.bind(this)),
      middlewares: [validateDTO(FavoriteDTO)],
    });

    this.addRoute({
      path: '/',
      method: 'delete',
      handler: asyncHandler(this.removeFavorite.bind(this)),
      middlewares: [validateDTO(FavoriteDTO)],
    });

    this.addRoute({
      path: '/:userId',
      method: 'get',
      handler: asyncHandler(this.getFavorites.bind(this)),
      middlewares: [ValidateObjectIdMiddleware],
    });
  }

  private async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorite = await FavoriteService.addFavorite(req.body);
      this.handleCreated(res, favorite);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await FavoriteService.removeFavorite(req.body);
      this.handleSuccess(res);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getFavorites(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorites = await FavoriteService.getFavorites(req.params.userId);
      this.handleSuccess(res, favorites);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }
}

export default new FavoriteController().router;
