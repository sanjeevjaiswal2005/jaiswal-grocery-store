import React,{useEffect,useMemo,useState} from 'react';
import {CheckCircle2,LoaderCircle,Smartphone,X} from 'lucide-react';
import {money} from '../utils/format.js';
import {api} from '../services/api.js';

// Temporary manual UPI payment. The QR is generated per order with the amount locked in;
// the customer then submits the UTR and the store confirms it.
export function UpiQrModal({order,onClose,onPaid}){
  const[utr,setUtr]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(null),[cfg,setCfg]=useState(null),[qr,setQr]=useState('');
  const short=String(order._id).slice(-7).toUpperCase();
  useEffect(()=>{api.get('/payments/config').then(r=>setCfg({vpa:r.data.upiVpa,name:r.data.upiName})).catch(()=>setCfg({}))},[]);
  const link=useMemo(()=>cfg?.vpa?`upi://pay?pa=${cfg.vpa}&pn=${encodeURIComponent(cfg.name||'Jaiswal Grocery Store')}&am=${Number(order.total).toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order '+short)}&tr=${short}`:'',[cfg,order.total,short]);
  useEffect(()=>{if(!link)return;let live=true;import('qrcode').then(m=>m.toDataURL(link,{width:280,margin:2,errorCorrectionLevel:'M'})).then(url=>{if(live)setQr(url)}).catch(()=>{});return()=>{live=false}},[link]);
  useEffect(()=>{const h=e=>{if(e.key==='Escape'&&!busy)onClose()};document.addEventListener('keydown',h);document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',h);document.body.style.overflow=''}},[busy,onClose]);
  const submit=async e=>{e.preventDefault();setError('');setBusy(true);try{const r=await api.post('/payments/upi-qr/submit',{orderId:order._id,utr});setDone(r.data.order)}catch(err){setError(err.message)}finally{setBusy(false)}};
  const dynamic=Boolean(link);
  return <div className="pay-overlay" role="dialog" aria-modal="true" aria-label="Pay by UPI QR"><div className="pay-modal upi-modal">
    <button className="pay-close" onClick={()=>done?onPaid(done):onClose()} disabled={busy} aria-label="Close"><X size={18}/></button>
    <div className="pay-head"><span>Pay by UPI · Scan QR</span><b>{money(order.total)}</b><small>Order #{short}</small></div>
    {done?<div className="pay-state ok"><CheckCircle2 size={44}/><b>Payment submitted</b><p>We will check your payment and confirm your order shortly. You can track it in My orders.</p><button className="btn btn-green" onClick={()=>onPaid(done)}>Done</button></div>
    :<form onSubmit={submit}>
      <ol className="upi-steps"><li>Open PhonePe, Google Pay, Paytm or any UPI app and scan this QR.</li><li>{dynamic?<>The amount <b>{money(order.total)}</b> is filled in for you.</>:<>Pay exactly <b>{money(order.total)}</b>.</>}</li><li>Come back here and tap <b>I have paid</b>.</li></ol>
      {cfg===null?<div className="upi-qr upi-qr-wait"><LoaderCircle className="spin" size={28}/></div>
        :dynamic?(qr?<img className="upi-qr" src={qr} alt={`UPI QR for ${money(order.total)}`} width="260" height="260"/>:<div className="upi-qr upi-qr-wait"><LoaderCircle className="spin" size={28}/></div>)
        :<img className="upi-qr" src="/upi-qr.jpg" alt="PhonePe UPI QR code for Sanjeev Jaiswal" width="260" height="337"/>}
      {dynamic&&<div className="upi-meta"><span>Paying to <b>{cfg.name||cfg.vpa}</b></span><span>Amount <b>{money(order.total)}</b> (fixed)</span></div>}
      {dynamic&&<a className="btn btn-light upi-app-btn" href={link}><Smartphone size={16}/> Open in UPI app (on phone)</a>}
      {error&&<div className="form-error" role="alert">{error}</div>}
      <details className="upi-utr"><summary>Add transaction ID (optional, helps us confirm faster)</summary><label>Transaction ID / UTR<input value={utr} onChange={e=>setUtr(e.target.value.replace(/\s/g,''))} placeholder="e.g. 412345678901" autoComplete="off" maxLength={30}/></label></details>
      <button className="btn btn-green pay-submit" disabled={busy}>{busy?<><LoaderCircle className="spin" size={16}/> Submitting…</>:'I have paid'}</button>
      <button type="button" className="outline-btn" onClick={onClose} disabled={busy}>Pay later from My orders</button>
    </form>}
  </div></div>
}
