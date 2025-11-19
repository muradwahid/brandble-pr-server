import { Notification, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";

// notification.service.ts
const createNotification = async (
  recipientId: string,
  title: string,
  message: string,
  type: string = 'order_status',
  orderId?: string,
  userId?: string
): Promise<Notification> => {
  return await prisma.notification.create({
    data: {
      title,
      message,
      type,
      recipientId,
      status: 'unread',
      ...(orderId && {
        order: { connect: { id: orderId } }
      }),
      ...(userId && {
        user: { connect: { id: userId } }
      })
    }
  });
};
const getNotifications = async (userId: string, filters: any = {}) => {
  const { page = 1, limit = 20, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = { recipientId: userId };

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

const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
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
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead
}