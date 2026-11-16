import React from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {ArrowUpRight,Leaf,LogOut,LayoutDashboard,Boxes,ClipboardList,Tags,Warehouse,Ticket,Star,Settings,FileBarChart,Package} from 'lucide-react';
import {api} from '../../../shared/services/api.js';
import {AdminNotifications} from './AdminNotifications.jsx';

const MAIN=[['Overview','/admin',LayoutDashboard],['Orders','/admin?tab=orders',ClipboardList],['Products','/admin?tab=products',Boxes]];
const TOOLS=[['Catalog manager','/admin/catalog',Package],['Categories','/admin/categories',Tags],['Inventory','/admin/inventory',Warehouse],['Offers','/admin/coupons',Ticket],['Reviews','/admin/reviews',Star],['Reports','/admin/reports',FileBarChart],['Settings','/admin/settings',Settings]];

export function AdminShell({user,setUser,notify,title,children}){
  const loc=useLocation(),navigate=useNavigate(),tab=new URLSearchParams(loc.search).get('tab');
  const active=to=>{const[p,q]=to.split('?');if(loc.pathname.replace(/\/$/,'')!==p)return false;return q?tab===q.split('=')[1]:(p!=='/admin'||!tab)};
  const logout=async()=>{try{await api.post('/auth/logout')}catch{}setUser(null);navigate('/')};
  const item=([label,to,Icon])=><Link key={to} to={to} className={'admin-side-link'+(active(to)?' selected':'')}><Icon size={17}/> {label}</Link>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark"><Leaf size={22}/></span><span>jaiswal<span className="brand-light"> grocery</span><small>STORE STUDIO</small></span></Link><div className="admin-label">STORE MANAGEMENT</div>{MAIN.map(item)}<div className="admin-label">STORE TOOLS</div>{TOOLS.map(item)}<div className="sidebar-bottom"><span className="admin-avatar">{user.name[0]}</span><div><b>{user.name}</b><small>{user.role.replaceAll('-',' ')}</small></div><button aria-label="Sign out" onClick={logout}><LogOut size={16}/></button></div></aside><main className="admin-main"><header className="admin-topbar"><div><span className="kicker">JAISWAL GROCERY / STUDIO</span><h1>{title}</h1></div><AdminNotifications notify={notify} onOpen={()=>navigate('/admin?tab=orders')}/><Link className="view-store" to="/">View storefront <ArrowUpRight size={15}/></Link></header>{user.role==='customer'?<div className="admin-denied"><h2>Access is reserved for store staff.</h2><p>This account needs an admin role.</p></div>:children}</main></div>
}
