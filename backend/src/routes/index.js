import { Router } from 'express';
import authRoutes from './auth.route.js';
import productRoutes from './product.route.js';
import reviewRoutes from './review.route.js';
import categoryRoutes from './category.route.js';
import settingsRoutes from './settings.route.js';
import newsletterRoutes from './newsletter.route.js';
import cartRoutes from './cart.route.js';
import addressRoutes from './address.route.js';
import wishlistRoutes from './wishlist.route.js';
import couponRoutes from './coupon.route.js';
import orderRoutes from './order.route.js';
import notificationRoutes from './notification.route.js';
import reportRoutes from './report.route.js';
import inventoryRoutes from './inventory.route.js';

const router=Router();

router.get('/health',(req,res)=>res.json({success:true,data:{status:'ok'}}));
router.use(authRoutes);
router.use(productRoutes);
router.use(reviewRoutes);
router.use(categoryRoutes);
router.use(settingsRoutes);
router.use(newsletterRoutes);
router.use(cartRoutes);
router.use(addressRoutes);
router.use(wishlistRoutes);
router.use(couponRoutes);
router.use(orderRoutes);
router.use(notificationRoutes);
router.use(reportRoutes);
router.use(inventoryRoutes);

export default router;
