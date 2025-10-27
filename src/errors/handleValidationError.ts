import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';

const handleValidationError = (
  error: Prisma.PrismaClientValidationError,
): IGenericErrorResponse => {
  // ========================================
  // STEP 1: CREATE ERROR MESSAGE STRUCTURE
  // ========================================
  const errors = [
    {
      path: '', // No specific field path for general validation errors
      message: error?.message, // Use the original Prisma validation message
    },
  ];

  // ========================================
  // STEP 2: SET HTTP STATUS CODE
  // ========================================
  const statusCode = 400;

  // ========================================
  // STEP 3: RETURN FORMATTED ERROR RESPONSE
  // ========================================
  return {
    statusCode, // HTTP status code (400 for validation errors)
    message: 'Validation Error', // Generic message for validation failures
    errorMessages: errors, // Array containing the detailed error message
  };
};

export default handleValidationError;
