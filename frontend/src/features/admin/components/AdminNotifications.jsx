import React,{useEffect,useRef,useState} from 'react';
import {Bell,ShoppingBag,Check} from 'lucide-react';
import {api} from '../../../shared/services/api.js';

const POLL_MS=15000;
const beep=()=>{try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.setValueAtTime(.12,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.4);o.start();o.stop(c.currentTime+.4)}catch{}};

export function AdminNotifications({notify,onOpen}){
  const[open,setOpen]=useState(false),[items,setItems]=useState([]),[unread,setUnread]=useState(0),seen=useRef(null),box=useRef(null);
  const load=async()=>{try{const r=await api.get('/notifications');const fresh=r.data.items.filter(n=>!n.readAt);if(seen.current){const added=fresh.filter(n=>!seen.current.has(n._id));if(added.length){beep();notify(added[0].title+': '+added[0].body)}}seen.current=new Set(fresh.map(n=>n._id));setItems(r.data.items);setUnread(r.data.unread)}catch{}};
  useEffect(()=>{load();const t=setInterval(load,POLL_MS);return()=>clearInterval(t)},[]);
  useEffect(()=>{document.title=(unread?`(${unread}) `:'')+'Jaiswal Grocery'},[unread]);
  useEffect(()=>{const h=e=>{if(box.current&&!box.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
  const markRead=async n=>{if(!n.readAt){try{await api.patch('/notifications/'+n._id+'/read')}catch{}}setOpen(false);onOpen();load()};
  const markAll=async()=>{try{await api.patch('/notifications/read-all')}catch{}load()};
  return <div className="notif" ref={box}><button className="notif-btn" onClick={()=>setOpen(!open)} aria-label={`Notifications, ${unread} unread`}><Bell size={19}/>{unread>0&&<b className="notif-badge">{unread>99?'99+':unread}</b>}</button>{open&&<div className="notif-panel"><div className="notif-head"><b>Notifications</b>{unread>0&&<button onClick={markAll}><Check size={14}/> Mark all read</button>}</div>{items.length?<ul>{items.map(n=><li key={n._id} className={n.readAt?'':'unread'}><button onClick={()=>markRead(n)}><span className="notif-ico"><ShoppingBag size={16}/></span><span><b>{n.title}</b><small>{n.body}</small><em>{new Date(n.createdAt).toLocaleString()}</em></span></button></li>)}</ul>:<p className="notif-empty">No notifications yet.</p>}</div>}</div>
}
