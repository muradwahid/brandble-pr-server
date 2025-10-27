import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodType } from 'zod';

const validateRequest =
  (schema: ZodObject<any, any> | ZodType<any, any, any>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
      // ========================================
      // STEP 3: VALIDATION ERROR HANDLING
      // ========================================
      next(error);
    }
  };

export default validateRequest;
