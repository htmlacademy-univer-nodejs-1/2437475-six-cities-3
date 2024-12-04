import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import RentOfferService from '../../../db/services/rent-offer-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { CreateRentOfferDTO, UpdateRentOfferDTO } from '../../../db/dto/rent-offer.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';

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
      middlewares: [ValidateObjectIdMiddleware],
    });

    this.addRoute({
      path: '/:id',
      method: 'put',
      handler: asyncHandler(this.updateRentOffer.bind(this)),
      middlewares: [ValidateObjectIdMiddleware, validateDTO(UpdateRentOfferDTO)],
    });

    this.addRoute({
      path: '/:id',
      method: 'delete',
      handler: asyncHandler(this.deleteRentOffer.bind(this)),
      middlewares: [ValidateObjectIdMiddleware],
    });
  }

  private async createRentOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentOffer = await RentOfferService.createRentOffer(req.body);
      this.handleCreated(res, rentOffer);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getAllRentOffers(_req: Request, res: Response): Promise<void> {
    const rentOffers = await RentOfferService.findAllRentOffers();
    this.handleSuccess(res, rentOffers);
  }

  private async getRentOfferById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentOffer = await RentOfferService.findRentOfferById(req.params.id);
      if (!rentOffer) {
        return next(new Error('RentOffer not found'));
      }
      this.handleSuccess(res, rentOffer);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async updateRentOffer(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedOffer = await RentOfferService.editRentOffer(req.params.id, req.body);
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

  private async deleteRentOffer(req: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> {
    await RentOfferService.deleteRentOffer(req.params.id);
    this.handleSuccess(res);
  }
}

export default new RentOfferController().router;
