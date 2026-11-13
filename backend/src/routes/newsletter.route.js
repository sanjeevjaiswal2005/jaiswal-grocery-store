import { Router } from 'express';
import { subscribeNewsletter } from '../controllers/newsletter.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router=Router();

router.post('/newsletter',asyncHandler(subscribeNewsletter));

export default router;
