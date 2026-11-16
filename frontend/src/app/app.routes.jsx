import React from 'react';
import {Link,Route,Routes,useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowRight} from 'lucide-react';
import {Header} from '../shared/components/Header.jsx';
import {Footer} from '../shared/components/Footer.jsx';
import {Home} from '../features/home/pages/Home.jsx';
import {ProductDetailPage} from '../features/product/pages/ProductDetailPage.jsx';
import {Shop} from '../features/shop/pages/Shop.jsx';
import {Auth} from '../features/auth/pages/Auth.jsx';
import {CartPage} from '../features/cart/pages/CartPage.jsx';
import {Checkout} from '../features/checkout/pages/Checkout.jsx';
import {Account} from '../features/account/pages/Account.jsx';
import {Admin} from '../features/admin/pages/Admin.jsx';
import {AdminTools} from '../features/admin/pages/AdminTools.jsx';
import {WishlistPage} from '../features/wishlist/pages/WishlistPage.jsx';

export function RoutesView({user,setUser,notify}){const location=useLocation();return <motion.div key={location.pathname+location.search} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.22}}><Routes><Route path="/" element={<><Header user={user}/><Home notify={notify}/><Footer/></>}/><Route path="/shop" element={<><Header user={user}/><Shop notify={notify}/><Footer/></>}/><Route path="/product/:id" element={<><Header user={user}/><ProductDetailPage notify={notify}/><Footer/></>}/><Route path="/wishlist" element={<><Header user={user}/><WishlistPage user={user} notify={notify}/><Footer/></>}/><Route path="/login" element={<><Header user={user}/><Auth user={user} setUser={setUser}/><Footer/></>}/><Route path="/cart" element={<><Header user={user}/><CartPage user={user} notify={notify}/><Footer/></>}/><Route path="/checkout" element={<><Header user={user}/><Checkout user={user} notify={notify}/><Footer/></>}/><Route path="/account" element={<><Header user={user}/><Account user={user} setUser={setUser} notify={notify}/><Footer/></>}/><Route path="/admin/catalog" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/categories" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/inventory" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/coupons" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/reviews" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/settings" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/reports" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/*" element={<Admin user={user} setUser={setUser} notify={notify}/>} /><Route path="*" element={<><Header user={user}/><main className="empty-page"><h1>Page not found</h1><Link className="btn" to="/">Back to the store <ArrowRight size={16}/></Link></main><Footer/></>}/></Routes></motion.div>}
