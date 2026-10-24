'use client';
// Cycles through titles with a sideways swap: the current one slides out left as the next slides in
// from the right. With reduced motion it shows the first title only.
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const HOLD_MS = 2600;

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
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[i]}
          aria-hidden="true"
          initial={{ x: 60, opacity: 0, filter: 'blur(6px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ x: -60, opacity: 0, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
