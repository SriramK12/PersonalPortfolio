import type {Metadata} from 'next';
import PageHeading from '@/components/PageHeading';
import ExploreFilter from '@/components/ExploreFilter';
export const metadata:Metadata={title:'Explore'};
export default function Explore(){return <section className="page"><PageHeading title="Explore"/><ExploreFilter/></section>}
