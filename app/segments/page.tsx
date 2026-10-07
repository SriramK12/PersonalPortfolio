import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

// Redirect-only URL: keep it out of search results.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Moved() {
  return <Redirect to="/experience/" />;
}
