import { Router } from 'express';
import { listAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/address.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.get('/addresses',protect,asyncHandler(listAddresses));
router.post('/addresses',protect,asyncHandler(addAddress));
router.patch('/addresses/:id',protect,asyncHandler(updateAddress));
router.delete('/addresses/:id',protect,asyncHandler(deleteAddress));

export default router;
