"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const handleClientError_1 = __importDefault(require("../../errors/handleClientError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const logger_1 = require("../../shared/logger");
const globalErrorHandler = (error, req, res, next) => {
    // ========================================
    // STEP 1: LOG ERROR BASED ON ENVIRONMENT
    // ========================================
    config_1.default.env === 'development'
        ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
        : logger_1.errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);
    // ========================================
    // STEP 2: INITIALIZE DEFAULT ERROR RESPONSE
    // ========================================
    let statusCode = 500; // Default to Internal Server Error
    let message = 'Something went wrong !'; // Default error message
    let errorMessages = []; // Array to store detailed error messages
    // ========================================
    // STEP 3: HANDLE PRISMA VALIDATION ERRORS
    // ========================================
    if ((error === null || error === void 0 ? void 0 : error.name) === 'PrismaClientValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // ========================================
    // STEP 4: HANDLE ZOD VALIDATION ERRORS
    // ========================================
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        // res.send({error});  // Commented out - would send raw error
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // ========================================
    // STEP 5: HANDLE PRISMA CLIENT KNOWN ERRORS
    // ========================================
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handleClientError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // ========================================
    // STEP 6: HANDLE CUSTOM API ERRORS
    // ========================================
    // Handle custom ApiError instances (thrown by application logic)
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode; // Use the status code from the custom error
        message = error.message; // Use the message from the custom error
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '', // No specific field path for general API errors
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    // ========================================
    // STEP 7: HANDLE GENERIC JAVASCRIPT ERRORS
    // ========================================
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message; // Use the error message
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '', // No specific field path for generic errors
                    message: error === null || error === void 0 ? void 0 : error.message,
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
        stack: config_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined, // Include stack trace only in development
    });
};
exports.default = globalErrorHandler;
