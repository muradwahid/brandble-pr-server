"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const country_service_1 = require("./country.service");
const createCountry = (0, catchAsync_1.default)(async (req, res) => {
    const country = await country_service_1.CountryService.createCountry(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Country created successfully!',
        data: country,
    });
});
const getAllCountry = (0, catchAsync_1.default)(async (req, res) => {
    const countries = await country_service_1.CountryService.getAllCountry();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Countries retrieved successfully!',
        data: countries,
    });
});
const updateCountry = (0, catchAsync_1.default)(async (req, res) => {
    const country = await country_service_1.CountryService.updateCountry(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Country updated successfully!',
        data: country,
    });
});
const deleteCountry = (0, catchAsync_1.default)(async (req, res) => {
    const country = await country_service_1.CountryService.deleteCountry(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Country deleted successfully!',
        data: country,
    });
});
const getCountryById = (0, catchAsync_1.default)(async (req, res) => {
    const country = await country_service_1.CountryService.getCountryById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Country retrieved successfully!',
        data: country,
    });
});
exports.CountryController = { createCountry, getAllCountry, updateCountry, deleteCountry, getCountryById };
