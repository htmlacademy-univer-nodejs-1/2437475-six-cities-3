import { Request, Response, NextFunction } from 'express';
import logger from '../../logger/logger.js';

export function exceptionFilter(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error(`Error: ${err.message}`);
  const status = err.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ error: err.message });
}
