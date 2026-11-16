import React,{useCallback,useEffect,useMemo,useState} from 'react';
import {Pager} from '../components/Pager.jsx';

export function usePage(list,size=10,resetKey=''){const[page,setPage]=useState(1),pages=Math.max(1,Math.ceil(list.length/size)),current=Math.min(page,pages);useEffect(()=>{setPage(1)},[resetKey]);const onPage=useCallback(p=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})},[]),slice=useMemo(()=>list.slice((current-1)*size,current*size),[list,current,size]);return[slice,<Pager page={current} pages={pages} onPage={onPage}/>]}
