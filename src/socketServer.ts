// // services/socketService.ts
// import http from "http";
// import { Server, Socket } from "socket.io";
// import chatServiceImport from "./chatService";

// /**
//  * If your chatService is a CommonJS module (module.exports = ...),
//  * TypeScript's default import may be `any`. Adjust as needed.
//  * Here we declare an interface that matches the functions used by this file.
//  */
// interface CanAccessResult {
//   success: boolean;
//   error?: string;
// }

// interface SendMessageResult {
//   success: boolean;
//   data?: any;    // replace `any` with your Message type
//   error?: string;
// }

// interface ChatService {
//   canUserAccessRoom(roomId: string, userId: string): Promise<CanAccessResult>;
//   markMessagesAsRead(roomId: string, userId: string): Promise<void>;
//   sendMessage(args: {
//     roomId: string;
//     userId: string;
//     content?: string | null;
//     type?: string;
//     fileUrl?: string | null;
//   }): Promise<SendMessageResult>;
// }

// // If your chatService is exported as default or as module.exports, adapt this cast
// const chatService = chatServiceImport as unknown as ChatService;

// /**
//  * Extend Socket type to include our application data (userId)
//  * We'll use `socket.data` (preferred approach in socket.io v4+)
//  */
// declare module "socket.io" {
//   interface SocketData {
//     userId?: string;
//   }
// }

// let io: Server | null = null;

// /**
//  * Initialize Socket.IO server
//  * @param server - HTTP server instance
//  */
// export function initializeSocket(server: http.Server) {
//   if (io) {
//     return io;
//   }

//   io = new Server(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   // Socket authentication middleware
//   io.use(async (socket: Socket, next) => {
//     try {
//       const token = socket.handshake.auth?.token as string | undefined;

//       if (!token) {
//         return next(new Error("Authentication error"));
//       }

//       // In a real app, verify JWT and extract user ID
//       // For this example, assume token is userId
//       const userId = token;
//       socket.data.userId = userId;
//       next();
//     } catch (error) {
//       next(new Error("Authentication error"));
//     }
//   });

//   // Socket connection handler
//   io.on("connection", (socket: Socket) => {
//     console.log("User connected:", socket.data.userId);

//     // Join room event
//     socket.on("join-room", async (roomId: string) => {
//       try {
//         const canAccess = await chatService.canUserAccessRoom(
//           roomId,
//           socket.data.userId as string
//         );

//         if (canAccess.success) {
//           socket.join(roomId);
//           console.log(`User ${socket.data.userId} joined room ${roomId}`);

//           // Mark messages as read when joining
//           await chatService.markMessagesAsRead(roomId, socket.data.userId as string);

//           socket.emit("room-joined", { roomId });
//         } else {
//           socket.emit("error", { message: "Access denied to room" });
//         }
//       } catch (error) {
//         socket.emit("error", { message: "Failed to join room" });
//       }
//     });

//     // Send message event
//     socket.on(
//       "send-message",
//       async (data: {
//         roomId: string;
//         content?: string | null;
//         type?: string;
//         fileUrl?: string | null;
//       }) => {
//         try {
//           const { roomId, content, type = "text", fileUrl = null } = data;

//           const result = await chatService.sendMessage({
//             roomId,
//             userId: socket.data.userId as string,
//             content: content ?? null,
//             type,
//             fileUrl,
//           });

//           if (result.success && result.data) {
//             // Broadcast to all users in the room
//             io?.to(roomId).emit("new-message", result.data);

//             // Send delivery confirmation to sender
//             socket.emit("message-sent", result.data);
//           } else {
//             socket.emit("error", { message: result.error ?? "Failed to send" });
//           }
//         } catch (error) {
//           socket.emit("error", { message: "Failed to send message" });
//         }
//       }
//     );

//     // Typing indicators
//     socket.on("typing-start", (roomId: string) => {
//       socket.to(roomId).emit("user-typing", {
//         userId: socket.data.userId,
//         roomId,
//       });
//     });

//     socket.on("typing-stop", (roomId: string) => {
//       socket.to(roomId).emit("user-stop-typing", {
//         userId: socket.data.userId,
//         roomId,
//       });
//     });

//     // Mark messages as read
//     socket.on("mark-read", async (roomId: string) => {
//       try {
//         await chatService.markMessagesAsRead(roomId, socket.data.userId as string);
//         socket.to(roomId).emit("messages-read", {
//           userId: socket.data.userId,
//           roomId,
//         });
//       } catch (error) {
//         console.error("Error marking messages as read:", error);
//       }
//     });

//     // Leave room event
//     socket.on("leave-room", (roomId: string) => {
//       socket.leave(roomId);
//       console.log(`User ${socket.data.userId} left room ${roomId}`);
//     });

//     // Disconnect event
//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.data.userId);
//     });
//   });

//   return io;
// }

// /**
//  * Get Socket.IO instance
//  */
// export function getIO(): Server {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// }
