import { Router } from 'express';
import { categories, adminCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { PRODUCT_ROLES } from '../config/roles.js';

const router=Router();

router.get('/categories',asyncHandler(categories));
router.get('/admin/categories',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(adminCategories));
router.post('/admin/categories',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(createCategory));
router.patch('/admin/categories/:id',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(updateCategory));
router.delete('/admin/categories/:id',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(deleteCategory));

export default router;
