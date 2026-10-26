import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

// Project pages used to live at /activities/<id>/; keep those links working.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export const dynamicParams = false;
// Only the projects that existed when project pages lived under /activities/.
export const generateStaticParams = () => ['studysense', 'plateconnect', 'credit-card-advisor'].map((id) => ({ id }));

export default async function Moved({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Redirect to={`/projects/${id === 'credit-card-advisor' ? 'strata' : id}/`} />;
}
