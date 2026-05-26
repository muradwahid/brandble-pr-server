"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocket = exports.getSocketIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("./app/modules/chat/chat.service");
const ApiError_1 = __importDefault(require("./errors/ApiError"));
const logger_1 = require("./shared/logger");
let io;
// Store connected users
const connectedUsers = new Map();
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                'https://app.brandable-pr.com',
                'https://www.app.brandable-pr.com',
                'https://www.brandable-pr.com',
                'https://brandable-pr.com',
                'http://localhost:5174',
                'http://localhost:5173',
                'http://localhost:5173'
            ],
            credentials: true,
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        // User joins the chat
        socket.on('user_join', async (data) => {
            const { userId, userRole } = data;
            connectedUsers.set(userId, socket.id);
            socket.userId = userId;
            // Join user to their personal room
            socket.join(`user_${userId}`);
            // If admin, join admin room
            if (userRole === 'admin') {
                socket.join('admin_room');
            }
        });
        // Rest of your socket event handlers remain the same...
        // Join specific chat room
        socket.on('join_chat_room', (chatRoomId) => {
            socket.join(`chat_${chatRoomId}`);
        });
        // Leave chat room
        socket.on('leave_chat_room', (chatRoomId) => {
            socket.leave(`chat_${chatRoomId}`);
        });
        // Send message
        socket.on('send_message', async (data) => {
            try {
                const { chatRoomId, senderId, content, messageType = 'text' } = data;
                // Save message to database
                const message = await chat_service_1.chatService.sendMessage(chatRoomId, senderId, content, messageType);
                // Emit to all users in the chat room
                io.to(`chat_${chatRoomId}`).emit('new_message', message);
                // Notify participants about new message (for chat list updates)
                const chatRoom = await chat_service_1.chatService.getChatRoom(chatRoomId);
                if (chatRoom) {
                    // Notify the other user
                    const otherUserId = senderId === chatRoom.userId ? chatRoom.adminId : chatRoom.userId;
                    socket.to(`user_${otherUserId}`).emit('chat_updated', chatRoom);
                    // If admin, notify admin room for real-time updates
                    if (chatRoom.adminId) {
                        socket.to('admin_room').emit('admin_chat_updated', chatRoom);
                    }
                }
            }
            catch (error) {
                logger_1.logger.error('Error sending message:', error);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });
        // Typing indicators
        socket.on('typing_start', (data) => {
            socket.to(`chat_${data.chatRoomId}`).emit('user_typing', { userId: data.userId });
        });
        socket.on('typing_stop', (data) => {
            socket.to(`chat_${data.chatRoomId}`).emit('user_stop_typing', { userId: data.userId });
        });
        // Handle disconnection
        socket.on('disconnect', () => {
            if (socket.userId) {
                connectedUsers.delete(socket.userId);
            }
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
const getSocketIO = () => {
    if (!io) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Socket IO not initialized.");
    }
    return io;
};
exports.getSocketIO = getSocketIO;
// Helper function to get socket instance by user ID
const getUserSocket = (userId) => {
    return connectedUsers.get(userId);
};
exports.getUserSocket = getUserSocket;
// import { Server } from "socket.io";
// import { chatService } from "./app/modules/chat/chat.service";
// const connectedUsers = new Map<string, string>();
// export const initializeSocket = (server: any) => {
//   const io = new Server(server, {
//     cors: {
//       origin: [
//         "https://app.brandable-pr.com",
//         "https://www.app.brandable-pr.com",
//         "https://www.brandable-pr.com",
//         "https://brandable-pr.com",
//         "http://localhost:5174",
//         "http://localhost:5173",
//         "http://localhost:5173",
//       ],
//       credentials: true,
//       methods: ["GET", "POST"],
//     },
//   });
//   io.on("connection", (socket) => {
//     // -----------------------------
//     // User join
//     // -----------------------------
//     socket.on("user_join", async (data: { userId: string; userRole: string }) => {
//       const { userId, userRole } = data;
//       connectedUsers.set(userId, socket.id);
//       (socket as any).userId = userId;
//       (socket as any).userRole = userRole;
//       socket.join(`user_${userId}`);
//       if (userRole === "admin") {
//         socket.join("admin_room");
//       }
//     });
//     // -----------------------------
//     // Join / leave chat room
//     // -----------------------------
//     socket.on("join_chat_room", (chatRoomId: string) => {
//       socket.join(`chat_${chatRoomId}`);
//     });
//     socket.on("leave_chat_room", (chatRoomId: string) => {
//       socket.leave(`chat_${chatRoomId}`);
//     });
//     // -----------------------------
//     // Send message (Optimistic support: clientMessageId)
//     // -----------------------------
//     socket.on(
//       "send_message",
//       async (data: {
//         chatRoomId: string;
//         senderId: string;
//         content: string;
//         messageType?: string;
//         clientMessageId?: string; // ✅ add
//       }) => {
//         try {
//           const {
//             chatRoomId,
//             senderId,
//             content,
//             messageType = "text",
//             clientMessageId,
//           } = data;
//           // ✅ Save message (pass clientMessageId so client can replace optimistic message)
//           const message = await chatService.sendMessage(
//             chatRoomId,
//             senderId,
//             content,
//             messageType,
//             clientMessageId
//           );
//           // Emit to all in chat room
//           io.to(`chat_${chatRoomId}`).emit("new_message", message);
//           // Notify chat list updates
//           const chatRoom = await chatService.getChatRoom(chatRoomId);
//           if (chatRoom) {
//             const otherUserId =
//               senderId === chatRoom.userId ? chatRoom.adminId : chatRoom.userId;
//             if (otherUserId) {
//               socket.to(`user_${otherUserId}`).emit("chat_updated", chatRoom);
//             }
//             if (chatRoom.adminId) {
//               socket.to("admin_room").emit("admin_chat_updated", chatRoom);
//             }
//           }
//         } catch (error) {
//           console.error("Error sending message:", error);
//           socket.emit("message_error", { error: "Failed to send message" });
//         }
//       }
//     );
//     // -----------------------------
//     // Typing indicators (send chatRoomId too)
//     // -----------------------------
//     socket.on("typing_start", (data: { chatRoomId: string; userId: string }) => {
//       socket.to(`chat_${data.chatRoomId}`).emit("user_typing", {
//         userId: data.userId,
//         chatRoomId: data.chatRoomId, // ✅ add
//       });
//     });
//     socket.on("typing_stop", (data: { chatRoomId: string; userId: string }) => {
//       socket.to(`chat_${data.chatRoomId}`).emit("user_stop_typing", {
//         userId: data.userId,
//         chatRoomId: data.chatRoomId, // ✅ add
//       });
//     });
//     // -----------------------------
//     // Seen / Read receipts
//     // -----------------------------
//     socket.on("mark_read", async (data: { chatRoomId: string; userId: string }) => {
//       try {
//         const { chatRoomId, userId } = data;
//         // ✅ DB update (you implement this in chatService)
//         await chatService.markMessagesAsRead(chatRoomId, userId);
//         // Broadcast to room (so sender can show "Seen")
//         io.to(`chat_${chatRoomId}`).emit("messages_read", {
//           chatRoomId,
//           userId,
//           readAt: new Date().toISOString(),
//         });
//       } catch (error) {
//         console.error("Error marking messages as read:", error);
//       }
//     });
//     // -----------------------------
//     // Disconnect
//     // -----------------------------
//     socket.on("disconnect", () => {
//       const userId = (socket as any).userId;
//       if (userId) connectedUsers.delete(userId);
//     });
//   });
//   return io;
// };
// export const getUserSocket = (userId: string) => connectedUsers.get(userId);
