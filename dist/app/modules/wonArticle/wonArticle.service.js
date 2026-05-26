"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WonArticleService = exports.getWonArticleByPublicationId = exports.deleteWonArticle = exports.updateWonArticle = exports.getWonArticleById = exports.getAllWonArticles = exports.createWonArticle = void 0;
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createWonArticle = async (req) => {
    const files = req.files;
    const fileUploadPromises = files.map(async (file) => {
        // const uploadedFile = await FileUploadHelper.uploadPdfToCloudinary(file);
        // return uploadedFile?.secure_url;
        const uploadedFile = await FileUploadHelper_1.FileUploadHelper.uploadToR2(file);
        return uploadedFile?.url;
    });
    const uploadedFiles = await Promise.all(fileUploadPromises);
    const data = { ...req.body };
    if (uploadedFiles) {
        data.file = JSON.stringify(uploadedFiles);
    }
    const result = await prisma_1.default.wonArticle.create({
        data,
    });
    return result;
};
exports.createWonArticle = createWonArticle;
const getAllWonArticles = async () => {
    const result = await prisma_1.default.wonArticle.findMany();
    return result;
};
exports.getAllWonArticles = getAllWonArticles;
const getWonArticleById = async (id) => {
    const result = await prisma_1.default.wonArticle.findUnique({
        where: { id },
    });
    return result;
};
exports.getWonArticleById = getWonArticleById;
const updateWonArticle = async (id, data) => {
    const result = await prisma_1.default.wonArticle.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateWonArticle = updateWonArticle;
const deleteWonArticle = async (id) => {
    const result = await prisma_1.default.wonArticle.delete({
        where: { id },
    });
    return result;
};
exports.deleteWonArticle = deleteWonArticle;
const getWonArticleByPublicationId = async (publicationId) => {
    const result = await prisma_1.default.wonArticle.findMany({
        where: {
            orders: {
                some: {
                    publicationId: publicationId
                }
            }
        },
        include: {
            orders: {
                where: { publicationId: publicationId }
            }
        }
    });
    return result;
};
exports.getWonArticleByPublicationId = getWonArticleByPublicationId;
exports.WonArticleService = {
    createWonArticle: exports.createWonArticle,
    getAllWonArticles: exports.getAllWonArticles,
    getWonArticleById: exports.getWonArticleById,
    updateWonArticle: exports.updateWonArticle,
    deleteWonArticle: exports.deleteWonArticle,
    getWonArticleByPublicationId: exports.getWonArticleByPublicationId,
};
