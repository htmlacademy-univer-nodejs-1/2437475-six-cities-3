import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import FavoriteService from '../../../db/services/favorite-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { FavoriteDTO } from '../../../db/dto/favorite.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';
import { checkEntityExists } from '../check-entity-exists.js';
import favoriteService from '../../../db/services/favorite-service.js';
import { authenticate } from '../auth-middleware.js';

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
      middlewares: [authenticate, validateDTO(FavoriteDTO)],
    });

    this.addRoute({
      path: '/',
      method: 'delete',
      handler: asyncHandler(this.removeFavorite.bind(this)),
      middlewares: [authenticate, validateDTO(FavoriteDTO)],
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: asyncHandler(this.getFavorites.bind(this)),
      middlewares: [ValidateObjectIdMiddleware, checkEntityExists(favoriteService, 'id')],
    });
  }

  private async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user.id;
      const { rentOffer } = req.body;
      const favorite = await FavoriteService.addFavorite({ user: userId, rentOffer });
      this.handleCreated(res, favorite);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user.id;
      const { rentOffer } = req.body;

      const favorite = await FavoriteService.findFavorite(userId, rentOffer);
      if (!favorite) {
        return next(new Error('Favorite not found or does not belong to you'));
      }

      await FavoriteService.removeFavorite({ user: userId, rentOffer });
      this.handleSuccess(res);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getFavorites(_req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      this.handleSuccess(res, res.locals.entity);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }
}

export default new FavoriteController().router;
