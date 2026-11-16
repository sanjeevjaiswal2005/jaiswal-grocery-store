import React,{useEffect,useRef,useState} from 'react';
import {Bell,ShoppingBag,Check,Trash2,Volume2,VolumeX} from 'lucide-react';
import {api} from '../../../shared/services/api.js';

const POLL_MS=6000;
const getCleared=()=>{try{return Number(localStorage.getItem('adminNotifCleared'))||0}catch{return 0}};
const getSound=()=>{try{return localStorage.getItem('adminSound')}catch{return null}};
const speak=t=>{try{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-IN';u.rate=.95;speechSynthesis.speak(u)}catch{}};
const beep=()=>{try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.4);o.start();o.stop(c.currentTime+.4)}catch{}};

export function AdminNotifications({notify,onOpen}){
  const[open,setOpen]=useState(false),[items,setItems]=useState([]),[unread,setUnread]=useState(0),seen=useRef(null),box=useRef(null),[sound,setSound]=useState(getSound()),soundRef=useRef(sound);soundRef.current=sound;
  const load=async()=>{try{const r=await api.get('/notifications');const fresh=r.data.items.filter(n=>!n.readAt);if(seen.current){const added=fresh.filter(n=>!seen.current.has(n._id));if(added.length){notify(added[0].title+': '+added[0].body);if(soundRef.current==='on'){beep();setTimeout(()=>speak(added.length>1?added.length+' new orders received':'New order received'),450)}}}seen.current=new Set(fresh.map(n=>n._id));const cut=getCleared(),visible=r.data.items.filter(n=>new Date(n.createdAt).getTime()>cut);setItems(visible);setUnread(visible.filter(n=>!n.readAt).length)}catch{}};
  useEffect(()=>{load();const t=setInterval(load,POLL_MS);return()=>clearInterval(t)},[]);
  useEffect(()=>{document.title=(unread?`(${unread}) `:'')+'Jaiswal Grocery'},[unread]);
  useEffect(()=>{const h=e=>{if(box.current&&!box.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
  const markRead=async n=>{if(!n.readAt){try{await api.patch('/notifications/'+n._id+'/read')}catch{}}setOpen(false);onOpen();load()};
  const toggleSound=()=>{const next=sound==='on'?'off':'on';setSound(next);try{localStorage.setItem('adminSound',next)}catch{}if(next==='on'){beep();setTimeout(()=>speak('Order alerts are on'),450)}else{try{speechSynthesis.cancel()}catch{}}};
  const markAll=async()=>{try{await api.patch('/notifications/read-all')}catch{await Promise.all(items.filter(n=>!n.readAt).map(n=>api.patch('/notifications/'+n._id+'/read').catch(()=>{})))}load()};
  const clearAll=async()=>{try{localStorage.setItem('adminNotifCleared',String(Date.now()))}catch{}try{await api.delete('/notifications')}catch{await markAll()}seen.current=new Set();setItems([]);setUnread(0);load()};
  return <div className="notif" ref={box}><button className={'notif-sound'+(sound==='on'?' on':sound===null?' ask':'')} onClick={toggleSound} title={sound==='on'?'Sound alerts on - click to mute':'Turn on sound alerts for new orders'} aria-label="Toggle order sound alerts">{sound==='on'?<Volume2 size={18}/>:<VolumeX size={18}/>}{sound!=='on'&&<span>Enable sound alerts</span>}</button><button className="notif-btn" onClick={()=>setOpen(!open)} aria-label={`Notifications, ${unread} unread`}><Bell size={19}/>{unread>0&&<b className="notif-badge">{unread>99?'99+':unread}</b>}</button>{open&&<div className="notif-panel"><div className="notif-head"><b>Notifications</b><div className="notif-actions">{unread>0&&<button onClick={markAll}><Check size={14}/> Mark all read</button>}{items.length>0&&<button onClick={clearAll} className="danger"><Trash2 size={14}/> Clear all</button>}</div></div>{items.length?<ul>{items.map(n=><li key={n._id} className={n.readAt?'':'unread'}><button onClick={()=>markRead(n)}><span className="notif-ico"><ShoppingBag size={16}/></span><span><b>{n.title}</b><small>{n.body}</small><em>{new Date(n.createdAt).toLocaleString()}</em></span></button></li>)}</ul>:<p className="notif-empty">No notifications yet.</p>}</div>}</div>
}
