import React from 'react';

export function Stat({icon,label,value,alert}){return <div className={'stat-card'+(alert?' stat-alert':'')}><span>{icon}</span><small>{label}</small><b>{value}</b></div>}
