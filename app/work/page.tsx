import type {Metadata} from 'next';
import Link from 'next/link';
import PageHeading from '@/components/PageHeading';
import Arrow from '@/components/Arrow';
import {projects} from '@/content/site';
export const metadata:Metadata={title:'Work'};
export default function Work(){return <section className="page"><PageHeading title="Work"/><div className="project-index">{projects.map((p,i)=><Link href={`/projects/${p.id}/`} className="project-row" key={p.id}><span className="row-number">0{i+1}</span><div><h2>{p.name}</h2><p>{p.summary}</p></div><span className="project-type">{p.label}</span><Arrow/></Link>)}</div></section>}
