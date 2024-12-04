import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserService from '../../../db/services/user-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { CreateUserDTO, LoginDTO } from '../../../db/dto/user.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';

class UserController extends Controller {
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
      handler: asyncHandler(this.createUser.bind(this)),
      middlewares: [validateDTO(CreateUserDTO)],
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: asyncHandler(this.getUserById.bind(this)),
      middlewares: [ValidateObjectIdMiddleware],
    });

    this.addRoute({
      path: '/login',
      method: 'post',
      handler: asyncHandler(this.authenticateUser.bind(this)),
      middlewares: [validateDTO(LoginDTO)],
    });

    this.addRoute({
      path: '/email/:email',
      method: 'get',
      handler: asyncHandler(this.getUserByEmail.bind(this)),
      middlewares: [],
    });
  }

  private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await UserService.createUser(req.body);
      this.handleCreated(res, newUser);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getUserById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.findUserById(req.params.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      this.handleSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getUserByEmail(req: Request<{ email: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.findUserByEmail(req.params.email);
      if (!user) {
        return next(new Error('User not found'));
      }
      this.handleSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedUser = await UserService.authenticateUser(req.body);
      if (!authenticatedUser) {
        return next(new Error('Invalid credentials'));
      }
      this.handleSuccess(res, authenticatedUser);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }
}

export default new UserController().router;
