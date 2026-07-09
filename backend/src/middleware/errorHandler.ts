import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log the error stack for debugging
  console.error('Error Stack:', err.stack);

  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific Prisma database errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate database entry found';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      statusCode = 400;
      message = `Database Error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (err.name === 'ValidationError') {
    // Typical naming for validation errors (e.g., from Joi or Zod if added later)
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized request';
  } else if (err.message) {
    // If it's a generic error with a message, but not a known operational error, we can still show it or hide it based on env
    message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}
