'use client';
// A kudos toggle with a little burst. It is per-visitor only and never shows a fabricated count.
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { KudosIcon } from './Icons';

export default function Kudos({ id }: { id: string }) {
  const key = `sk-kudos-${id}`;
  const [given, setGiven] = useState(false);
  useEffect(() => {
    try { setGiven(localStorage.getItem(key) === '1'); } catch {}
  }, [key]);

  const toggle = () => {
    const next = !given;
    setGiven(next);
    try { localStorage.setItem(key, next ? '1' : '0'); } catch {}
  };

  return (
    <motion.button type="button" className={`kudos${given ? ' is-given' : ''}`} onClick={toggle} aria-pressed={given} whileTap={{ scale: 0.88 }}>
      <motion.span className="kudos-icon" animate={given ? { rotate: [0, -18, 8, 0], scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.45 }}>
        <KudosIcon width={18} height={18} />
        <AnimatePresence>
          {given &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <motion.i
                key={i}
                className="kudos-spark"
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: Math.cos((i / 6) * Math.PI * 2) * 20, y: Math.sin((i / 6) * Math.PI * 2) * 20, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            ))}
        </AnimatePresence>
      </motion.span>
      {given ? 'Kudos given' : 'Give kudos'}
    </motion.button>
  );
}
