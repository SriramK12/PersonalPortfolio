'use client';
// Cycles through titles with a sideways swap: the current one glides out left while the next glides in
// from the right, both easing over the same stretch so they cross-fade. With reduced motion it shows
// the first title only.
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const HOLD_MS = 3200;
// A slow, symmetric ease-in-out: no spring overshoot, no blur (blurring text can stutter).
const SWAP = { duration: 0.9, ease: [0.65, 0, 0.35, 1] } as const;

export default function RoleSwap({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || roles.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, roles.length]);

  return (
    <p className="intro-sub role-swap" aria-label={roles.join(', ')}>
      {/* Default (sync) mode: the outgoing and incoming titles animate at the same time, stacked in one grid cell. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={roles[i]}
          aria-hidden="true"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={SWAP}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
