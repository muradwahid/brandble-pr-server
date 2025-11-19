import { Router } from 'express';
import { StripeController } from './stripe.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = Router();


router.post('/create-payment-intent', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.paymentIntent);
router.post('/save-payment-info', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.savePaymentInfo);
router.post('/setup-intent', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.createSetupIntent);
router.post('/save-method', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.savePaymentMethod);
router.post('/process-payment',
  auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  StripeController.processPayment);
router.get('/methods', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.getPaymentMethods);
router.post('/set-default', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.setDefaultPaymentMethod);
router.delete('/delete-method/:id', auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),StripeController.deletePaymentMethod);
// router.get('/default-payment-info',StripeController.getDefaultPayment)
export const  StripeRoutes= router;