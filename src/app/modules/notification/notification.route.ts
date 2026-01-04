import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = Router();

router.get('/my-notifications', NotificationController.getMyNotifications);
router.get('/unread-count', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), NotificationController.getUnreadNotificationCount);
router.patch(
  '/:notificationId/read',
  auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.markNotificationAsRead
);

router.patch(
  '/mark-all-read',
  auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.markAllNotificationsAsRead
);



export const NotificationRoutes = router;
