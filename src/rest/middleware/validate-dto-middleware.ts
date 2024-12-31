import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Constructor } from '../../types/types.js';

export const validateDTO = <T extends object>(dtoClass: Constructor<T>) => async (req: Request, res: Response, next: NextFunction) => {
  const dtoInstance = plainToInstance(dtoClass, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => Object.values(err.constraints || {}).join(', ')).join('; ');
    res.status(400).json({ error: `Validation failed: ${errorMessages}` });
    return;
  }

  next();
};
