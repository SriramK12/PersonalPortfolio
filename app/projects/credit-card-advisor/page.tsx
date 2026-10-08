import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

// Strata used to be listed as Credit Card Advisor; keep that link working.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Moved() {
  return <Redirect to="/projects/strata/" />;
}
