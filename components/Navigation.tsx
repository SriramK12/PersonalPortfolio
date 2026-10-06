'use client';
import { useState } from 'react';
import Arrow from './Arrow';
const links = [['Work','#work'],['Experience','#experience'],['Explore','#explore'],['Contact','#contact']];
export default function Navigation(){
 const [open,setOpen]=useState(false);
 return <header className="site-header"><a className="wordmark" href="#home" aria-label="Sriram Kakumanu home">SK<span className="wordmark-dot">.</span></a><button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?'Close −':'Menu +'}</button><nav id="main-nav" className={open?'navigation open':'navigation'} aria-label="Main navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}<span aria-hidden="true"><Arrow/></span></a>)}</nav><span className="header-note">A WORK IN PROGRESS, ALWAYS.</span></header>
}
