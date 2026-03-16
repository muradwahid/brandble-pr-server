import { getSocketIO } from "../socketServer";

export const SocketHelper = {
  sendToUser: (userId: string, eventName: string, payload: any) => {
    const io = getSocketIO();
    io.to(`user_${userId}`).emit(eventName, payload);
  },

  sendToUserAndAdmins: (userId: string, eventName: string, payload: any) => {
    const io = getSocketIO();
    io.to(`user_${userId}`).to("admin_room").emit(eventName, payload);
  },

  sendAllUsers: (eventName: string, payload: any) => {
    const io = getSocketIO();
    io.to("admin_room").emit(eventName, payload);
  },
};