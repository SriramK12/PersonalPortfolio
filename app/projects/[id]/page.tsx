import Redirect from '@/components/Redirect';
import { activities } from '@/content/site';

export const dynamicParams = false;
export const generateStaticParams = () => activities.map((a) => ({ id: a.id }));

export default async function Moved({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Redirect to={`/activities/${id}/`} />;
}
