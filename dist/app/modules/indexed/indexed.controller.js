"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const indexed_service_1 = require("./indexed.service");
const createIndexed = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await indexed_service_1.IndexedService.createIndexed(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre created successfully!',
        data: genre,
    });
});
const getAllIndexes = (0, catchAsync_1.default)(async (req, res) => {
    const genres = await indexed_service_1.IndexedService.getAllIndexes();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genres retrieved successfully!',
        data: genres,
    });
});
const updateIndexed = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await indexed_service_1.IndexedService.updateIndexed(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre updated successfully!',
        data: genre,
    });
});
const deleteIndexed = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await indexed_service_1.IndexedService.deleteIndexed(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre deleted successfully!',
        data: genre,
    });
});
const getIndexedById = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await indexed_service_1.IndexedService.getIndexedById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre retrieved successfully!',
        data: genre,
    });
});
exports.IndexedController = { createIndexed, getAllIndexes, updateIndexed, deleteIndexed, getIndexedById };
