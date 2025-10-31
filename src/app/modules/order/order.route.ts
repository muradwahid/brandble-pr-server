import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

router.post('/create', OrderController.createOrder);
router.get('/all-orders', OrderController.allOrders);
router.get('/:id', OrderController.getOrderById);
router.patch('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);
router.get('/statistics', OrderController.getOrderStatistics);

export const OrderRoutes = router;
