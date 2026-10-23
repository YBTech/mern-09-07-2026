import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError, ConflictError } from '../shared/errors.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof NotFoundError || err instanceof ValidationError || err instanceof ConflictError) {
    return res.status((err as any).statusCode).json({
      error: err.message,
      type: err.name,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    type: 'ServerError',
  });
};
