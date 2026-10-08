import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';
import { projects } from '@/content/site';

// Project pages used to live at /activities/<id>/; keep those links working.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export const dynamicParams = false;
export const generateStaticParams = () => [...projects.map((p) => ({ id: p.id })), { id: 'credit-card-advisor' }];

export default async function Moved({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Redirect to={`/projects/${id === 'credit-card-advisor' ? 'strata' : id}/`} />;
}
