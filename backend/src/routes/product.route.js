import { Router } from 'express';
import { listProducts, productById, adminProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect, allowRoles } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { PRODUCT_ROLES } from '../config/roles.js';

const router=Router();

router.get('/products',asyncHandler(listProducts));
router.get('/products/:id',asyncHandler(productById));
router.get('/admin/products',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(adminProducts));
router.post('/admin/products',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(createProduct));
router.patch('/admin/products/:id',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(updateProduct));
router.delete('/admin/products/:id',protect,allowRoles(...PRODUCT_ROLES),asyncHandler(deleteProduct));

export default router;
