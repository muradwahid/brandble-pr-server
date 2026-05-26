"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const notification_service_1 = require("./notification.service");
const getMyNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { page, limit, status } = req.query;
    const result = await notification_service_1.NotificationService.getNotifications(user?.id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status: status
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications retrieved successfully!',
        data: result,
    });
});
const getUnreadNotificationCount = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await notification_service_1.NotificationService.getUnreadNotificationCount(user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Unread notification count retrieved successfully!',
        data: result,
    });
});
const markNotificationAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const { notificationId } = req.params;
    const user = req.user;
    const result = await notification_service_1.NotificationService.markAsRead(notificationId, user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read',
        data: result,
    });
});
const markAllNotificationsAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await notification_service_1.NotificationService.markAllAsRead(user?.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications retrieved successfully!',
        data: result,
    });
});
exports.NotificationController = {
    getMyNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead
};
