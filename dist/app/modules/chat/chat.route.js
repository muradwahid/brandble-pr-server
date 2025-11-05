"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
// routes/chatRoutes.js
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
// Chat routes
router.post('/order/:orderId/chat', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.createOrderChat);
router.get('/order/:orderId/chat', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.getOrderChat);
router.get('/user/chats', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.getUserChats);
router.post('/chat/:roomId/message', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.sendMessage);
router.post('/chat/:roomId/participant', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), chat_controller_1.ChatController.addParticipant);
// Admin management routes
router.post('/admin/assign', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.assignAdmin);
router.get('/order/:orderId/admins', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.getOrderAdmins);
router.get('/admins', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CLIENT), chat_controller_1.ChatController.getAllAdmins);
exports.ChatRoutes = router;
