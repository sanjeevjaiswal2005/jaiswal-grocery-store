import { Router } from 'express';
import { validateCoupon, adminCoupons, createCoupon, updateCoupon } from '../controllers/coupon.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.middleware.js';
import { ADMIN_ROLES } from '../config/roles.js';

const router=Router();

router.post('/coupons/validate',protect,asyncHandler(validateCoupon));
router.get('/admin/coupons',protect,allowRoles(...ADMIN_ROLES),asyncHandler(adminCoupons));
router.post('/admin/coupons',protect,allowRoles(...ADMIN_ROLES),asyncHandler(createCoupon));
router.patch('/admin/coupons/:id',protect,allowRoles(...ADMIN_ROLES),asyncHandler(updateCoupon));

export default router;
