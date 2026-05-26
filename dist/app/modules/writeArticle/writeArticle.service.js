"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteArticleService = void 0;
const client_1 = require("../../../generated/client/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createWriteArticle = async (req) => {
    try {
        const files = req.files;
        // Parse request data first
        let data = {};
        try {
            data = typeof req.body === 'string' ? JSON.parse(req.body) : { ...req.body };
        }
        catch (parseError) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON data in request body");
        }
        let uploadedFiles = [];
        // Only process files if they exist
        if (files && Array.isArray(files) && files.length > 0) {
            // Upload files to Cloudflare with individual error handling
            const fileUploadPromises = files.map(async (file) => {
                try {
                    const uploadedFile = await FileUploadHelper_1.FileUploadHelper.uploadToR2(file);
                    if (!uploadedFile || !uploadedFile.url) {
                        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Upload failed for ${file.fieldname}`);
                    }
                    return {
                        [file.fieldname]: uploadedFile.url
                    };
                }
                catch (error) {
                    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Failed to upload ${file.fieldname}: ${error.message}`);
                }
            });
            uploadedFiles = await Promise.all(fileUploadPromises);
        }
        // Merge uploaded files data if any files were uploaded
        if (uploadedFiles.length > 0) {
            Object.assign(data, ...uploadedFiles);
        }
        // Create article in database
        const result = await prisma_1.default.writeArticle.create({
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
                    throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Database operation failed");
            }
        }
        // Handle other Prisma errors
        if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError ||
            error instanceof client_1.Prisma.PrismaClientInitializationError ||
            error instanceof client_1.Prisma.PrismaClientValidationError) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Database error occurred");
        }
        // Generic error handling
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Unable to create article due to an unexpected error");
    }
};
const getAllWriteArticles = async () => {
    const result = await prisma_1.default.writeArticle.findMany();
    return result;
};
const getWriteArticleById = async (id) => {
    const result = await prisma_1.default.writeArticle.findUnique({
        where: { id },
    });
    return result;
};
const updateWriteArticle = async (id, data) => {
    const result = await prisma_1.default.writeArticle.update({
        where: { id },
        data,
    });
    return result;
};
const deleteWriteArticle = async (id) => {
    const result = await prisma_1.default.writeArticle.delete({
        where: { id },
    });
    return result;
};
exports.WriteArticleService = {
    createWriteArticle,
    getAllWriteArticles,
    getWriteArticleById,
    updateWriteArticle,
    deleteWriteArticle,
};
