import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from 'express-async-handler';
import CommentService from '../../../db/services/comment-service.js';
import { Controller } from './controller.js';
import { ValidateObjectIdMiddleware } from '../validate-object-middleware.js';
import { CreateCommentDTO } from '../../../db/dto/comment.dto.js';
import { validateDTO } from '../validate-dto-middleware.js';

class CommentController extends Controller {
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
      handler: asyncHandler(this.addComment.bind(this)),
      middlewares: [validateDTO(CreateCommentDTO)],
    });

    this.addRoute({
      path: '/:id',
      method: 'get',
      handler: asyncHandler(this.getCommentsForRentOffer.bind(this)),
      middlewares: [ValidateObjectIdMiddleware],
    });
  }

  private async addComment(req: Request<Record<string, never>, any, CreateCommentDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await CommentService.addComment(req.body);
      this.handleCreated(res, comment);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }

  private async getCommentsForRentOffer(req: Request<{ rentOfferId: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await CommentService.getCommentsForRentOffer(req.params.rentOfferId);
      this.handleSuccess(res, comments);
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(next, error);
      }
    }
  }
}

export default new CommentController().router;
