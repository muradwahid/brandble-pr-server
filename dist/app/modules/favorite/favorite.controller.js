"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const favorite_service_1 = require("./favorite.service");
const allFavorites = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await favorite_service_1.FavoriteService.allFavorites(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Favorites retrieved successfully!',
        data: result,
    });
});
const getOnlyFavoriteIds = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await favorite_service_1.FavoriteService.getOnlyFavoriteIds(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Favorites retrieved successfully!',
        data: result,
    });
});
const createFavorite = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const result = await favorite_service_1.FavoriteService.createFavorite(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Favorite added successfully!',
        data: result,
    });
});
const deleteFavorite = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await favorite_service_1.FavoriteService.deleteFavorite(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Favorite deleted successfully!',
        data: result,
    });
});
exports.FavoriteController = {
    allFavorites,
    createFavorite,
    deleteFavorite,
    getOnlyFavoriteIds
};
