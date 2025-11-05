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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./app/modules/chat/chat.service");
let io = null;
/**
 * Initialize Socket.IO server
 * @param server - HTTP server instance
 */
function initializeSocket(server) {
    if (io) {
        return io;
    }
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    // Socket authentication middleware
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            // In a real app, verify JWT and extract user ID
            // For this example, assume token is userId
            const userId = token;
            socket.data.userId = userId;
            next();
        }
        catch (error) {
            next(new Error("Authentication error"));
        }
    }));
    // Socket connection handler
    io.on("connection", (socket) => {
        console.log("User connected:", socket.data.userId);
        // Join room event
        socket.on("join-room", (roomId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const canAccess = yield chat_service_1.ChatService.canUserAccessRoom(roomId, socket.data.userId);
                if (canAccess.success) {
                    socket.join(roomId);
                    console.log(`User ${socket.data.userId} joined room ${roomId}`);
                    // Mark messages as read when joining
                    yield chat_service_1.ChatService.markMessagesAsRead(roomId, socket.data.userId);
                    socket.emit("room-joined", { roomId });
                }
                else {
                    socket.emit("error", { message: "Access denied to room" });
                }
            }
            catch (error) {
                socket.emit("error", { message: "Failed to join room" });
            }
        }));
        // Send message event
        socket.on("send-message", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, content, type = "text", fileUrl = null } = data;
                const result = yield chat_service_1.ChatService.sendMessage({
                    roomId,
                    userId: socket.data.userId,
                    content: content !== null && content !== void 0 ? content : null,
                    type,
                    fileUrl,
                });
                if (result) {
                    // Broadcast to all users in the room
                    io === null || io === void 0 ? void 0 : io.to(roomId).emit("new-message", result);
                    // Send delivery confirmation to sender
                    socket.emit("message-sent", result);
                }
                else {
                    socket.emit("error", { message: result !== null && result !== void 0 ? result : "Failed to send" });
                }
            }
            catch (error) {
                socket.emit("error", { message: "Failed to send message" });
            }
        }));
        // Typing indicators
        socket.on("typing-start", (roomId) => {
            socket.to(roomId).emit("user-typing", {
                userId: socket.data.userId,
                roomId,
            });
        });
        socket.on("typing-stop", (roomId) => {
            socket.to(roomId).emit("user-stop-typing", {
                userId: socket.data.userId,
                roomId,
            });
        });
        // Mark messages as read
        socket.on("mark-read", (roomId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield chat_service_1.ChatService.markMessagesAsRead(roomId, socket.data.userId);
                socket.to(roomId).emit("messages-read", {
                    userId: socket.data.userId,
                    roomId,
                });
            }
            catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }));
        // Leave room event
        socket.on("leave-room", (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.data.userId} left room ${roomId}`);
        });
        // Disconnect event
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.data.userId);
        });
    });
    return io;
}
/**
 * Get Socket.IO instance
 */
function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
