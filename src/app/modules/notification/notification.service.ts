import { Notification, Prisma } from "../../../generated/client/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { SocketHelper } from "../../../helpers/SocketHelper";

// notification.service.ts
const createNotification = async (
  recipientId: string,
  title: string,
  message: string,
  type: string = '',
  orderId?: string,
  userId?: string,
  recipientType?: string,
  submitStatus?: string
): Promise<Notification> => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND,'User not found')
  }
  const notificationData: Prisma.NotificationCreateInput = {
    title,
    message,
    type,
    recipientId,
    recipientType,
    submitStatus,
    status: 'unread',
    user: { connect: { id: userId } },
  };

  if (orderId) {
    notificationData.order = { connect: { id: orderId } };
  }

  const result = await prisma.notification.create({
    data: notificationData,
  });

  if (recipientType === 'admin') {
    SocketHelper.sendAllUsers('new_notification', result);
  } else { 
    SocketHelper.sendToUser(recipientId, 'new_notification', result);
  }

  return result;
};

const getAdminUnreadNotificationCount = async () => {
   const result=await prisma.notification.count({
     where: {
      recipientType: 'admin',
      status: 'unread'
    }
   });
  return result || 0;
};

const getUnreadNotificationCount = async (userId: string) => {
   const result=await prisma.notification.count({
    where: {
      recipientId: userId,
      status: 'unread'
    }
   });
  return result || 0;
};

const getAdminAllNotifications = async (filters: any = {}) => {
  const { page = 1, limit = 20, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = { recipientType: 'admin' };

  if (status) {
    where.status = status;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
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
    prisma.notification.count({ where })
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

const getNotifications = async (userId: string, filters: any = {}) => {
  const { page = 1, limit = 20, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = { recipientId: userId, recipientType: 'client' };

  if (status) {
    where.status = status;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
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
    prisma.notification.count({ where })
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

const markAsRead = async (notificationId: string, userId: string) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId
    },
    data: {
      status: 'read'
    }
  });
};

const markAllAsRead = async (userId: string, type: string) => {
  
  if (type === 'admin') {
     const result = await prisma.notification.updateMany({
      where: {
        recipientType: 'admin',
        status: 'unread'
      },
      data: {
        status: 'read'
      }
     });
    return result;
  }

  if (type === 'client') {
    const result = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        recipientType: 'client',
        status: 'unread'
      },
      data: {
        status: 'read'
      }
    });
    return result;
  }
};

// Helper function to group notifications by date
const groupNotificationsByDate = (notifications: any[]) => {
  const groups: any = {
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
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else if (notificationDate >= oneWeekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};


export const NotificationService = {
  getAdminUnreadNotificationCount,
  createNotification,
  getUnreadNotificationCount,
  getAdminAllNotifications,
  getNotifications,
  markAsRead,
  markAllAsRead
}