import { Router } from 'express';
import { getCart, setCart } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.get('/cart',protect,asyncHandler(getCart));
router.put('/cart',protect,asyncHandler(setCart));

export default router;
