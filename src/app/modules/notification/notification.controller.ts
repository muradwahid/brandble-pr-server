import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse";
import { NotificationService } from "./notification.service";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => { 
  const user = req.user;
  const { page, limit, status } = req.query;

  const result = await NotificationService.getNotifications(user?.id, {
    page: parseInt(page as string) || 1,
    limit: parseInt(limit as string) || 20,
    status: status as string
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully!',
    data: result,
  })

})
const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => { 
  const { notificationId } = req.params;
  const user = req.user;

  const result = await NotificationService.markAsRead(notificationId, user?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  })

})
const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => { 
  const user = req.user;

  const result = await NotificationService.markAllAsRead(user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully!',
    data: result,
  })

})

export const NotificationController = {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
}