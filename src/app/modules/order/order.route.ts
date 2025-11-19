import { Router } from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = Router();

router.post('/create', OrderController.createOrder);
router.get('/all-orders', OrderController.allOrders);
router.get('/running-orders',auth(ENUM_USER_ROLE.CLIENT,ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),OrderController.runningOrders)
router.get('/:id', OrderController.getOrderById);
router.patch('/:id', OrderController.updateOrder);
router.patch('/:id/status', OrderController.updateOrderStatus);
router.delete('/:id', OrderController.deleteOrder);
router.get('/statistics', OrderController.getOrderStatistics);


export const OrderRoutes = router;
