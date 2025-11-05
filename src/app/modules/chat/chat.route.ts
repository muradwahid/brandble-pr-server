// routes/chatRoutes.js
import { Router, Request, Response, NextFunction } from "express";
import { ChatController } from "./chat.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

// Chat routes
router.post('/order/:orderId/chat', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), ChatController.createOrderChat);
router.get('/order/:orderId/chat', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getOrderChat);
router.get('/user/chats', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getUserChats);
router.post('/:roomId/message', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.sendMessage);
router.post('/:roomId/participant', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), ChatController.addParticipant);

// Admin management routes
router.post('/admin/assign', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT), ChatController.assignAdmin);
router.get('/order/:orderId/admins', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getOrderAdmins);
router.get('/admins', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),ChatController.getAllAdmins);

export const ChatRoutes = router;