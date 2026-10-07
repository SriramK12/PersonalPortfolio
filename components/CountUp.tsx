'use client';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

/** A number that counts up from zero the first time it scrolls into view. */
export default function CountUp({ to, decimals = 0, delay = 0.3 }: { to: number; decimals?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) return void (node.textContent = to.toFixed(decimals));
    const controls = animate(0, to, { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (node.textContent = v.toFixed(decimals)) });
    return () => controls.stop();
  }, [inView, to, decimals, delay, reduce]);

  return <span ref={ref} className="count">{(0).toFixed(decimals)}</span>;
}
