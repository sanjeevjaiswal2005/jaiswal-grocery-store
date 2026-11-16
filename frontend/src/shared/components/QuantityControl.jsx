import React,{memo} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {Minus,Plus} from 'lucide-react';
import {addItem,changeQty,remove} from '../../app/app.store.js';

function QuantityControlBase({p,notify,large=false}){const dispatch=useDispatch(),quantity=useSelector(s=>s.cart.items.find(row=>row.product?._id===p._id)?.quantity||0);const add=()=>{dispatch(addItem(p));if(quantity===0)notify(p.name+' added to your basket.')};const decrement=()=>{if(quantity<=1)dispatch(remove(p._id));else dispatch(changeQty({id:p._id,quantity:quantity-1}))};return quantity===0?<button type="button" className={'add-btn '+(large?'detail-add-btn':'')} disabled={!p.stock} onClick={add}>{p.stock?(large?'Add to cart':'ADD'):'Sold out'}</button>:<div className={'qty-control '+(large?'detail-qty':'')}><button type="button" aria-label={'Remove one '+p.name} onClick={decrement}><Minus size={15}/></button><span>{quantity}</span><button type="button" aria-label={'Add one '+p.name} disabled={quantity>=p.stock} onClick={add}><Plus size={15}/></button></div>}
export const QuantityControl=memo(QuantityControlBase);
