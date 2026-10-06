'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [['Work','/work/'],['Experience','/experience/'],['Explore','/explore/'],['About','/about/'],['Contact','/contact/']];
export default function Navigation(){
 const pathname=usePathname();
 return <header className="site-header"><Link className="wordmark" href="/" aria-label="Home" aria-current={pathname==='/'?'page':undefined}>sk<span>.</span></Link><nav aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} aria-current={pathname.replace(/\/$/,'')===href.replace(/\/$/,'')||(href==='/work/'&&pathname.startsWith('/projects/'))?'page':undefined}>{label}</Link>)}</nav></header>
}
