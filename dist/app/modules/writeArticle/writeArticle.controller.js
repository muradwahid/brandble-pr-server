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
exports.WriteArticleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const writeArticle_service_1 = require("./writeArticle.service");
const createWriteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield writeArticle_service_1.WriteArticleService.createWriteArticle(req);
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
});
const getAllWriteArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield writeArticle_service_1.WriteArticleService.getAllWriteArticles();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write articles fetched successfully',
        data: result,
    });
});
const getWriteArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield writeArticle_service_1.WriteArticleService.getWriteArticleById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article fetched successfully',
        data: result,
    });
});
const updateWriteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield writeArticle_service_1.WriteArticleService.updateWriteArticle(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article updated successfully',
        data: result,
    });
});
const deleteWriteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield writeArticle_service_1.WriteArticleService.deleteWriteArticle(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Write article deleted successfully',
        data: result,
    });
});
exports.WriteArticleController = {
    createWriteArticle,
    getAllWriteArticles,
    getWriteArticleById,
    updateWriteArticle,
    deleteWriteArticle,
};
