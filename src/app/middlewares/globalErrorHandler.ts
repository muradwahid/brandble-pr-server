/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleValidationError from '../../errors/handleValidationError';

import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import handleClientError from '../../errors/handleClientError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interfaces/error';
import { errorlogger } from '../../shared/logger';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ========================================
  // STEP 1: LOG ERROR BASED ON ENVIRONMENT
  // ========================================
  config.env === 'development'
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  // ========================================
  // STEP 2: INITIALIZE DEFAULT ERROR RESPONSE
  // ========================================
  let statusCode = 500; // Default to Internal Server Error
  let message = 'Something went wrong !'; // Default error message
  let errorMessages: IGenericErrorMessage[] = []; // Array to store detailed error messages

  // ========================================
  // STEP 3: HANDLE PRISMA VALIDATION ERRORS
  // ========================================
  if (error?.name === 'PrismaClientValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // ========================================
  // STEP 4: HANDLE ZOD VALIDATION ERRORS
  // ========================================
  else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    // res.send({error});  // Commented out - would send raw error
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // ========================================
  // STEP 5: HANDLE PRISMA CLIENT KNOWN ERRORS
  // ========================================
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // ========================================
  // STEP 6: HANDLE CUSTOM API ERRORS
  // ========================================
  // Handle custom ApiError instances (thrown by application logic)
  else if (error instanceof ApiError) {
    statusCode = error?.statusCode; // Use the status code from the custom error
    message = error.message; // Use the message from the custom error
    errorMessages = error?.message
      ? [
          {
            path: '', // No specific field path for general API errors
            message: error?.message,
          },
        ]
      : [];
  }
  // ========================================
  // STEP 7: HANDLE GENERIC JAVASCRIPT ERRORS
  // ========================================
  else if (error instanceof Error) {
    message = error?.message; // Use the error message
    errorMessages = error?.message
      ? [
          {
            path: '', // No specific field path for generic errors
            message: error?.message,
          },
        ]
      : [];
  }

  // ========================================
  // STEP 8: SEND FORMATTED ERROR RESPONSE
  // ========================================
  res.status(statusCode).json({
    success: false, // Always false for error responses
    message, // Main error message
    errorMessages, // Array of detailed error messages with field paths
    stack: config.env !== 'production' ? error?.stack : undefined, // Include stack trace only in development
  });
};

export default globalErrorHandler;
