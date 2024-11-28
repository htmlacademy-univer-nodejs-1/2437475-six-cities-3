import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import RentOfferService from '../../../db/services/rent-offer-service.js';
import { Controller } from './controller.js';

class RentOfferController extends Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', asyncHandler(this.createRentOffer.bind(this)));
    this.router.get('/', asyncHandler(this.getAllRentOffers.bind(this)));
    this.router.get('/:id', asyncHandler(this.getRentOfferById.bind(this)));
    this.router.put('/:id', asyncHandler(this.updateRentOffer.bind(this)));
    this.router.delete('/:id', asyncHandler(this.deleteRentOffer.bind(this)));
  }

  private async createRentOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentOffer = await RentOfferService.createRentOffer(req.body);
      this.handleCreated(res, rentOffer);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async getAllRentOffers(_req: Request, res: Response): Promise<void> {
    const rentOffers = await RentOfferService.findAllRentOffers();
    this.handleSuccess(res, rentOffers);
  }

  private async getRentOfferById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const rentOffer = await RentOfferService.findRentOfferById(req.params.id);
    if (!rentOffer) {
      return next(new Error('RentOffer not found'));
    }
    this.handleSuccess(res, rentOffer);
  }

  private async updateRentOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const updatedOffer = await RentOfferService.editRentOffer(req.params.id, req.body);
    if (!updatedOffer) {
      return next(new Error('RentOffer not found'));
    }
    this.handleSuccess(res, updatedOffer);
  }

  private async deleteRentOffer(req: Request, res: Response, _next: NextFunction): Promise<void> {
    await RentOfferService.deleteRentOffer(req.params.id);
    this.handleSuccess(res);
  }
}

export default new RentOfferController().router;
