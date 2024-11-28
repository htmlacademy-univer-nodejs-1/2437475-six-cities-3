import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import FavoriteService from '../../../db/services/favorite-service.js';
import { Controller } from './controller.js';

class FavoriteController extends Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', asyncHandler(this.addFavorite.bind(this)));
    this.router.delete('/', asyncHandler(this.removeFavorite.bind(this)));
    this.router.get('/:userId', asyncHandler(this.getFavorites.bind(this)));
  }

  private async addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorite = await FavoriteService.addFavorite(req.body);
      this.handleCreated(res, favorite);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await FavoriteService.removeFavorite(req.body);
      this.handleSuccess(res);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorites = await FavoriteService.getFavorites(req.params.userId);
      this.handleSuccess(res, favorites);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }
}

export default new FavoriteController().router;
