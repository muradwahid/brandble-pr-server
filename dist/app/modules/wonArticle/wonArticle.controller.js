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
exports.WonArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const wonArticle_service_1 = require("./wonArticle.service");
const createWonArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield wonArticle_service_1.WonArticleService.createWonArticle(req);
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
});
const getAllWonArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wonArticles = yield wonArticle_service_1.WonArticleService.getAllWonArticles();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won articles fetched successfully",
        data: wonArticles,
    });
});
const getWonArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const wonArticle = yield wonArticle_service_1.WonArticleService.getWonArticleById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Won article fetched successfully",
        data: wonArticle,
    });
});
const updateWonArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const wonArticle = yield wonArticle_service_1.WonArticleService.updateWonArticle(id, req.body);
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
});
const deleteWonArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const wonArticle = yield wonArticle_service_1.WonArticleService.deleteWonArticle(id);
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
});
exports.WonArticleController = {
    createWonArticle,
    getAllWonArticles,
    getWonArticleById,
    updateWonArticle,
    deleteWonArticle,
};
