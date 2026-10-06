import type {Metadata} from 'next';
import PageHeading from '@/components/PageHeading';
import Arrow from '@/components/Arrow';
import {profile} from '@/content/site';
export const metadata:Metadata={title:'Contact'};
export default function Contact(){return <section className="page"><PageHeading title="Contact"/><a className="contact-row" href={profile.github} target="_blank" rel="noopener noreferrer"><div><h2>GitHub</h2><p>@SriramK12</p></div><Arrow/></a></section>}
