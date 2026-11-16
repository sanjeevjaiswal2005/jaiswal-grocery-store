import { Router } from 'express';
import { createDummyPayment, confirmDummyPayment, paymentConfig, createRazorpayPayment, verifyRazorpayPayment, razorpayWebhook, submitUpiQr, reviewUpiQr } from '../controllers/payment.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { ORDER_ROLES } from '../config/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.get('/payments/config',protect,asyncHandler(paymentConfig));
router.post('/payments/razorpay/create',protect,asyncHandler(createRazorpayPayment));
router.post('/payments/razorpay/verify',protect,asyncHandler(verifyRazorpayPayment));
router.post('/payments/razorpay/webhook',asyncHandler(razorpayWebhook));
router.post('/payments/upi-qr/submit',protect,asyncHandler(submitUpiQr));
router.patch('/admin/orders/:id/payment',protect,allowRoles(...ORDER_ROLES),asyncHandler(reviewUpiQr));
router.post('/payments/dummy/create',protect,asyncHandler(createDummyPayment));
router.post('/payments/dummy/confirm',protect,asyncHandler(confirmDummyPayment));

export default router;
