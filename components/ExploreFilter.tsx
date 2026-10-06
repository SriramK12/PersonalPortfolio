'use client';
import {useState} from 'react';
const interests=[{label:'Outdoors',items:['Travel','Hiking']},{label:'Everyday',items:['Photography','Food']},{label:'Sport',items:['Tennis']}];
export default function ExploreFilter(){const [active,setActive]=useState(0);return <div className="explore-content"><div className="filter" aria-label="Interests">{interests.map((entry,i)=><button key={entry.label} aria-pressed={active===i} onClick={()=>setActive(i)}>{entry.label}</button>)}</div><div className="interest-list" aria-live="polite">{interests[active].items.map(item=><p key={item}>{item}</p>)}</div><span className="muted small">Photo archive coming soon.</span></div>}
