"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const auth = (...requiredRoles) => async (req, res, next) => {
    try {
        // ========================================
        // STEP 1: EXTRACT AUTHORIZATION TOKEN
        // ========================================
        const token = req.headers.authorization;
        // Check if token exists in the request
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // ========================================
        // STEP 2: VERIFY JWT TOKEN
        // ========================================
        let verifiedUser = null;
        // Verify the JWT token using the secret key
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        // ========================================
        // STEP 3: ATTACH USER TO REQUEST OBJECT
        // ========================================
        req.user = verifiedUser; // userId, role, email, name
        // ========================================
        // STEP 4: ROLE-BASED AUTHORIZATION CHECK
        // ========================================
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            // User's role is not in the allowed roles list
            // This prevents unauthorized access to protected resources
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
        }
        // ========================================
        // STEP 5: PROCEED TO NEXT MIDDLEWARE/ROUTE
        // ========================================
        next();
    }
    catch (error) {
        // ========================================
        // STEP 6: ERROR HANDLING
        // ========================================
        next(error);
    }
};
exports.default = auth;
