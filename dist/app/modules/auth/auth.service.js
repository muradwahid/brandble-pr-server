"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const mail_1 = require("../../../helpers/mail");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// import { User } from "@prisma/client";
const allUsers = async () => {
    const result = await prisma_1.default.user.findMany();
    return result;
};
const userAllInfo = async (filters, options) => {
    const { searchTerm } = filters;
    const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    // Build search condition
    const whereConditions = searchTerm
        ? ({
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { company: { contains: searchTerm, mode: 'insensitive' } },
                { designation: { contains: searchTerm, mode: 'insensitive' } },
            ],
        })
        : {};
    // Fetch users with order counts
    const users = await prisma_1.default.user.findMany({
        where: whereConditions,
        select: {
            id: true,
            name: true,
            email: true,
            company: true,
            designation: true,
            image: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    orders: true,
                },
            },
            // Get actual orders to count by status
            orders: {
                select: {
                    status: true,
                },
            },
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = await prisma_1.default.user.count({ where: whereConditions });
    const result = users.map((user) => {
        const allOrders = user.orders || [];
        const totalOrders = user._count.orders;
        const runningOrders = allOrders.filter((order) => ['pending', 'in_progress', 'under_review', 'assigned'].includes(order.status)).length;
        const publishedOrders = allOrders.filter((order) => ['completed', 'published', 'live', 'delivered'].includes(order.status)).length;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            designation: user.designation,
            image: user.image,
            role: user.role,
            createdAt: user.createdAt,
            totalOrders,
            runningOrders,
            publishedOrders,
        };
    });
    return {
        data: result,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};
const createUser = async (user) => {
    // Check if user already exists by email
    const existingUser = await prisma_1.default.user.findFirst({
        where: { email: user.email }
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User already exists');
    }
    // Hash password before saving
    const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
    // Create user with hashed password
    const result = await prisma_1.default.user.create({
        data: {
            ...user,
            password: hashedPassword
        }
    });
    return result;
};
const loginUser = async (user) => {
    // Find user by email
    const result = await prisma_1.default.user.findFirst({
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
    const isPasswordCorrect = await bcrypt_1.default.compare(user.password, result.password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id: result?.id, role: result?.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id: result?.id, role: result?.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const getUserByCookie = async (token) => {
    const verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const { id } = verifiedToken;
    const result = await prisma_1.default.user.findUnique({
        where: {
            id
        },
        include: {
            orders: true
        }
    });
    return result;
};
const getSingleUser = async (id) => {
    const result = await prisma_1.default.user.findUnique({
        where: {
            id
        },
        include: {
            orders: true
        }
    });
    return result;
};
const sendEmailOTP = async (email) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            email
        }
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    const otp = otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    const updateUser = await prisma_1.default.user.update({
        where: { email },
        data: {
            otp,
            otpExpires: expiresIn,
        }
    });
    if (!updateUser)
        throw new ApiError_1.default(http_status_1.default.NOT_MODIFIED, 'Something went wrong!');
    const emailSent = await (0, mail_1.sendResetOtpEmail)(email, otp);
    return {
        success: true,
        emailSent
    };
};
const verifyOTP = async (email, otp) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            otp: true,
            otpExpires: true,
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    if (user.otp !== otp) {
        throw new ApiError_1.default(401, 'OTP didn’t matched!');
    }
    if (user.otpExpires && new Date() > user.otpExpires) {
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { otp: null, otpExpires: null },
        });
        throw new ApiError_1.default(410, 'OTP has expired');
    }
    return user;
};
const resetPassword = async (password, id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            otp: true,
            otpExpires: true,
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found!');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const updateUser = await prisma_1.default.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpires: null,
        }
    });
    return updateUser;
};
const forgotPassword = async (newPassword, email) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            otp: true,
            otpExpires: true,
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found!');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    const updateUser = await prisma_1.default.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpires: null,
        }
    });
    return updateUser;
};
const updateUser = async (id, req) => {
    const file = req.file;
    const data = { ...req.body };
    if (file) {
        const cloudflare = await FileUploadHelper_1.FileUploadHelper.uploadToR2(file);
        // const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(file);
        // if (uploadedProfileImage && uploadedProfileImage.secure_url) {
        //   data.image = uploadedProfileImage.secure_url;
        // }
        if (cloudflare && cloudflare.url) {
            data.image = cloudflare.url;
        }
    }
    try {
        const result = await prisma_1.default.user.update({
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
};
const deleteUser = async (id) => {
    const result = await prisma_1.default.user.delete({
        where: {
            id
        }
    });
    return result;
};
const getAdminRole = async () => {
    const result = await prisma_1.default.user.findFirst({
        where: {
            role: 'admin'
        }
    });
    return result;
};
exports.AuthService = {
    allUsers,
    createUser,
    loginUser,
    verifyOTP,
    resetPassword,
    forgotPassword,
    getSingleUser,
    sendEmailOTP,
    updateUser,
    deleteUser,
    getUserByCookie,
    getAdminRole,
    userAllInfo
};
