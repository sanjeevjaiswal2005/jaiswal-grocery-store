import React,{lazy,Suspense} from 'react';
import {Link,Route,Routes,useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowRight} from 'lucide-react';
import {Header} from '../shared/components/Header.jsx';
import {Footer} from '../shared/components/Footer.jsx';
import {Home} from '../features/home/pages/Home.jsx';
const ProductDetailPage=lazy(()=>import('../features/product/pages/ProductDetailPage.jsx').then(m=>({default:m.ProductDetailPage})));
const Shop=lazy(()=>import('../features/shop/pages/Shop.jsx').then(m=>({default:m.Shop})));
const Auth=lazy(()=>import('../features/auth/pages/Auth.jsx').then(m=>({default:m.Auth})));
const CartPage=lazy(()=>import('../features/cart/pages/CartPage.jsx').then(m=>({default:m.CartPage})));
const Checkout=lazy(()=>import('../features/checkout/pages/Checkout.jsx').then(m=>({default:m.Checkout})));
const Account=lazy(()=>import('../features/account/pages/Account.jsx').then(m=>({default:m.Account})));
const Admin=lazy(()=>import('../features/admin/pages/Admin.jsx').then(m=>({default:m.Admin})));
const AdminTools=lazy(()=>import('../features/admin/pages/AdminTools.jsx').then(m=>({default:m.AdminTools})));
const WishlistPage=lazy(()=>import('../features/wishlist/pages/WishlistPage.jsx').then(m=>({default:m.WishlistPage})));

export function RoutesView({user,setUser,notify}){const location=useLocation();return <motion.div key={location.pathname+location.search} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.22}}><Suspense fallback={<div className="boot-splash"><span className="spin-ring"/></div>}><Routes><Route path="/" element={<><Header user={user}/><Home notify={notify}/><Footer/></>}/><Route path="/shop" element={<><Header user={user}/><Shop notify={notify}/><Footer/></>}/><Route path="/product/:id" element={<><Header user={user}/><ProductDetailPage notify={notify}/><Footer/></>}/><Route path="/wishlist" element={<><Header user={user}/><WishlistPage user={user} notify={notify}/><Footer/></>}/><Route path="/login" element={<><Header user={user}/><Auth user={user} setUser={setUser}/><Footer/></>}/><Route path="/cart" element={<><Header user={user}/><CartPage user={user} notify={notify}/><Footer/></>}/><Route path="/checkout" element={<><Header user={user}/><Checkout user={user} notify={notify}/><Footer/></>}/><Route path="/account" element={<><Header user={user}/><Account user={user} setUser={setUser} notify={notify}/><Footer/></>}/><Route path="/admin/catalog" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/categories" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/inventory" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/coupons" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/reviews" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/settings" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/reports" element={<AdminTools user={user} notify={notify}/>} /><Route path="/admin/*" element={<Admin user={user} setUser={setUser} notify={notify}/>} /><Route path="*" element={<><Header user={user}/><main className="empty-page"><h1>Page not found</h1><Link className="btn" to="/">Back to the store <ArrowRight size={16}/></Link></main><Footer/></>}/></Routes></Suspense></motion.div>}
