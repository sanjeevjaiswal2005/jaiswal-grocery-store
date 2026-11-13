import { Router } from 'express';
import { overview, salesCsv } from '../controllers/report.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ADMIN_ROLES } from '../config/roles.js';

const router=Router();

router.get('/admin/overview',protect,allowRoles(...ADMIN_ROLES),asyncHandler(overview));
router.get('/admin/reports/sales.csv',protect,allowRoles(...ADMIN_ROLES),asyncHandler(salesCsv));

export default router;
