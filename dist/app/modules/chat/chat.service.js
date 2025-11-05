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
exports.ChatService = void 0;
const chatprisma_1 = require("../../../shared/chatprisma");
const createChatRoom = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, title, description, participantIds, createdBy } = data;
    const order = yield chatprisma_1.chatPrisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: { user: true }
    });
    if (!order) {
        throw new Error('Order not found');
    }
    // Create chat room with participants
    const chatRoom = yield chatprisma_1.chatPrisma.chatRoom.create({
        data: {
            orderId,
            title,
            description,
            participants: {
                create: [
                    // Add order owner
                    { userId: order.userId, role: 'user' },
                    // Add creator if not already included
                    ...(createdBy !== order.userId ? [{ userId: createdBy, role: 'user' }] : []),
                    // Add other participants
                    ...participantIds
                        .filter((id) => id !== order.userId && id !== createdBy)
                        .map((userId) => ({ userId, role: 'user' }))
                ]
            }
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            image: true
                        }
                    }
                }
            },
            order: {
                select: {
                    orderId: true,
                    status: true,
                    orderType: true
                }
            }
        }
    });
    return chatRoom;
});
const getChatRoomByOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatRoom = yield chatprisma_1.chatPrisma.chatRoom.findUnique({
        where: { orderId },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            image: true
                        }
                    }
                }
            },
            messages: {
                include: {
                    user: {
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
            },
            order: {
                select: {
                    orderId: true,
                    status: true,
                    orderType: true,
                    amount: true
                }
            }
        }
    });
    if (!chatRoom) {
        throw new Error('Chat room not found');
    }
    return chatRoom;
});
const sendMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId, content, type = 'text', fileUrl = null } = data;
    // Verify user has access to room
    const canAccess = yield canUserAccessRoom(roomId, userId);
    if (!canAccess.success) {
        throw new Error('Access denied to chat room');
    }
    // Create message
    const message = yield chatprisma_1.chatPrisma.chatMessage.create({
        data: {
            roomId,
            userId,
            content,
            type,
            fileUrl,
            readBy: [userId] // Mark as read by sender
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                }
            },
            room: {
                select: {
                    id: true,
                    roomId: true,
                    title: true
                }
            }
        }
    });
});
const canUserAccessRoom = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const participant = yield chatprisma_1.chatPrisma.chatParticipant.findUnique({
            where: {
                roomId_userId: {
                    roomId,
                    userId
                }
            }
        });
        return {
            success: !!participant,
            data: participant
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: message
        };
    }
});
const getUserChatRooms = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = user;
    const chatRooms = yield chatprisma_1.chatPrisma.chatRoom.findMany({
        where: {
            participants: {
                some: {
                    userId
                }
            }
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            image: true
                        }
                    }
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1,
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            order: {
                select: {
                    orderId: true,
                    status: true,
                    orderType: true,
                    amount: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return chatRooms;
});
const addParticipant = (roomId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const participant = yield chatprisma_1.chatPrisma.chatParticipant.create({
        data: {
            roomId,
            userId,
            role
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                }
            }
        }
    });
    return participant;
});
const markMessagesAsRead = (roomId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = user;
    // Get unread messages
    const unreadMessages = yield chatprisma_1.chatPrisma.chatMessage.findMany({
        where: {
            roomId,
            NOT: {
                readBy: {
                    has: userId
                }
            }
        }
    });
    // Update each message to mark as read
    for (const message of unreadMessages) {
        yield chatprisma_1.chatPrisma.chatMessage.update({
            where: { id: message.id },
            data: {
                readBy: {
                    push: userId
                }
            }
        });
    }
    return unreadMessages;
});
const assignAdmin = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, orderId } = data;
    const { id: userId, role } = user;
    // Verify admin user exists and has admin role
    const adminUser = yield chatprisma_1.chatPrisma.user.findUnique({
        where: { id: adminId },
        select: { id: true, role: true }
    });
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
        throw new Error('User is not an admin');
    }
    // Create admin assignment
    const assignment = yield chatprisma_1.chatPrisma.adminAssignment.create({
        data: {
            adminId,
            userId,
            orderId,
            role
        },
        include: {
            admin: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                }
            },
            user: userId ? {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            } : false,
            order: orderId ? {
                select: {
                    id: true,
                    orderId: true,
                    status: true
                }
            } : false
        }
    });
    return assignment;
});
const getOrderAdmins = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const assignments = yield chatprisma_1.chatPrisma.adminAssignment.findMany({
        where: {
            orderId,
            status: 'active'
        },
        include: {
            admin: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true
                }
            }
        }
    });
    return assignments;
});
const getAllActiveAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield chatprisma_1.chatPrisma.user.findMany({
        where: {
            role: {
                in: ['admin', 'super_admin']
            }
        },
        select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            role: true,
            image: true,
            company: true,
            designation: true
        }
    });
    return admins;
});
exports.ChatService = {
    createChatRoom,
    getChatRoomByOrder,
    sendMessage,
    getUserChatRooms,
    addParticipant,
    markMessagesAsRead,
    assignAdmin,
    getOrderAdmins,
    getAllActiveAdmins,
    canUserAccessRoom
};
