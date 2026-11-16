import React,{useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {ArrowRight,Check,LogOut,MapPin,PackageOpen,Plus,Trash2,ChevronDown,Star} from 'lucide-react';
import {money} from '../../../shared/utils/format.js';
import {api} from '../../../shared/services/api.js';
import {usePage} from '../../../shared/hooks/usePage.jsx';

const STEPS=[['placed','Order placed'],['confirmed','Confirmed'],['packed','Packed'],['out-for-delivery','Out for delivery'],['delivered','Delivered']];
const MESSAGES={placed:'We have received your order. The store will confirm it shortly.',confirmed:'The store has confirmed your order.',processing:'Your order is being prepared.',packed:'Your order is packed and ready to leave.','out-for-delivery':'Your order is on its way to you.',delivered:'Delivered. Enjoy your groceries!',cancelled:'This order was cancelled.'};
const stepIndex=s=>s==='processing'?1:STEPS.findIndex(x=>x[0]===s);
const label=s=>s==='placed'?'Order placed':s.replaceAll('-',' ');
const plural=(n,w)=>`${n} ${w}${n===1?'':'s'}`;

function OrderCard({o}){
  const[open,setOpen]=useState(false),idx=stepIndex(o.status),cancelled=o.status==='cancelled';
  return <article className="acc-order"><button className="acc-order-head" onClick={()=>setOpen(!open)} aria-expanded={open}><div><b>Order #{String(o._id).slice(-7).toUpperCase()}</b><small>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · {plural(o.items.length,'item')}</small></div><span className={'status status-'+o.status}>{label(o.status)}</span><b className="acc-total">{money(o.total)}</b><ChevronDown size={18} className={open?'flip':''}/></button>
    <p className={'acc-msg'+(cancelled?' bad':'')}>{MESSAGES[o.status]}</p>
    {!cancelled&&<ol className="acc-track">{STEPS.map(([k,t],i)=><li key={k} className={i<=idx?'done':''}><span>{i<idx?<Check size={13}/>:i+1}</span>{t}</li>)}</ol>}
    {open&&<div className="acc-detail"><div><b>Items</b>{o.items.map((it,i)=><p key={i}>{it.name} × {it.quantity}<span>{money(it.price*it.quantity)}</span></p>)}{o.discount>0&&<p>Discount<span>-{money(o.discount)}</span></p>}{o.deliveryFee>0&&<p>Delivery<span>{money(o.deliveryFee)}</span></p>}<p><b>Total</b><span><b>{money(o.total)}</b></span></p></div><div><b>Delivering to</b><p className="plain">{o.address?.name} · {o.address?.phone}<br/>{[o.address?.line1,o.address?.line2,o.address?.city,o.address?.state,o.address?.pincode].filter(Boolean).join(', ')}</p><b>Payment</b><p className="plain">{o.paymentMethod==='razorpay'?'Paid online':'Cash on delivery'} · {o.paymentStatus}</p></div></div>}
  </article>
}

export function Account({user,setUser,notify}){
  const navigate=useNavigate(),[orders,setOrders]=useState([]),[addresses,setAddresses]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[tab,setTab]=useState('orders'),[adding,setAdding]=useState(false),[pageOrders,ordersPager]=usePage(orders,5);
  const say=m=>{if(notify)notify(m)};
  useEffect(()=>{if(!user)return;Promise.all([api.get('/orders'),api.get('/addresses')]).then(([o,a])=>{setOrders(o.data.items);setAddresses(a.data.items)}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[user]);
  const reloadAddresses=async()=>{const a=await api.get('/addresses');setAddresses(a.data.items)};
  const addAddress=async e=>{e.preventDefault();setError('');const form=e.currentTarget,address=Object.fromEntries(new FormData(form).entries());address.isDefault=addresses.length===0||address.isDefault==='on';try{await api.post('/addresses',address);await reloadAddresses();form.reset();setAdding(false);say('Address saved.')}catch(err){setError(err.message)}};
  const makeDefault=async id=>{try{await api.patch('/addresses/'+id,{isDefault:true});await reloadAddresses();say('Default address updated.')}catch(err){setError(err.message)}};
  const remove=async id=>{if(!window.confirm('Delete this address?'))return;try{await api.delete('/addresses/'+id);await reloadAddresses();say('Address deleted.')}catch(err){setError(err.message)}};
  const signOut=async()=>{try{await api.post('/auth/logout')}catch{}setUser(null);navigate('/')};
  if(!user)return <main className="account-page"><div className="empty-page"><h1>Your account</h1><p>Sign in to see orders and delivery addresses.</p><Link className="btn btn-green" to="/login">Sign in <ArrowRight size={16}/></Link></div></main>;
  const active=orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length;
  return <main className="account-page">
    <div className="account-top"><div><span className="kicker">YOUR JAISWAL GROCERY</span><h1>Hello, <em>{user.name.split(' ')[0]}.</em></h1><p>{user.email}</p></div><button className="outline-btn" onClick={signOut}><LogOut size={15}/> Sign out</button></div>
    <div className="acc-summary"><div><b>{orders.length}</b><span>Total orders</span></div><div className={active?'hot':''}><b>{active}</b><span>In progress</span></div><div><b>{addresses.length}</b><span>Saved addresses</span></div></div>
    {error&&<div className="form-error" role="alert">{error}</div>}
    <div className="acc-tabs" role="tablist"><button role="tab" aria-selected={tab==='orders'} className={tab==='orders'?'on':''} onClick={()=>setTab('orders')}><PackageOpen size={17}/> My orders</button><button role="tab" aria-selected={tab==='addresses'} className={tab==='addresses'?'on':''} onClick={()=>setTab('addresses')}><MapPin size={17}/> Delivery addresses</button></div>
    {tab==='orders'?<section className="account-panel"><p className="acc-help">Tap an order to see its items, address and payment. The tracker shows where your order is right now.</p>{loading?<p className="admin-empty">Loading your orders…</p>:orders.length?<>{pageOrders.map(o=><OrderCard key={o._id} o={o}/>)}{ordersPager}</>:<div className="acc-empty"><PackageOpen size={34}/><b>No orders yet</b><p>When you place an order, you can track it here.</p><Link className="btn btn-green" to="/shop">Start shopping <ArrowRight size={16}/></Link></div>}</section>
    :<section className="account-panel"><p className="acc-help">Choose a default address and we will use it at checkout.</p><div className="acc-addr-grid">{addresses.map(a=><article key={a._id} className={'acc-addr'+(a.isDefault?' default':'')}><div className="acc-addr-top"><b>{a.label||'Address'}</b>{a.isDefault&&<span className="acc-badge"><Star size={12}/> Default</span>}</div><p>{a.name} · {a.phone}</p><p>{[a.line1,a.line2,a.city,a.state,a.pincode].filter(Boolean).join(', ')}</p><div className="acc-addr-actions">{!a.isDefault&&<button className="outline-btn" onClick={()=>makeDefault(a._id)}>Make default</button>}<button className="outline-btn danger" onClick={()=>remove(a._id)} aria-label="Delete address"><Trash2 size={15}/> Delete</button></div></article>)}{!addresses.length&&!loading&&<p className="admin-empty">You have no saved addresses yet.</p>}</div>
      {adding?<form className="admin-form acc-form" onSubmit={addAddress}><h3>New address</h3><div className="form-grid"><label>Label (e.g. Home, Work)<input name="label" defaultValue="Home"/></label><label>Full name<input name="name" required defaultValue={user.name}/></label><label>Phone number<input name="phone" required inputMode="tel"/></label><label>PIN code<input name="pincode" required inputMode="numeric"/></label><label className="span-two">Address (house no., street)<input name="line1" required/></label><label className="span-two">Landmark / area (optional)<input name="line2"/></label><label>City<input name="city" required/></label><label>State<input name="state" required/></label></div><label className="check-label"><input type="checkbox" name="isDefault"/> Make this my default address</label><div className="acc-form-actions"><button className="btn btn-green">Save address <Check size={16}/></button><button type="button" className="outline-btn" onClick={()=>setAdding(false)}>Cancel</button></div></form>:<button className="btn btn-green acc-add" onClick={()=>setAdding(true)}><Plus size={16}/> Add a new address</button>}
    </section>}
  </main>
}
