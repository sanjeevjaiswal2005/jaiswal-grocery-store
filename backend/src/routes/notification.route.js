import { Router } from 'express';
import { getNotifications, readNotification, readAllNotifications, clearNotifications } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.get('/notifications',protect,asyncHandler(getNotifications));
router.delete('/notifications',protect,asyncHandler(clearNotifications));
router.patch('/notifications/read-all',protect,asyncHandler(readAllNotifications));
router.patch('/notifications/:id/read',protect,asyncHandler(readNotification));

export default router;
