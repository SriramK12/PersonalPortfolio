import type {Metadata} from 'next';
import PageHeading from '@/components/PageHeading';
import {profile} from '@/content/site';
export const metadata:Metadata={title:'About'};
export default function About(){return <section className="page"><PageHeading title="About"/><div className="about-content"><p className="about-intro">I study business and psychology, with a focus on product and technology.</p><dl className="fact-list"><div><dt>University</dt><dd>{profile.school}</dd></div><div><dt>Class</dt><dd>{profile.classYear}</dd></div><div><dt>Degrees</dt><dd>BBA, Management Information Systems<br/>BA, Psychology</dd></div><div><dt>Minors</dt><dd>Computer Science<br/>Statistics & Data Science</dd></div></dl></div></section>}
