"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRoutes = void 0;
const express_1 = require("express");
const stripe_controller_1 = require("./stripe.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.post('/create-payment-intent', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.paymentIntent);
router.post('/save-payment-info', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.savePaymentInfo);
router.post('/setup-intent', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.createSetupIntent);
router.post('/save-method', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.savePaymentMethod);
router.post('/process-payment', 
// auth(ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
stripe_controller_1.StripeController.processPayment);
router.get('/methods', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.getPaymentMethods);
router.post('/set-default', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.setDefaultPaymentMethod);
router.delete('/delete-method/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CLIENT, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), stripe_controller_1.StripeController.deletePaymentMethod);
// router.get('/default-payment-info',StripeController.getDefaultPayment)
exports.StripeRoutes = router;
