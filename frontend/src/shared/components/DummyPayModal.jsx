import React,{useEffect,useState} from 'react';
import {CheckCircle2,CreditCard,LoaderCircle,Smartphone,X,XCircle} from 'lucide-react';
import {money} from '../utils/format.js';
import {api} from '../services/api.js';

const CARDS=[['4111 1111 1111 1111','Success'],['4000 0000 0000 0002','Declined'],['4000 0000 0000 9995','No funds']];
const fmtCard=v=>v.replace(/\D/g,'').slice(0,19).replace(/(.{4})/g,'$1 ').trim();
const fmtExp=v=>{const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d};

// Test-mode checkout window. Mirrors a real gateway: create a payment, collect details, confirm on the server.
export function DummyPayModal({order,onClose,onPaid}){
  const[tab,setTab]=useState('card'),[card,setCard]=useState({number:'',expiry:'',cvv:''}),[upi,setUpi]=useState(''),[phase,setPhase]=useState('form'),[message,setMessage]=useState('');
  useEffect(()=>{const h=e=>{if(e.key==='Escape'&&phase!=='processing')onClose()};document.addEventListener('keydown',h);document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',h);document.body.style.overflow=''}},[phase,onClose]);
  const pay=async e=>{
    e.preventDefault();setMessage('');setPhase('processing');
    try{
      const created=await api.post('/payments/dummy/create',{orderId:order._id});
      const r=await api.post('/payments/dummy/confirm',{paymentId:created.data.payment.id,method:tab,card,upi});
      if(r.data.status==='paid'){setPhase('success');setTimeout(()=>onPaid(r.data.order),1400)}
      else{setMessage(r.data.message);setPhase('failed')}
    }catch(err){setMessage(err.message);setPhase('form')}
  };
  return <div className="pay-overlay" role="dialog" aria-modal="true" aria-label="Dummy payment"><div className="pay-modal">
    <div className="pay-test-banner">TEST MODE · No real money is charged</div>
    <button className="pay-close" onClick={onClose} disabled={phase==='processing'} aria-label="Close payment window"><X size={18}/></button>
    <div className="pay-head"><span>Jaiswal Grocery · Dummy Pay</span><b>{money(order.total)}</b><small>Order #{String(order._id).slice(-7).toUpperCase()}</small></div>
    {phase==='processing'&&<div className="pay-state"><LoaderCircle className="spin" size={38}/><b>Processing payment…</b><p>Please do not close this window.</p></div>}
    {phase==='success'&&<div className="pay-state ok"><CheckCircle2 size={44}/><b>Payment successful</b><p>Taking you back to your order…</p></div>}
    {phase==='failed'&&<div className="pay-state bad"><XCircle size={44}/><b>Payment failed</b><p>{message}</p><button className="btn btn-green" onClick={()=>setPhase('form')}>Try again</button><button className="outline-btn" onClick={onClose}>Pay later from My orders</button></div>}
    {phase==='form'&&<form onSubmit={pay}>
      <div className="pay-tabs" role="tablist"><button type="button" role="tab" aria-selected={tab==='card'} className={tab==='card'?'on':''} onClick={()=>setTab('card')}><CreditCard size={16}/> Card</button><button type="button" role="tab" aria-selected={tab==='upi'} className={tab==='upi'?'on':''} onClick={()=>setTab('upi')}><Smartphone size={16}/> UPI</button></div>
      {message&&<div className="form-error" role="alert">{message}</div>}
      {tab==='card'?<>
        <label>Card number<input inputMode="numeric" autoComplete="off" placeholder="4111 1111 1111 1111" value={card.number} onChange={e=>setCard({...card,number:fmtCard(e.target.value)})} required/></label>
        <div className="pay-row"><label>Expiry<input inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card,expiry:fmtExp(e.target.value)})} required/></label><label>CVV<input inputMode="numeric" type="password" autoComplete="off" maxLength={4} placeholder="•••" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\D/g,'')})} required/></label></div>
        <div className="pay-hints"><span>Test cards (tap to fill):</span>{CARDS.map(([n,l])=><button type="button" key={n} onClick={()=>setCard({number:n,expiry:'12/30',cvv:'123'})}>{l}</button>)}</div>
      </>:<>
        <label>UPI ID<input autoComplete="off" placeholder="success@dummy" value={upi} onChange={e=>setUpi(e.target.value)} required/></label>
        <div className="pay-hints"><span>Test UPI (tap to fill):</span><button type="button" onClick={()=>setUpi('success@dummy')}>Success</button><button type="button" onClick={()=>setUpi('failure@dummy')}>Failure</button></div>
      </>}
      <button className="btn btn-green pay-submit">Pay {money(order.total)}</button>
    </form>}
  </div></div>
}
