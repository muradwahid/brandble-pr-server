"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHelper = void 0;
const socketServer_1 = require("../socketServer");
exports.SocketHelper = {
    sendToUser: (userId, eventName, payload) => {
        const io = (0, socketServer_1.getSocketIO)();
        io.to(`user_${userId}`).emit(eventName, payload);
    },
    sendToUserAndAdmins: (userId, eventName, payload) => {
        const io = (0, socketServer_1.getSocketIO)();
        io.to(`user_${userId}`).to("admin_room").emit(eventName, payload);
    },
    sendAllUsers: (eventName, payload) => {
        const io = (0, socketServer_1.getSocketIO)();
        io.to("admin_room").emit(eventName, payload);
    },
};
