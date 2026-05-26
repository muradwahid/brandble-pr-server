import cron from 'node-cron';
import { logger } from '../../shared/logger';
import prisma from '../../shared/prisma';
import { sendNotificationMail } from '../../helpers/mail';
import { SocketHelper } from '../../helpers/SocketHelper';

let isCronRunning = false;

export const initOrderReminderCron = () => {
  if (process.env.NODE_APP_INSTANCE && process.env.NODE_APP_INSTANCE !== '0') {
    return;
  }

  cron.schedule('0 * * * *', async () => {
    if (isCronRunning) {
      return;
    }

    isCronRunning = true;

    try {
      const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
      const sixDaysAgo = new Date(Date.now() - 144 * 60 * 60 * 1000);

      const BATCH_SIZE = 100;
      const MAX_ITERATIONS = 50;
      let hasMore = true;
      let iterations = 0;
      let successCount = 0;
      let failCount = 0;
      let consecutiveAllFailed = 0;

      while (hasMore && iterations < MAX_ITERATIONS) {
        iterations++;

        const pendingOrders = await prisma.order.findMany({
          where: {
            detailsSubmitted: 'not-yet',
            createdAt: {
              lte: seventyTwoHoursAgo,
              gte: sixDaysAgo,
            },
            notifications: {
              none: {
                type: '72h_reminder',
              },
            },
          },
          include: {
            user: {
              select: {
                name: true,
                notifyMail: true,
                notifySMS: true,
                email: true,
              },
            },
          },
          take: BATCH_SIZE,
          orderBy: { createdAt: 'asc' },
        });

        if (pendingOrders.length === 0) {
          hasMore = false;
          break;
        }

        if (pendingOrders.length < BATCH_SIZE) {
          hasMore = false;
        }

        let batchSuccessCount = 0;

        for (const order of pendingOrders) {
          try {
            if (!order.userId) {
              logger.warn(`Order ${order.orderId} has no userId. Skipping.`);
              failCount++;
              continue;
            }

            // Both notifications in a single transaction — either both save or neither
            const [clientNotification, adminNotification] = await prisma.$transaction([
              prisma.notification.create({
                data: {
                  title: 'Action Required: Submit Article',
                  message: `Your information submission for <span class='font-semibold'>#${order.orderId}</span> is overdue. Please submit it within 24 hours to avoid delays.`,
                  type: '72h_reminder',
                  recipientId: order.userId,
                  recipientType: 'client',
                  submitStatus: 'delay',
                  status: 'unread',
                  user: { connect: { id: order.userId } },
                  order: { connect: { id: order.id } },
                },
              }),
              prisma.notification.create({
                data: {
                  title: 'Order Submission Delayed',
                  message: `<span class='font-semibold'>${order.user?.name}</span> didn't submitted information for order <span class='font-semibold'>#${order.orderId}</span> yet! Follow-up required immediately.`,
                  type: '72h_reminder',
                  recipientId: order.userId,
                  recipientType: 'admin',
                  submitStatus: 'delay',
                  status: 'unread',
                  user: { connect: { id: order.userId } },
                  order: { connect: { id: order.id } },
                },
              }),
            ]);

            // Emit socket events only after both are saved
            SocketHelper.sendToUser(order.userId, 'new_notification', clientNotification);
            SocketHelper.sendAllUsers('new_notification', adminNotification);

            // Email sent after DB save — prevents duplicate emails on retry
            if (order.user?.notifyMail && order.user?.email) {
              await sendNotificationMail(
                order.user.email,
                'Action Required: Submit Article',
                `Your information submission for <span class='font-semibold'>#${order.orderId}</span> is overdue. Please submit it within 24 hours to avoid delays.`
              );
            }

            successCount++;
            batchSuccessCount++;
          } catch (error) {
            logger.error(`Failed to notify for order ${order.orderId}:`, error);
            failCount++;
          }
        }

        // If entire batch failed, stop after 3 consecutive failed batches to prevent infinite loop
        if (batchSuccessCount === 0) {
          consecutiveAllFailed++;
          if (consecutiveAllFailed >= 3) {
            logger.warn('Order reminder cron: 3 consecutive batches fully failed. Stopping early.');
            hasMore = false;
          }
        } else {
          consecutiveAllFailed = 0;
        }
      }

      if (iterations >= MAX_ITERATIONS) {
        logger.warn('Order reminder cron hit max iteration limit — some orders may be unprocessed.');
      }

      logger.info(`Order reminder cron completed. Processed: ${successCount}, Failed: ${failCount}`);
    } catch (error) {
      logger.error('Critical error in order reminder cron job:', error);
    } finally {
      isCronRunning = false;
    }
  });
};
