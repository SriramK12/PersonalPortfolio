import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'Sriram Kakumanu — Product, Technology & People',description:'UT Austin student exploring the intersection of product, technology, and human behavior. Selected projects, experience, and a personal archive.',robots:{index:false,follow:false} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>}
