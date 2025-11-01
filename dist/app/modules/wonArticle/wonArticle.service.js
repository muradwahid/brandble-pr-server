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
exports.WonArticleService = exports.getWonArticleByPublicationId = exports.deleteWonArticle = exports.updateWonArticle = exports.getWonArticleById = exports.getAllWonArticles = exports.createWonArticle = void 0;
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createWonArticle = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const fileUploadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const uploadedFile = yield FileUploadHelper_1.FileUploadHelper.uploadPdfToCloudinary(file);
        return uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url;
    }));
    const uploadedFiles = yield Promise.all(fileUploadPromises);
    const data = Object.assign({}, req.body);
    if (uploadedFiles) {
        data.file = JSON.stringify(uploadedFiles);
    }
    const result = yield prisma_1.default.wonArticle.create({
        data,
    });
    return result;
});
exports.createWonArticle = createWonArticle;
const getAllWonArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wonArticle.findMany();
    return result;
});
exports.getAllWonArticles = getAllWonArticles;
const getWonArticleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wonArticle.findUnique({
        where: { id },
    });
    return result;
});
exports.getWonArticleById = getWonArticleById;
const updateWonArticle = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wonArticle.update({
        where: { id },
        data,
    });
    return result;
});
exports.updateWonArticle = updateWonArticle;
const deleteWonArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wonArticle.delete({
        where: { id },
    });
    return result;
});
exports.deleteWonArticle = deleteWonArticle;
const getWonArticleByPublicationId = (publicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wonArticle.findMany({
        where: { orders: { some: { publicationIds: { has: publicationId } } } },
    });
    return result;
});
exports.getWonArticleByPublicationId = getWonArticleByPublicationId;
exports.WonArticleService = {
    createWonArticle: exports.createWonArticle,
    getAllWonArticles: exports.getAllWonArticles,
    getWonArticleById: exports.getWonArticleById,
    updateWonArticle: exports.updateWonArticle,
    deleteWonArticle: exports.deleteWonArticle,
    getWonArticleByPublicationId: exports.getWonArticleByPublicationId,
};
