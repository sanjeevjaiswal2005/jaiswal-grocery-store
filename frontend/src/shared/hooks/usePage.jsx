import React,{useEffect,useState} from 'react';
import {Pager} from '../components/Pager.jsx';

export function usePage(list,size=10,resetKey=''){const[page,setPage]=useState(1),pages=Math.max(1,Math.ceil(list.length/size)),current=Math.min(page,pages);useEffect(()=>{setPage(1)},[resetKey]);return[list.slice((current-1)*size,current*size),<Pager page={current} pages={pages} onPage={p=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})}}/>]}
