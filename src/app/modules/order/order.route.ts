import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OrderController } from './order.controller';

const router = Router();
router.get('/statistics', OrderController.getOrderStatistics);
router.get('/revenue-statistics', OrderController.getRevenueStatistics);
router.get('/orders-upcoming-deadlines', OrderController.getUpcomingDeadlines);
router.get('/specific-user-orders/:id', OrderController.getSpecificUserOrders);
router.get('/admin/payment-revenue-statistics', OrderController.getPaymentRevenueStatistics);
router.get('/admin/all-orders', OrderController.getAdminAllOrders);
router.get('/admin/orders', OrderController.getAdminOrders);
router.post('/create', OrderController.createOrder);
router.get('/user/all-orders', auth(ENUM_USER_ROLE.CLIENT), OrderController.userAllOrders);
router.get('/user-all-orders', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), OrderController.userOrders);
router.get('/running-orders',auth(ENUM_USER_ROLE.CLIENT,ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),OrderController.runningOrders)
router.get('/:id', OrderController.getOrderById);

router.patch('/:id', OrderController.updateOrder);
router.patch('/:id/status', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN) , OrderController.updateOrderStatus);
router.delete('/:id', OrderController.deleteOrder);


export const OrderRoutes = router;
