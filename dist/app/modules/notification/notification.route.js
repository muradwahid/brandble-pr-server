"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
router.get('/my-notifications', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT), notification_controller_1.NotificationController.getMyNotifications);
router.get('/unread-count', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), notification_controller_1.NotificationController.getUnreadNotificationCount);
router.patch('/:notificationId/read', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), notification_controller_1.NotificationController.markNotificationAsRead);
router.patch('/mark-all-read', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), notification_controller_1.NotificationController.markAllNotificationsAsRead);
exports.NotificationRoutes = router;
