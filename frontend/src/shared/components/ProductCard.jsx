import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Heart,Star} from 'lucide-react';
import {money,photos} from '../utils/format.js';
import {api} from '../services/api.js';
import {QuantityControl} from './QuantityControl.jsx';

export function ProductCard({p,notify}){const dispatch=useDispatch();const toggleFavorite=async e=>{e.preventDefault();e.stopPropagation();try{const r=await api.get('/wishlist'),ids=r.data.items.map(x=>x._id),next=ids.includes(p._id)?ids.filter(id=>id!==p._id):[...ids,p._id];await api.put('/wishlist',{productIds:next});notify(ids.includes(p._id)?'Removed from your saved picks.':'Saved to your favorites.')}catch{notify('Sign in to save your favorite picks.')}};const offer=p.compareAtPrice>p.price;return <article className="product-card"><Link to={'/product/'+p._id} className="product-img"><img src={p.image||photos[1]} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=photos[1]}} alt={p.name}/>{offer&&<span className="discount-tag">{Math.round((1-p.price/p.compareAtPrice)*100)}% OFF</span>}<button type="button" className="favorite" aria-label="Save for later" onClick={toggleFavorite}><Heart size={17}/></button></Link><div className="product-details"><div className="product-category">{p.category?.name||'Grocery'}</div><Link className="product-name" to={'/product/'+p._id}>{p.name}</Link><div className="product-rating"><Star size={13} fill="currentColor"/> {p.rating||'New'} <span>· {p.unit}</span></div><div className="product-bottom"><div className="product-prices"><b>{money(p.price)}</b>{offer&&<del>{money(p.compareAtPrice)}</del>}</div><QuantityControl p={p} notify={notify}/></div></div></article>}
