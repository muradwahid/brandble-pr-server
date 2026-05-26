"use strict";
// routes/chatRoutes.js
// import { Router, Request, Response, NextFunction } from "express";
// import { ChatController } from "./chat.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
// Chat routes
// router.post('/order/:orderId/chat', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), ChatController.createOrderChat);
// router.get('/order/:orderId/chat', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getOrderChat);
// router.get('/user/chats', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getUserChats);
// router.post('/:roomId/message', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.sendMessage);
// router.post('/:roomId/participant', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), ChatController.addParticipant);
// // Admin management routes
// router.post('/admin/assign', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), ChatController.assignAdmin);
// router.get('/order/:orderId/admins', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getOrderAdmins);
// router.get('/admins', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getAllAdmins);
router.get('/user-chats/:adminId', chat_controller_1.chatController.getUserChats);
router.get('/client-chats/:userId', chat_controller_1.chatController.getClientChats);
router.get('/order-chats/:adminId', chat_controller_1.chatController.getOrderChats);
router.get('/order-user-chats/:userId', chat_controller_1.chatController.getOrderUserChats);
router.get('/user/:userId/chats', chat_controller_1.chatController.getUserChatRooms);
router.post('/room', chat_controller_1.chatController.getChatRoom);
router.post('/message', chat_controller_1.chatController.sendMessage);
router.get('/room/:chatRoomId/messages', chat_controller_1.chatController.getMessages);
exports.ChatRoutes = router;
