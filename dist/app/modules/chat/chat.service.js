"use strict";
// import { ChatRoom } from "@prisma/client";
// import { chatPrisma } from "../../../shared/chatprisma";
// const createChat = async (data:any) => { 
//   const { orderId, title, description, participantIds, createdBy } = data;
//   const order = await chatPrisma.order.findUnique({
//     where: {
//       id: orderId,
//     },
//     include: { user: true }
//   })
//   if (!order) {
//     throw new Error('Order not found');
//   }
//   // Create chat room with participants
//   const chatRoom = await chatPrisma.chatRoom.create({
//     data: {
//       orderId,
//       title,
//       description,
//       participants: {
//         create: [
//           // Add order owner
//           { userId: order.userId, role: 'user' },
//           // Add creator if not already included
//           ...(createdBy !== order.userId ? [{ userId: createdBy, role: 'user' }] : []),
//           // Add other participants
//           ...participantIds
//             .filter((id: string) => id !== order.userId && id !== createdBy)
//             .map((userId: string) => ({ userId, role: 'user' }))
//         ]
//       }
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true
//         }
//       }
//     }
//   });
//   return chatRoom;
// }
// const getChatRoomByOrder = async (orderId: string) => {
//   const chatRoom = await chatPrisma.chatRoom.findUnique({
//     where: { orderId },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       messages: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         },
//         orderBy: {
//           createdAt: 'asc'
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true,
//           amount: true
//         }
//       }
//     }
//   });
//   if (!chatRoom) {
//     throw new Error('Chat room not found');
//   }
//   return chatRoom;
// }
// const sendMessage = async (data: any) => { 
//   const { roomId, userId, content, type = 'text', fileUrl = null } = data;
//   // Verify user has access to room
//   const canAccess = await canUserAccessRoom(roomId, userId);
//   if (!canAccess.success) {
//     throw new Error('Access denied to chat room');
//   }
//   // Create message
//   const message = await chatPrisma.chatMessage.create({
//     data: {
//       roomId,
//       userId,
//       content,
//       type,
//       fileUrl,
//       readBy: [userId] // Mark as read by sender
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       },
//       room: {
//         select: {
//           id: true,
//           roomId: true,
//           title: true
//         }
//       }
//     }
//   });
// }
// const canUserAccessRoom = async (roomId: string, userId: string) => {
//   try {
//     const participant = await chatPrisma.chatParticipant.findUnique({
//       where: {
//         roomId_userId: {
//           roomId,
//           userId
//         }
//       }
//     });
//     return {
//       success: !!participant,
//       data: participant
//     };
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     return {
//       success: false,
//       error: message
//     };
//   }
// }
// const getUserChatRooms = async (user:any) => { 
//   const { id: userId } = user;
//   const chatRooms = await chatPrisma.chatRoom.findMany({
//     where: {
//       participants: {
//         some: {
//           userId
//         }
//       }
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               image: true
//             }
//           }
//         }
//       },
//       messages: {
//         orderBy: {
//           createdAt: 'desc'
//         },
//         take: 1,
//         include: {
//           user: {
//             select: {
//               name: true
//             }
//           }
//         }
//       },
//       order: {
//         select: {
//           orderId: true,
//           status: true,
//           orderType: true,
//           amount: true
//         }
//       }
//     },
//     orderBy: {
//       updatedAt: 'desc'
//     }
//   });
//   return chatRooms;
// }
// const addParticipant = async (roomId:string, user:any) => {
//   const { id: userId,role } = user;
//   const participant = await chatPrisma.chatParticipant.create({
//     data: {
//       roomId,
//       userId,
//       role
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       }
//     }
//   });
//   return participant;
// }
// const markMessagesAsRead = async (roomId: string, user: any) => { 
//   const { id: userId } = user;
//   // Get unread messages
//   const unreadMessages = await chatPrisma.chatMessage.findMany({
//     where: {
//       roomId,
//       NOT: {
//         readBy: {
//           has: userId
//         }
//       }
//     }
//   });
//   // Update each message to mark as read
//   for (const message of unreadMessages) {
//     await chatPrisma.chatMessage.update({
//       where: { id: message.id },
//       data: {
//         readBy: {
//           push: userId
//         }
//       }
//     });
//   }
//   return unreadMessages
// }
// const assignAdmin = async (data:any) => { 
//   const { adminId, userId, orderId, role = 'admin' } = data;
//   // Verify admin user exists and has admin role
//   const adminUser = await chatPrisma.user.findUnique({
//     where: { id: adminId },
//     select: { id: true, role: true }
//   });
//   if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
//     throw new Error('User is not an admin');
//   }
//   // Create admin assignment
//   const assignment = await chatPrisma.adminAssignment.create({
//     data: {
//       adminId,
//       userId,
//       orderId,
//       role
//     },
//     include: {
//       admin: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       },
//       user: userId ? {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true
//         }
//       } : false,
//       order: orderId ? {
//         select: {
//           id: true,
//           orderId: true,
//           status: true
//         }
//       } : false
//     }
//   });
//   return assignment;
// }
// const getAdminsByOrder = async (orderId:string) => { 
//   const assignments = await chatPrisma.adminAssignment.findMany({
//     where: {
//       orderId,
//       status: 'active'
//     },
//     include: {
//       admin: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           role: true,
//           image: true
//         }
//       }
//     }
//   });
//   return assignments;
// }
// const getAllActiveAdmins = async () => { 
//   const admins = await chatPrisma.user.findMany({
//     where: {
//       role: {
//         in: ['admin', 'super_admin']
//       }
//     },
//     select: {
//       id: true,
//       userId: true,
//       name: true,
//       email: true,
//       role: true,
//       image: true,
//       company: true,
//       designation: true
//     }
//   });
//   return admins;
// }
// export const ChatService = {
//   createChat,
//   getChatRoomByOrder,
//   sendMessage,
//   getUserChatRooms,
//   addParticipant,
//   markMessagesAsRead,
//   assignAdmin,
//   getAdminsByOrder,
//   getAllActiveAdmins
// }
