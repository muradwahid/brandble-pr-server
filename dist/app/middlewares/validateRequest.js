"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ========================================
        // STEP 1: EXTRACT REQUEST DATA
        // ========================================
        yield schema.parseAsync({
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
});
exports.default = validateRequest;
