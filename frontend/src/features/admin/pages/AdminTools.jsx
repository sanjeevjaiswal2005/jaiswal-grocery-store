import React from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,Leaf,LayoutDashboard} from 'lucide-react';
import {AdminShell} from '../components/AdminShell.jsx';
import {ProductManager} from '../components/ProductManager.jsx';
import {CategoryManager} from '../components/CategoryManager.jsx';
import {InventoryManager} from '../components/InventoryManager.jsx';
import {CouponManager} from '../components/CouponManager.jsx';
import {ReviewManager} from '../components/ReviewManager.jsx';
import {SettingsManager} from '../components/SettingsManager.jsx';
import {ReportsManager} from '../components/ReportsManager.jsx';

export function AdminTools({user,setUser,notify}){const key=useLocation().pathname.split('/').pop(),titles={catalog:'Product catalog',categories:'Category management',inventory:'Inventory management',coupons:'Offers and coupons',reviews:'Review moderation',settings:'Store settings',reports:'Sales reports'},links=[['catalog','Products'],['categories','Categories'],['inventory','Inventory'],['coupons','Offers'],['reviews','Reviews'],['settings','Settings'],['reports','Reports']];if(!user)return <main className="auth-wrap"><div className="auth-card"><h1>Store team sign-in</h1><Link to="/login?next=/admin/categories" className="btn btn-green">Sign in <ArrowRight/></Link></div></main>;const content={catalog:<ProductManager notify={notify}/>,categories:<CategoryManager notify={notify}/>,inventory:<InventoryManager notify={notify}/>,coupons:<CouponManager notify={notify}/>,reviews:<ReviewManager notify={notify}/>,settings:<SettingsManager notify={notify}/>,reports:<ReportsManager notify={notify}/>}[key];return <AdminShell user={user} setUser={setUser} notify={notify} title={titles[key]||'Store tools'}>{content}</AdminShell>}
