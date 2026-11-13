import React from 'react';
import {ArrowDown} from 'lucide-react';
import {api} from '../../../shared/services/api.js';

export function ReportsManager({notify}){const download=async()=>{try{const blob=await api.get('/admin/reports/sales.csv',{responseType:'blob'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='jaiswal-sales.csv';a.click();URL.revokeObjectURL(url)}catch(e){notify(e.message)}};return <section className="admin-card"><div className="admin-card-head"><div><span className="kicker">STORE PERFORMANCE</span><h2>Sales and order report</h2></div></div><p className="admin-empty">Export a CSV of customer orders and payment status for your records.</p><button className="btn btn-green" onClick={download}>Download sales CSV <ArrowDown size={15}/></button></section>}
