import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserService from '../../../db/services/user-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { CreateUserDTO, LoginDTO } from '../../../db/dto/user.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';
import userService from '../../../db/services/user-service.js';
import { checkEntityExists } from '../check-entity-exists.js';
import { uploadAvatar } from '../upload-avatar-middleware.js';
import { generateToken } from '../../jwt-utils.js';

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
      middlewares: [ValidateObjectIdMiddleware, checkEntityExists(userService, 'id')],
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

    this.addRoute({
      path: '/:id/avatar',
      method: 'post',
      handler: asyncHandler(this.uploadUserAvatar.bind(this)),
      middlewares: [uploadAvatar],
    });
  }

  private async uploadUserAvatar(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;

      if (!req.file) {
        res.status(400).json({ error: 'Avatar file is required.' });
        return;
      }

      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      const updatedUser = await UserService.updateUserAvatar(userId, avatarPath);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      this.handleSuccess(res, { avatarPath });
    } catch (error) {
      next(error);
    }
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

  private async getUserById(_req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      this.handleSuccess(res, res.locals.entity);
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
      const { email, password } = req.body;

      const authenticatedUser = await UserService.authenticateUser({ email, password });
      if (!authenticatedUser) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = await generateToken({ id: authenticatedUser.id, email: authenticatedUser.email });

      this.handleSuccess(res, { token });
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }
}

export default new UserController().router;
