import { Server } from 'socket.io';
import { chatService } from './app/modules/chat/chat.service';

// Store connected users
const connectedUsers = new Map();

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
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
    socket.on('user_join', async (data: { userId: string; userRole: string }) => {
      const { userId, userRole } = data;
      connectedUsers.set(userId, socket.id);
      (socket as any).userId = userId;

      // Join user to their personal room
      socket.join(`user_${userId}`);

      // If admin, join admin room
      if (userRole === 'admin') {
        socket.join('admin_room');
      }

    });

    // Rest of your socket event handlers remain the same...
    // Join specific chat room
    socket.on('join_chat_room', (chatRoomId: string) => {
      socket.join(`chat_${chatRoomId}`);
    });

    // Leave chat room
    socket.on('leave_chat_room', (chatRoomId: string) => {
      socket.leave(`chat_${chatRoomId}`);
    });

    // Send message
    socket.on('send_message', async (data: {
      chatRoomId: string;
      senderId: string;
      content: string;
      messageType?: string;
    }) => {
      try {
        const { chatRoomId, senderId, content, messageType = 'text' } = data;

        // Save message to database
        const message = await chatService.sendMessage(chatRoomId, senderId, content, messageType);

        // Emit to all users in the chat room
        io.to(`chat_${chatRoomId}`).emit('new_message', message);

        // Notify participants about new message (for chat list updates)
        const chatRoom = await chatService.getChatRoom(chatRoomId);
        if (chatRoom) {
          // Notify the other user
          const otherUserId = senderId === chatRoom.userId ? chatRoom.adminId : chatRoom.userId;
          socket.to(`user_${otherUserId}`).emit('chat_updated', chatRoom);

          // If admin, notify admin room for real-time updates
          if (chatRoom.adminId) {
            socket.to('admin_room').emit('admin_chat_updated', chatRoom);
          }
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data: { chatRoomId: string; userId: string }) => {
      socket.to(`chat_${data.chatRoomId}`).emit('user_typing', { userId: data.userId });
    });

    socket.on('typing_stop', (data: { chatRoomId: string; userId: string }) => {
      socket.to(`chat_${data.chatRoomId}`).emit('user_stop_typing', { userId: data.userId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if ((socket as any).userId) {
        connectedUsers.delete((socket as any).userId);
      }
    });
  });

  return io;
};

// Helper function to get socket instance by user ID
export const getUserSocket = (userId: string) => {
  return connectedUsers.get(userId);
};