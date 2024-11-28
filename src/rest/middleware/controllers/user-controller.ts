import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserService from '../../../db/services/user-service.js';
import { Controller } from './controller.js';

class UserController extends Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', asyncHandler(this.createUser.bind(this)));
    this.router.get('/:id', asyncHandler(this.getUserById.bind(this)));
    this.router.post('/login', asyncHandler(this.authenticateUser.bind(this)));
    this.router.get('/email/:email', asyncHandler(this.getUserByEmail.bind(this)));
  }

  private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await UserService.createUser(req.body);
      this.handleCreated(res, newUser);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.findUserById(req.params.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      this.handleSuccess(res, user);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.findUserByEmail(req.params.email);
      if (!user) {
        return next(new Error('User not found'));
      }
      this.handleSuccess(res, user);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }

  private async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedUser = await UserService.authenticateUser(req.body);
      if (!authenticatedUser) {
        return next(new Error('Invalid credentials'));
      }
      this.handleSuccess(res, authenticatedUser);
    } catch (error: any) {
      this.handleError(next, error);
    }
  }
}

export default new UserController().router;
