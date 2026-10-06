'use client';
import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { deskObjects, type DeskObject } from '@/content/desk';
import Arrow from './Arrow';
type Offset = { x: number; y: number };
export default function InteractiveDesk(){
 const [mode,setMode]=useState<'work'|'life'>('work');
 const [selected,setSelected]=useState<DeskObject|null>(null);
 const [offsets,setOffsets]=useState<Record<string,Offset>>({});
 const board=useRef<HTMLDivElement>(null);
 const drag=useRef<{id:string;startX:number;startY:number;initial:Offset;target:HTMLElement;pointer:number;maxX:number;maxY:number;minX:number;minY:number}|null>(null);
 const [moved,setMoved]=useState(false);
 function start(e:PointerEvent<HTMLButtonElement>,item:DeskObject){
  if(e.button!==0||!board.current)return;
  const target=e.currentTarget.closest('.desk-object') as HTMLElement;
  const r=target.getBoundingClientRect(),b=board.current.getBoundingClientRect(),initial=offsets[item.id]||{x:0,y:0};
  drag.current={id:item.id,startX:e.clientX,startY:e.clientY,initial,target,pointer:e.pointerId,minX:initial.x+b.left-r.left+8,maxX:initial.x+b.right-r.right-8,minY:initial.y+b.top-r.top+8,maxY:initial.y+b.bottom-r.bottom-8};
  e.currentTarget.setPointerCapture(e.pointerId);target.classList.add('is-dragging');setMoved(true);
 }
 function move(e:PointerEvent<HTMLButtonElement>){const d=drag.current;if(!d||e.pointerId!==d.pointer)return;
  const x=Math.max(d.minX,Math.min(d.maxX,d.initial.x+e.clientX-d.startX)),y=Math.max(d.minY,Math.min(d.maxY,d.initial.y+e.clientY-d.startY));
  d.target.style.setProperty('--dx',`${x}px`);d.target.style.setProperty('--dy',`${y}px`);
 }
 function end(){const d=drag.current;if(!d)return;const x=parseFloat(d.target.style.getPropertyValue('--dx'))||0,y=parseFloat(d.target.style.getPropertyValue('--dy'))||0;setOffsets(o=>({...o,[d.id]:{x,y}}));d.target.classList.remove('is-dragging');drag.current=null;}
 function keyMove(e:KeyboardEvent<HTMLButtonElement>,id:string){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();setOffsets(o=>{const p=o[id]||{x:0,y:0};return {...o,[id]:{x:Math.max(-30,Math.min(30,p.x+(e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0))),y:Math.max(-30,Math.min(30,p.y+(e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0)))}}});setMoved(true);}
 return <div className="desk-shell"><div className="desk-toolbar"><div className="desk-modes" aria-label="Desk collection">{(['work','life'] as const).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>{setMode(m);setSelected(null);setOffsets({});setMoved(false);}}>{m==='work'?'Work':'Personal'}<span>{m==='work'?'01':'02'}</span></button>)}</div><button className="desk-reset" onClick={()=>{setOffsets({});setMoved(false);}} disabled={!moved}>Reset layout</button></div>
 <div className={`desk-board ${mode}`} ref={board}><div className="desk-grid" aria-hidden="true"/><div className="desk-path" aria-hidden="true"><svg viewBox="0 0 600 550"><path d="M80 180C120 30 430 60 480 240S160 530 120 390S500 370 510 480"/></svg></div>
 {deskObjects[mode].map(item=>{const o=offsets[item.id]||{x:0,y:0};return <div className={`desk-object object-${item.kind}`} key={item.id} style={{left:`${item.x}%`,top:`${item.y}%`,'--rotation':`${item.rotation}deg`,'--dx':`${o.x}px`,'--dy':`${o.y}px`} as React.CSSProperties}><button className="object-open" aria-label={`Open ${item.label}`} aria-expanded={selected?.id===item.id} aria-controls="desk-detail" onClick={()=>setSelected(selected?.id===item.id?null:item)}><span className="object-meta">{item.subtitle}</span><span className="object-art" aria-hidden="true">{item.kind==='tennis'?<svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="65" fill="#aab17d"/><path d="M29 29c65 0 65 92 0 92M121 29c-65 0-65 92 0 92" stroke="#eeeadb" strokeWidth="5" fill="none"/></svg>:item.kind==='print'?<svg viewBox="0 0 200 120"><path d="M0 105 65 35 120 95 155 60 200 105" fill="#536e61"/><circle cx="145" cy="27" r="15" fill="#c9b798"/></svg>:item.kind==='journal'?<svg viewBox="0 0 160 80"><path d="M10 60Q40 10 80 40T150 20M0 75Q60 35 100 60T160 35M0 40Q35 0 70 20T160 0" fill="none" stroke="currentColor" strokeWidth="1"/></svg>:null}</span><span className="object-title">{item.text.split('\n').map((line,i)=><span key={i}>{line}</span>)}</span><span className="object-footer">{item.label}<Arrow/></span></button><button className="object-drag" aria-label={`Move ${item.label}; use arrow keys or drag`} onPointerDown={e=>start(e,item)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={e=>keyMove(e,item.id)}><span aria-hidden="true">⠿</span><span>MOVE</span></button></div>})}
 </div>
 <div id="desk-detail" className={selected?'desk-detail is-open':'desk-detail'} aria-live="polite">{selected?<><div><span className="eyebrow">{selected.subtitle}</span><h2>{selected.label}</h2><p>{selected.detail}</p>{selected.href&&<a className="text-link" href={selected.href} {...(selected.href.startsWith('https')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{selected.linkLabel}<Arrow/></a>}</div><button className="desk-close" aria-label="Close object note" onClick={()=>setSelected(null)}>×</button></>:null}</div>
 </div>
}
