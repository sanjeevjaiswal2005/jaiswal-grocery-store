import React,{useEffect,useRef,useState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {api} from '../services/api.js';
import {DummyPayModal} from './DummyPayModal.jsx';

const SDK='https://checkout.razorpay.com/v1/checkout.js';
const loadSdk=()=>new Promise((resolve,reject)=>{
  if(window.Razorpay)return resolve();
  const s=document.createElement('script');s.src=SDK;s.onload=resolve;s.onerror=()=>reject(new Error('Could not load the payment window. Check your connection.'));document.body.appendChild(s);
});

// Pays an order with Razorpay when the server has live keys, otherwise falls back to the dummy gateway.
export function PayOrder({order,onPaid,onClose}){
  const[provider,setProvider]=useState(null),[error,setError]=useState(''),started=useRef(false);
  useEffect(()=>{
    if(started.current)return;started.current=true;
    (async()=>{
      try{
        const cfg=await api.get('/payments/config');
        if(cfg.data.provider!=='razorpay'){setProvider('dummy');return}
        setProvider('razorpay');
        const[created]=await Promise.all([api.post('/payments/razorpay/create',{orderId:order._id}),loadSdk()]);
        const d=created.data;
        const rzp=new window.Razorpay({
          key:d.keyId,order_id:d.razorpayOrderId,amount:d.amount,currency:d.currency,
          name:'Jaiswal Grocery Store',description:'Order #'+String(order._id).slice(-7).toUpperCase(),
          prefill:{name:d.name,email:d.email},theme:{color:'#234d3c'},
          method:{upi:true,card:true,netbanking:true,wallet:true},
          config:{display:{blocks:{upi:{name:'Pay with UPI',instruments:[{method:'upi'}]},other:{name:'Cards, Netbanking & Wallets',instruments:[{method:'card'},{method:'netbanking'},{method:'wallet'}]}},sequence:['block.upi','block.other'],preferences:{show_default_blocks:false}}},
          handler:async resp=>{try{const r=await api.post('/payments/razorpay/verify',resp);onPaid(r.data.order)}catch(err){setError(err.message)}},
          modal:{ondismiss:()=>onClose()},
        });
        rzp.on('payment.failed',resp=>setError(resp.error?.description||'Payment failed. You can try again from My orders.'));
        rzp.open();
      }catch(err){setError(err.message)}
    })();
  },[]);
  if(provider==='dummy')return <DummyPayModal order={order} onClose={onClose} onPaid={onPaid}/>;
  return <div className="pay-overlay" role="status">{error?<div className="pay-modal"><div className="pay-state bad"><b>Payment problem</b><p>{error}</p><button className="outline-btn" onClick={onClose}>Pay later from My orders</button></div></div>:<div className="pay-state pay-wait"><LoaderCircle className="spin" size={34}/><b>Opening secure payment…</b></div>}</div>
}
