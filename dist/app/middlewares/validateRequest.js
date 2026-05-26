"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => async (req, res, next) => {
    try {
        // ========================================
        // STEP 1: EXTRACT REQUEST DATA
        // ========================================
        await schema.parseAsync({
            body: req.body, // Request body data (JSON, form data, etc.)
            query: req.query, // Query string parameters
            params: req.params, // URL path parameters
            cookies: req.cookies, // Request cookies
        });
        // ========================================
        // STEP 2: VALIDATION SUCCESS
        // ========================================
        return next();
    }
    catch (error) {
        // ========================================
        // STEP 3: VALIDATION ERROR HANDLING
        // ========================================
        next(error);
    }
};
exports.default = validateRequest;
