import type {Metadata} from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';
export const metadata:Metadata={title:{default:'Sriram Kakumanu',template:'%s — Sriram Kakumanu'},description:'Product, technology, and human behavior. Sriram Kakumanu, UT Austin, Class of 2028.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><div className="site-shell"><Navigation/><main id="main" tabIndex={-1}>{children}</main><footer><span>Sriram Kakumanu</span><span>© {new Date().getFullYear()}</span></footer></div></body></html>}
