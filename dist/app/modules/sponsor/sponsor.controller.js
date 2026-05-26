"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsoredController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const sponsor_service_1 = require("./sponsor.service");
const createSponsored = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await sponsor_service_1.SponsoredService.createSponsored(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre created successfully!',
        data: genre,
    });
});
const getAllSponsors = (0, catchAsync_1.default)(async (req, res) => {
    const genres = await sponsor_service_1.SponsoredService.getAllSponsors();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genres retrieved successfully!',
        data: genres,
    });
});
const updateSponsored = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await sponsor_service_1.SponsoredService.updateSponsored(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre updated successfully!',
        data: genre,
    });
});
const deleteSponsored = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await sponsor_service_1.SponsoredService.deleteSponsored(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre deleted successfully!',
        data: genre,
    });
});
const getSponsoredById = (0, catchAsync_1.default)(async (req, res) => {
    const genre = await sponsor_service_1.SponsoredService.getSponsoredById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Genre retrieved successfully!',
        data: genre,
    });
});
exports.SponsoredController = { createSponsored, getAllSponsors, updateSponsored, deleteSponsored, getSponsoredById };
