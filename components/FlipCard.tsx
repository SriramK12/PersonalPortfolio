'use client';
// A flashcard: the front shows a name; clicking flips it to reveal the details on the back.
// The hidden face is inert, so keyboard and screen-reader users only meet the visible side.
import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';

export default function FlipCard({ label, front, back }: { label: string; front: ReactNode; back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const backButton = useRef<HTMLButtonElement>(null);
  const frontButton = useRef<HTMLButtonElement>(null);

  const flip = (to: boolean) => {
    setFlipped(to);
    // Move focus to the side that just turned to face the viewer.
    requestAnimationFrame(() => (to ? backButton : frontButton).current?.focus());
  };

  return (
    <motion.div className={`flip${flipped ? ' is-flipped' : ''}`} whileHover={flipped ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <motion.div
        className="flip-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 16 }}
      >
        <button ref={frontButton} type="button" className="flip-face flip-front" onClick={() => flip(true)} aria-label={`${label}: show details`} inert={flipped}>
          {front}
          <span className="flip-hint" aria-hidden="true">Tap to flip ↻</span>
        </button>
        <div className="flip-face flip-back" inert={!flipped}>
          <button ref={backButton} type="button" className="flip-close" onClick={() => flip(false)} aria-label={`${label}: back to front`}>↺</button>
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
}
