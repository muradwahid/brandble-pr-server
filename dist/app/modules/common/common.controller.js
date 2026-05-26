"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const common_service_1 = require("./common.service");
const getAllCommon = (0, catchAsync_1.default)(async (req, res) => {
    const countries = await common_service_1.CommonService.getAllCommon();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Common data retrieved successfully!',
        data: countries,
    });
});
exports.CommonController = { getAllCommon };
