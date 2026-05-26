"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const state_service_1 = require("./state.service");
const createState = (0, catchAsync_1.default)(async (req, res) => {
    const state = await state_service_1.StateService.createState(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'State created successfully!',
        data: state,
    });
});
const getAllState = (0, catchAsync_1.default)(async (req, res) => {
    const states = await state_service_1.StateService.getAllState();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'States retrieved successfully!',
        data: states,
    });
});
const updateState = (0, catchAsync_1.default)(async (req, res) => {
    const state = await state_service_1.StateService.updateState(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'State updated successfully!',
        data: state,
    });
});
const deleteState = (0, catchAsync_1.default)(async (req, res) => {
    const state = await state_service_1.StateService.deleteState(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'State deleted successfully!',
        data: state,
    });
});
const getStateById = (0, catchAsync_1.default)(async (req, res) => {
    const state = await state_service_1.StateService.getStateById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'State retrieved successfully!',
        data: state,
    });
});
exports.StateController = { createState, getAllState, updateState, deleteState, getStateById };
