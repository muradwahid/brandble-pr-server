"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_constant_1 = require("./auth.constant");
const auth_service_1 = require("./auth.service");
const allUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.allUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: result,
    });
});
const userAllInfo = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, auth_constant_1.authFilterAbleFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await auth_service_1.AuthService.userAllInfo(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users all info retrieved successfully!',
        data: result,
    });
});
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.body;
    const result = await auth_service_1.AuthService.createUser(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User created successfully!',
        data: result,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const result = await auth_service_1.AuthService.loginUser(data);
    const { refreshToken, ...others } = result;
    //set refresh token into cookie
    const refCookieOptions = {
        domain: config_1.default.rootUrl,
        secure: true,
        httpOnly: true,
        path: '/',
        sameSite: 'none'
    };
    const AccessCookieOptions = {
        domain: config_1.default.rootUrl,
        secure: true,
        httpOnly: false,
        path: '/',
        sameSite: 'none'
    };
    res.cookie('refreshToken', refreshToken, refCookieOptions);
    res.cookie('accessToken', others?.accessToken, AccessCookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged in successfully!',
        data: others,
    });
});
const logOutUser = (0, catchAsync_1.default)(async (req, res) => {
    res.clearCookie('accessToken', { domain: config_1.default.rootUrl, path: '/' });
    res.clearCookie('refreshToken', { domain: config_1.default.rootUrl, path: '/' });
    res.json({ ok: true });
});
const getUserByCookie = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.cookies?.accessToken;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
    }
    const result = await auth_service_1.AuthService.getUserByCookie(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged in user retrieved successfully!',
        data: result
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await auth_service_1.AuthService.getSingleUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: result
    });
});
const sendEmailOTP = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    const result = await auth_service_1.AuthService.sendEmailOTP(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent successfully!',
        data: result,
    });
});
const verifyOTP = (0, catchAsync_1.default)(async (req, res) => {
    const { email, otp } = req.body;
    const result = await auth_service_1.AuthService.verifyOTP(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP verify successfully!',
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { password, id } = req.body;
    const result = await auth_service_1.AuthService.resetPassword(password, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Reset Successfully!',
        data: result,
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { newPassword, email } = req.body;
    const result = await auth_service_1.AuthService.forgotPassword(newPassword, email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Set Successfully!',
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await auth_service_1.AuthService.updateUser(id, req);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'User updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await auth_service_1.AuthService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully!',
        data: result
    });
});
const getAdminRole = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.getAdminRole();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin role retrieved successfully!',
        data: result
    });
});
exports.AuthController = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
    sendEmailOTP,
    verifyOTP,
    resetPassword,
    forgotPassword,
    updateUser,
    deleteUser,
    getUserByCookie,
    logOutUser,
    getAdminRole,
    userAllInfo
};
