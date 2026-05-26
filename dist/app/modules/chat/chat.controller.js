"use strict";
// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import { ChatService } from "./chat.service";
// import { ITokenUser } from "./chat.interface";
// // const createChat = catchAsync(async (req: Request, res: Response) => {
// //   const genre = await ChatService.createChat(req.body);
// //   sendResponse(res, {
// //     statusCode: httpStatus.OK,
// //     success: true,
// //     message: 'Chat created successfully!',
// //     data: genre,
// //   });
// // });
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const chat_service_1 = require("./chat.service");
exports.chatController = {
    // Get user chat rooms for admin
    async getUserChats(req, res) {
        try {
            const { adminId } = req.params;
            const chatRooms = await chat_service_1.chatService.getUserChatRooms(adminId);
            res.json(chatRooms);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user chats' });
        }
    },
    async getClientChats(req, res) {
        try {
            const { clientId } = req.params;
            const chatRooms = await chat_service_1.chatService.getClientChatRooms(clientId);
            res.json(chatRooms);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user chats' });
        }
    },
    // Get order chat rooms for admin
    async getOrderChats(req, res) {
        try {
            const { adminId } = req.params;
            const chatRooms = await chat_service_1.chatService.getOrderChatRooms(adminId);
            res.json(chatRooms);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch order chats' });
        }
    },
    async getOrderUserChats(req, res) {
        try {
            const { userId } = req.params;
            const chatRooms = await chat_service_1.chatService.getOrderUserChats(userId);
            res.json(chatRooms);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch order chats' });
        }
    },
    // Get user's chat rooms
    async getUserChatRooms(req, res) {
        try {
            const { userId } = req.params;
            const chatRooms = await chat_service_1.chatService.getUserChats(userId);
            res.json(chatRooms);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch chats' });
        }
    },
    // Get or create chat room
    async getChatRoom(req, res) {
        try {
            const { orderId, userId, adminId } = req.body;
            let chatRoom;
            if (orderId) {
                chatRoom = await chat_service_1.chatService.getOrCreateOrderRoom(orderId, userId, adminId);
            }
            else {
                chatRoom = await chat_service_1.chatService.getOrCreateUserAdminRoom(userId, adminId);
            }
            res.json(chatRoom);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get chat room' });
        }
    },
    // Send message
    async sendMessage(req, res) {
        try {
            const { chatRoomId, senderId, content, messageType } = req.body;
            const message = await chat_service_1.chatService.sendMessage(chatRoomId, senderId, content, messageType);
            res.json(message);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    },
    // Get chat room messages
    async getMessages(req, res) {
        try {
            const { chatRoomId } = req.params;
            const messages = await prisma_1.default.chatMessage.findMany({
                where: { chatRoomId: chatRoomId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    }
};
