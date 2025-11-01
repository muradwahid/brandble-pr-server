"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleClientError = (error) => {
    var _a;
    // ========================================
    // STEP 1: INITIALIZE ERROR RESPONSE VARIABLES
    // ========================================
    let errors = []; // Array to store detailed error messages
    let message = ''; // Main error message
    const statusCode = 400; // HTTP status code for client errors
    // ========================================
    // STEP 2: HANDLE RECORD NOT FOUND ERROR (P2025)
    // ========================================
    if (error.code === 'P2025') {
        // Extract the cause from error metadata or use default message
        message = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.cause) || 'Record not found!';
        errors = [
            {
                path: '', // No specific field path for record not found errors
                message, // Error message explaining the issue
            },
        ];
    }
    // ========================================
    // STEP 3: HANDLE FOREIGN KEY CONSTRAINT ERROR (P2003)
    // ========================================
    else if (error.code === 'P2003') {
        // Check if this is a delete operation that failed due to foreign key constraints
        if (error.message.includes('delete()` invocation:')) {
            message = 'Delete failed'; // Generic message for delete failures
            errors = [
                {
                    path: '', // No specific field path for delete constraint errors
                    message, // Error message explaining the delete failure
                },
            ];
        }
    }
    // ========================================
    // STEP 4: RETURN FORMATTED ERROR RESPONSE
    // ========================================
    return {
        statusCode, // HTTP status code (400 for client errors)
        message, // Main error message
        errorMessages: errors, // Array of detailed error messages
    };
};
exports.default = handleClientError;
