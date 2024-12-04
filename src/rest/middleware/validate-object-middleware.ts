import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Middleware } from './middleware.js';

export const ValidateObjectIdMiddleware: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid ObjectId' });
    return;
  }

  next();
};
