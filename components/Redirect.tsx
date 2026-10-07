'use client';
// Static hosting has no server redirects, so old URLs render this: a meta refresh for
// no-JS visitors plus an immediate client-side replace.
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => router.replace(to), [router, to]);
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${process.env.NEXT_PUBLIC_BASE_PATH}${to}`} />
      <p className="redirect-note">This page moved. <a href={`${process.env.NEXT_PUBLIC_BASE_PATH}${to}`}>Continue</a></p>
    </>
  );
}
