import { Router } from 'express';
import { getWishlist, setWishlist } from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.get('/wishlist',protect,asyncHandler(getWishlist));
router.put('/wishlist',protect,asyncHandler(setWishlist));

export default router;
