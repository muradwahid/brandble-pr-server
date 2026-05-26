"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// notification.service.ts
const createNotification = async (recipientId, title, message, type = 'order_status', orderId, userId) => {
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const notificationData = {
        title,
        message,
        type,
        recipientId,
        status: 'unread',
        user: { connect: { id: userId } },
    };
    if (orderId) {
        notificationData.order = { connect: { id: orderId } };
    }
    return await prisma_1.default.notification.create({
        data: notificationData,
    });
};
const getUnreadNotificationCount = async (userId) => {
    const result = await prisma_1.default.notification.count({
        where: {
            recipientId: userId,
            status: 'unread'
        }
    });
    return result || 0;
};
const getNotifications = async (userId, filters = {}) => {
    const { page = 1, limit = 20, status } = filters;
    const skip = (page - 1) * limit;
    const where = { recipientId: userId };
    if (status) {
        where.status = status;
    }
    const [notifications, total] = await Promise.all([
        prisma_1.default.notification.findMany({
            where,
            include: {
                order: {
                    include: {
                        publication: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        }),
        prisma_1.default.notification.count({ where })
    ]);
    // Group notifications by date
    const groupedNotifications = groupNotificationsByDate(notifications);
    return {
        data: groupedNotifications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const markAsRead = async (notificationId, userId) => {
    return await prisma_1.default.notification.updateMany({
        where: {
            id: notificationId,
            recipientId: userId
        },
        data: {
            status: 'read'
        }
    });
};
const markAllAsRead = async (userId) => {
    return await prisma_1.default.notification.updateMany({
        where: {
            recipientId: userId,
            status: 'unread'
        },
        data: {
            status: 'read'
        }
    });
};
// Helper function to group notifications by date
const groupNotificationsByDate = (notifications) => {
    const groups = {
        today: [],
        yesterday: [],
        thisWeek: [],
        older: []
    };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    notifications.forEach(notification => {
        const notificationDate = new Date(notification.createdAt);
        const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
        if (notificationDay.getTime() === today.getTime()) {
            groups.today.push(notification);
        }
        else if (notificationDay.getTime() === yesterday.getTime()) {
            groups.yesterday.push(notification);
        }
        else if (notificationDate >= oneWeekAgo) {
            groups.thisWeek.push(notification);
        }
        else {
            groups.older.push(notification);
        }
    });
    return groups;
};
exports.NotificationService = {
    createNotification,
    getUnreadNotificationCount,
    getNotifications,
    markAsRead,
    markAllAsRead
};
