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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany();
    return result;
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists by email
    const existingUser = yield prisma_1.default.user.findFirst({
        where: { email: user.email }
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User already exists');
    }
    // Hash password before saving
    const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
    // Create user with hashed password
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, user), { password: hashedPassword })
    });
    return result;
});
const loginUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by email
    const result = yield prisma_1.default.user.findFirst({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
        }
    });
    // Check if user exists
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check if password is correct
    const isPasswordCorrect = yield bcrypt_1.default.compare(user.password, result.password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id: result === null || result === void 0 ? void 0 : result.id, role: result === null || result === void 0 ? void 0 : result.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id: result === null || result === void 0 ? void 0 : result.id, role: result === null || result === void 0 ? void 0 : result.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const getUserByCookie = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const { id } = verifiedToken;
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id
        },
        include: {
            orders: true
        }
    });
    return result;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id
        },
        include: {
            orders: true
        }
    });
    return result;
});
const updateUser = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const data = Object.assign({}, req.body);
    if (file) {
        const uploadedProfileImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        if (uploadedProfileImage && uploadedProfileImage.secure_url) {
            data.image = uploadedProfileImage.secure_url;
        }
    }
    try {
        const result = yield prisma_1.default.user.update({
            where: {
                id,
            },
            data,
        });
        return result;
    }
    catch (error) {
        throw error;
    }
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            id
        }
    });
    return result;
});
exports.AuthService = {
    allUsers,
    createUser,
    loginUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getUserByCookie
};
