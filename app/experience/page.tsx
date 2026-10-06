import type {Metadata} from 'next';
import PageHeading from '@/components/PageHeading';
import {experiences} from '@/content/site';
export const metadata:Metadata={title:'Experience'};
export default function Experience(){return <section className="page"><PageHeading title="Experience"/><div className="experience-list">{experiences.map(e=><article key={e.company}><h2>{e.company}</h2><div><p>{e.role}</p>{e.context&&<span>{e.context}</span>}</div></article>)}</div></section>}
