'use client';
// Full-width section page. Children wrapped in <Item> enter in sequence.
import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const sheet: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 240, damping: 26 } },
};

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.section className={`page ${className}`} variants={sheet} initial="hidden" animate="shown">
      {children}
      <motion.footer className="page-footer" variants={item}>
        <span>© {new Date().getFullYear()} Sriram Kakumanu</span>
      </motion.footer>
    </motion.section>
  );
}

export function Item({ children, className, id, as = 'div' }: { children: ReactNode; className?: string; id?: string; as?: 'div' | 'header' | 'ul' | 'li' | 'dl' }) {
  const Tag = motion[as];
  return <Tag className={className} id={id} variants={item}>{children}</Tag>;
}

export function PageHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <Item as="header" className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children}
    </Item>
  );
}
