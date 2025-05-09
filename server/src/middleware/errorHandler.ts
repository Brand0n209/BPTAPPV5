import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }
  
  // Log unexpected errors
  logger.error('Unexpected error:', err);
  
  // Google API specific error handling
  if (err.message && err.message.includes('Google API')) {
    return res.status(500).json({
      status: 500,
      message: 'Error communicating with Google Calendar API',
      error: err.message
    });
  }
  
  // Default error response
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
  });
};
