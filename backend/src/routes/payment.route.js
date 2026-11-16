import { Router } from 'express';
import { createDummyPayment, confirmDummyPayment } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.post('/payments/dummy/create',protect,asyncHandler(createDummyPayment));
router.post('/payments/dummy/confirm',protect,asyncHandler(confirmDummyPayment));

export default router;
