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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteArticleService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createWriteArticle = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        // Parse request data first
        let data = {};
        try {
            data = typeof req.body === 'string' ? JSON.parse(req.body) : Object.assign({}, req.body);
        }
        catch (parseError) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON data in request body");
        }
        let uploadedFiles = [];
        // Only process files if they exist
        if (files && Array.isArray(files) && files.length > 0) {
            // Upload files to Cloudinary with individual error handling
            const fileUploadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const uploadedFile = yield FileUploadHelper_1.FileUploadHelper.uploadPdfToCloudinary(file);
                    if (!uploadedFile || !uploadedFile.secure_url) {
                        throw new Error(`Cloudinary upload failed for ${file.fieldname}`);
                    }
                    return {
                        [file.fieldname]: uploadedFile.secure_url
                    };
                }
                catch (error) {
                    console.error(`File upload failed for ${file.fieldname}:`, error);
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to upload ${file.fieldname}: ${error.message}`);
                }
            }));
            uploadedFiles = yield Promise.all(fileUploadPromises);
        }
        // Merge uploaded files data if any files were uploaded
        if (uploadedFiles.length > 0) {
            Object.assign(data, ...uploadedFiles);
        }
        // Create article in database
        const result = yield prisma_1.default.writeArticle.create({
            data,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create article in database");
        }
        return result;
    }
    catch (error) {
        // Handle specific error types
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        // Handle Prisma errors
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    throw new ApiError_1.default(http_status_1.default.CONFLICT, "Article with similar data already exists");
                case 'P2003':
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid foreign key reference");
                case 'P2025':
                    throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Related record not found");
                default:
                    console.error('Prisma error:', error);
                    throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Database operation failed");
            }
        }
        // Handle other Prisma errors
        if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError ||
            error instanceof client_1.Prisma.PrismaClientInitializationError ||
            error instanceof client_1.Prisma.PrismaClientValidationError) {
            console.error('Prisma error:', error);
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Database error occurred");
        }
        // Generic error handling
        console.error('Unexpected error in createWriteArticle:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Unable to create article due to an unexpected error");
    }
});
const getAllWriteArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.writeArticle.findMany();
    return result;
});
const getWriteArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.writeArticle.findUnique({
        where: { id },
    });
    return result;
});
const updateWriteArticle = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.writeArticle.update({
        where: { id },
        data,
    });
    return result;
});
const deleteWriteArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.writeArticle.delete({
        where: { id },
    });
    return result;
});
exports.WriteArticleService = {
    createWriteArticle,
    getAllWriteArticles,
    getWriteArticleById,
    updateWriteArticle,
    deleteWriteArticle,
};
