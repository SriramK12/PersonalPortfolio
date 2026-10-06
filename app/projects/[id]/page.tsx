import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import PageHeading from '@/components/PageHeading';
import Arrow from '@/components/Arrow';
import {projects} from '@/content/site';
export function generateStaticParams(){return projects.map(p=>({id:p.id}))}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{const {id}=await params;return {title:projects.find(p=>p.id===id)?.name||'Project'}}
export default async function Project({params}:{params:Promise<{id:string}>}){const {id}=await params;const project=projects.find(p=>p.id===id);if(!project)notFound();return <section className="page project-detail"><Link href="/work/" className="back-link">← Work</Link><PageHeading title={project.name} subtitle={project.label}/><p className="project-description">{project.description}</p><dl className="fact-list">{project.details.map(detail=><div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>{project.href&&<a className="button-link" href={project.href} target="_blank" rel="noopener noreferrer">Visit product <Arrow/></a>}</section>}
