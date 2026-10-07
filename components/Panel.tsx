'use client';
// The content sheet that floats over the map: a left column on desktop, a bottom sheet on mobile.
// Children wrapped in <Item> enter in sequence once the stage is revealed.
import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { useStage } from './map/MapStage';

const sheet: Variants = {
  hidden: { opacity: 0, x: -36, y: 0 },
  shown: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 170, damping: 24, staggerChildren: 0.06, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 240, damping: 26 } },
};

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { revealed } = useStage();
  return (
    <motion.section className={`panel ${className}`} variants={sheet} initial="hidden" animate={revealed ? 'shown' : 'hidden'}>
      <div className="panel-grip" aria-hidden="true" />
      {children}
      <motion.footer className="panel-footer" variants={item}>
        <span>© {new Date().getFullYear()} Sriram Kakumanu</span>
        <span>Map © OpenStreetMap contributors</span>
      </motion.footer>
    </motion.section>
  );
}

export function Item({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'header' | 'ul' | 'li' | 'dl' }) {
  const Tag = motion[as];
  return <Tag className={className} variants={item}>{children}</Tag>;
}

export function PanelHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <Item as="header" className="panel-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children}
    </Item>
  );
}
