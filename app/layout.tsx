import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import { SITE_URL } from '@/content/site';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });

export const metadata: Metadata = {
  title: { default: 'Sriram Kakumanu', template: '%s · Sriram Kakumanu' },
  description: 'Product, technology, and human behavior. Sriram Kakumanu, UT Austin, Class of 2028.',
  metadataBase: new URL(SITE_URL),
  openGraph: { type: 'website', siteName: 'Sriram Kakumanu' },
};

export const viewport: Viewport = {
  themeColor: '#17171b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navigation />
        <main id="main" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
