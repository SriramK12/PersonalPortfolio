import Link from 'next/link';
import Arrow from '@/components/Arrow';
export default function Home(){return <section className="landing"><div className="landing-copy"><p className="overline">UT AUSTIN / 2028</p><h1>Sriram<br/>Kakumanu<span>.</span></h1><p className="positioning">Product. Technology. Human behavior.</p><div className="landing-links"><Link className="button-link" href="/work/">View work <Arrow/></Link><Link className="quiet-link" href="/about/">About me <Arrow/></Link></div></div></section>}
