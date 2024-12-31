import { Request, Response, NextFunction } from 'express';
import { EntityService } from '../../db/services/entity-service.js';

export const checkEntityExists = <T>(service: EntityService<T>, idParam: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const entityId = req.params[idParam];

    if (!entityId) {
      res.status(400).json({ error: 'ID parameter is missing' });
      return;
    }

    try {
      const entity = await service.findById(entityId);
      if (!entity) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }

      res.locals.entity = entity;
      return next();
    } catch (error) {
      return next(error);
    }
  };
