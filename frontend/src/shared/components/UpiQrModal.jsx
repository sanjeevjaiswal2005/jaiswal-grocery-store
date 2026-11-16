import React,{useEffect,useState} from 'react';
import {CheckCircle2,LoaderCircle,X} from 'lucide-react';
import {money} from '../utils/format.js';
import {api} from '../services/api.js';

// Temporary manual UPI payment: customer scans the store QR, then submits the UTR for the store to confirm.
export function UpiQrModal({order,onClose,onPaid}){
  const[utr,setUtr]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(null);
  useEffect(()=>{const h=e=>{if(e.key==='Escape'&&!busy)onClose()};document.addEventListener('keydown',h);document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',h);document.body.style.overflow=''}},[busy,onClose]);
  const submit=async e=>{e.preventDefault();setError('');setBusy(true);try{const r=await api.post('/payments/upi-qr/submit',{orderId:order._id,utr});setDone(r.data.order)}catch(err){setError(err.message)}finally{setBusy(false)}};
  return <div className="pay-overlay" role="dialog" aria-modal="true" aria-label="Pay by UPI QR"><div className="pay-modal upi-modal">
    <button className="pay-close" onClick={()=>done?onPaid(done):onClose()} disabled={busy} aria-label="Close"><X size={18}/></button>
    <div className="pay-head"><span>Pay by UPI · Scan QR</span><b>{money(order.total)}</b><small>Order #{String(order._id).slice(-7).toUpperCase()}</small></div>
    {done?<div className="pay-state ok"><CheckCircle2 size={44}/><b>Payment submitted</b><p>We will check your payment and confirm your order shortly. You can track it in My orders.</p><button className="btn btn-green" onClick={()=>onPaid(done)}>Done</button></div>
    :<form onSubmit={submit}>
      <ol className="upi-steps"><li>Open PhonePe, Google Pay, Paytm or any UPI app and scan this QR.</li><li>Pay exactly <b>{money(order.total)}</b>.</li><li>Enter the <b>transaction ID (UTR)</b> from the payment receipt below.</li></ol>
      <img className="upi-qr" src="/upi-qr.jpg" alt="PhonePe UPI QR code for Sanjeev Jaiswal" width="260" height="337"/>
      {error&&<div className="form-error" role="alert">{error}</div>}
      <label>Transaction ID / UTR<input value={utr} onChange={e=>setUtr(e.target.value.replace(/\s/g,''))} placeholder="e.g. 412345678901" autoComplete="off" required minLength={8} maxLength={30}/></label>
      <button className="btn btn-green pay-submit" disabled={busy}>{busy?<><LoaderCircle className="spin" size={16}/> Submitting…</>:'I have paid'}</button>
      <button type="button" className="outline-btn" onClick={onClose} disabled={busy}>Pay later from My orders</button>
    </form>}
  </div></div>
}
