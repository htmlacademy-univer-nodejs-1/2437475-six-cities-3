import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwt-utils.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyToken(token);
    res.locals.user = payload;
    return next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
