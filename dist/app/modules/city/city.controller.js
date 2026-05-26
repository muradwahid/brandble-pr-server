"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const city_service_1 = require("./city.service");
const createCity = (0, catchAsync_1.default)(async (req, res) => {
    const city = await city_service_1.CityService.createCity(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'City created successfully!',
        data: city,
    });
});
const getAllCity = (0, catchAsync_1.default)(async (req, res) => {
    const cities = await city_service_1.CityService.getAllCity();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cities retrieved successfully!',
        data: cities,
    });
});
const updateCity = (0, catchAsync_1.default)(async (req, res) => {
    const city = await city_service_1.CityService.updateCity(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'City updated successfully!',
        data: city,
    });
});
const deleteCity = (0, catchAsync_1.default)(async (req, res) => {
    const city = await city_service_1.CityService.deleteCity(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'City deleted successfully!',
        data: city,
    });
});
const getCityById = (0, catchAsync_1.default)(async (req, res) => {
    const city = await city_service_1.CityService.getCityById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'City retrieved successfully!',
        data: city,
    });
});
exports.CityController = { createCity, getAllCity, updateCity, deleteCity, getCityById };
