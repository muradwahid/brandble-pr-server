"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    // ========================================
    // STEP 1: CREATE ERROR MESSAGE STRUCTURE
    // ========================================
    const errors = [
        {
            path: '', // No specific field path for general validation errors
            message: error === null || error === void 0 ? void 0 : error.message, // Use the original Prisma validation message
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
exports.default = handleValidationError;
