import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ========================================
      // STEP 1: EXTRACT AUTHORIZATION TOKEN
      // ========================================
      const token = req.headers.authorization;

      // Check if token exists in the request
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // ========================================
      // STEP 2: VERIFY JWT TOKEN
      // ========================================
      let verifiedUser = null;

      // Verify the JWT token using the secret key
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

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
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      // ========================================
      // STEP 5: PROCEED TO NEXT MIDDLEWARE/ROUTE
      // ========================================
      next();
    } catch (error) {
      // ========================================
      // STEP 6: ERROR HANDLING
      // ========================================
      next(error);
    }
  };

export default auth;
