import { Router } from 'express';
import { productReviews, createReview, adminReviews, moderateReview } from '../controllers/review.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ADMIN_ROLES } from '../config/roles.js';

const router=Router();

router.get('/products/:id/reviews',asyncHandler(productReviews));
router.post('/products/:id/reviews',protect,asyncHandler(createReview));
router.get('/admin/reviews',protect,allowRoles(...ADMIN_ROLES),asyncHandler(adminReviews));
router.patch('/admin/reviews/:id',protect,allowRoles(...ADMIN_ROLES),asyncHandler(moderateReview));

export default router;
