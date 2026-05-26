"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WonArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const wonArticle_service_1 = require("./wonArticle.service");
const createWonArticle = async (req, res, next) => {
    try {
        const result = await wonArticle_service_1.WonArticleService.createWonArticle(req);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Won Article created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
    // const data = req.body;
    // const result = await WonArticleService.createWonArticle(data);
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: "Won article created successfully",
    //     data: result,
    // });
};
const getAllWonArticles = async (req, res) => {
    const wonArticles = await wonArticle_service_1.WonArticleService.getAllWonArticles();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won articles fetched successfully",
        data: wonArticles,
    });
};
const getWonArticleById = async (req, res) => {
    const { id } = req.params;
    const wonArticle = await wonArticle_service_1.WonArticleService.getWonArticleById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won article fetched successfully",
        data: wonArticle,
    });
};
const updateWonArticle = async (req, res) => {
    const { id } = req.params;
    const wonArticle = await wonArticle_service_1.WonArticleService.updateWonArticle(id, req.body);
    if (!wonArticle) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Won article not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won article updated successfully",
        data: wonArticle,
    });
};
const deleteWonArticle = async (req, res) => {
    const { id } = req.params;
    const wonArticle = await wonArticle_service_1.WonArticleService.deleteWonArticle(id);
    if (!wonArticle) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Won article not found",
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won article deleted successfully",
        data: wonArticle,
    });
};
exports.WonArticleController = {
    createWonArticle,
    getAllWonArticles,
    getWonArticleById,
    updateWonArticle,
    deleteWonArticle,
};
