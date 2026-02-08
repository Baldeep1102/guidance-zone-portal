import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Unhandled error:', err);

  const status = (err as any).status || 500;
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(status).json({ error: message });
}
