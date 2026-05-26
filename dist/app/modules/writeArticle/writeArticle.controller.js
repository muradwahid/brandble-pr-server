"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const writeArticle_service_1 = require("./writeArticle.service");
const createWriteArticle = async (req, res, next) => {
    try {
        const result = await writeArticle_service_1.WriteArticleService.createWriteArticle(req);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Write article created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllWriteArticles = async (req, res) => {
    const result = await writeArticle_service_1.WriteArticleService.getAllWriteArticles();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write articles fetched successfully',
        data: result,
    });
};
const getWriteArticleById = async (req, res) => {
    const { id } = req.params;
    const result = await writeArticle_service_1.WriteArticleService.getWriteArticleById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article fetched successfully',
        data: result,
    });
};
const updateWriteArticle = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await writeArticle_service_1.WriteArticleService.updateWriteArticle(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article updated successfully',
        data: result,
    });
};
const deleteWriteArticle = async (req, res) => {
    const { id } = req.params;
    const result = await writeArticle_service_1.WriteArticleService.deleteWriteArticle(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article deleted successfully',
        data: result,
    });
};
exports.WriteArticleController = {
    createWriteArticle,
    getAllWriteArticles,
    getWriteArticleById,
    updateWriteArticle,
    deleteWriteArticle,
};
