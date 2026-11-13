import { Router } from 'express';
import { createOrder, myOrders, orderById, adminOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ORDER_ROLES } from '../config/roles.js';

const router=Router();

router.post('/orders',protect,asyncHandler(createOrder));
router.get('/orders',protect,asyncHandler(myOrders));
router.get('/orders/:id',protect,asyncHandler(orderById));
router.get('/admin/orders',protect,allowRoles(...ORDER_ROLES),asyncHandler(adminOrders));
router.patch('/admin/orders/:id/status',protect,allowRoles(...ORDER_ROLES),asyncHandler(updateOrderStatus));

export default router;
