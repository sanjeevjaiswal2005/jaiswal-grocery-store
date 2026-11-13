import { Router } from 'express';
import { publicSettings, adminSettings, updateSettings } from '../controllers/settings.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ADMIN_ROLES } from '../config/roles.js';

const router=Router();

router.get('/settings/public',asyncHandler(publicSettings));
router.get('/admin/settings',protect,allowRoles(...ADMIN_ROLES),asyncHandler(adminSettings));
router.patch('/admin/settings',protect,allowRoles(...ADMIN_ROLES),asyncHandler(updateSettings));

export default router;
