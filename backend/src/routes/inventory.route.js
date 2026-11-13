import { Router } from 'express';
import { inventoryHistory, adjustInventory } from '../controllers/inventory.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { PRODUCT_ROLES } from '../config/roles.js';

const router=Router();

router.get('/admin/inventory/history',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(inventoryHistory));
router.post('/admin/inventory/:productId/adjust',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(adjustInventory));

export default router;
