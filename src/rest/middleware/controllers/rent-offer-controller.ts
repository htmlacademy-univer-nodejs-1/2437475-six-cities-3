import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import RentOfferService from '../../../db/services/rent-offer-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { CreateRentOfferDTO, UpdateRentOfferDTO } from '../../../db/dto/rent-offer.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';
import { checkEntityExists } from '../check-entity-exists.js';
import { authenticate } from '../auth-middleware.js';
import FavoriteModel from '../../../db/models/favorite.js';

class RentOfferController extends Controller {
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
      handler: asyncHandler(this.createRentOffer.bind(this)),
      middlewares: [validateDTO(CreateRentOfferDTO)],
    });

    this.addRoute({
      path: '/',
      method: 'get',
      handler: asyncHandler(this.getAllRentOffers.bind(this)),
      middlewares: [],
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: asyncHandler(this.getRentOfferById.bind(this)),
      middlewares: [ValidateObjectIdMiddleware, checkEntityExists(RentOfferService, 'id')],
    });

    this.addRoute({
      path: '/:id',
      method: 'put',
      handler: asyncHandler(this.updateRentOffer.bind(this)),
      middlewares: [authenticate, ValidateObjectIdMiddleware, validateDTO(UpdateRentOfferDTO), checkEntityExists(RentOfferService, 'id')],
    });

    this.addRoute({
      path: '/:id',
      method: 'delete',
      handler: asyncHandler(this.deleteRentOffer.bind(this)),
      middlewares: [authenticate, ValidateObjectIdMiddleware, checkEntityExists(RentOfferService, 'id')],
    });
  }

  private async createRentOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const rentOfferData = { ...req.body, user: userId };
      const rentOffer = await RentOfferService.createRentOffer(rentOfferData);
      this.handleCreated(res, rentOffer);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getAllRentOffers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user?.id;
      const rentOffers = await RentOfferService.findAllRentOffers();

      let userFavorites = new Set<string>();
      if (userId) {
        const favorites = await FavoriteModel.find({ user: userId }, { rentOffer: 1, _id: 0 }).exec();
        userFavorites = new Set(favorites.map(fav => fav.rentOffer.toString()));
      }

      const updatedOffers = rentOffers.map((offer) => ({
        ...offer.toObject(),
        favorite: userId ? userFavorites.has(offer._id.toString()) : false,
      }));

      this.handleSuccess(res, updatedOffers);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getRentOfferById(_req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      this.handleSuccess(res, res.locals.entity);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async updateRentOffer(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const rentOffer = res.locals.entity;

      if (rentOffer.user.toString() !== userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this offer' });
        return;
      }

      const updatedOfferData = { ...req.body };

      const updatedOffer = await RentOfferService.editRentOffer(req.params.id, updatedOfferData);
      if (!updatedOffer) {
        return next(new Error('RentOffer not found'));
      }
      this.handleSuccess(res, updatedOffer);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async deleteRentOffer(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const rentOffer = res.locals.entity;

      if (rentOffer.user.toString() !== userId) {
        res.status(403).json({ error: 'Forbidden: You do not own this offer' });
        return;
      }

      await RentOfferService.deleteRentOffer(req.params.id);
      this.handleSuccess(res);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

}

export default new RentOfferController().router;
