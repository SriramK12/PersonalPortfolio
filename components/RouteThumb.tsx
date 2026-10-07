'use client';
// A Strava-feed style route preview: the line draws itself when it scrolls into view.
import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { LngLat } from '@/lib/geo';

export default function RouteThumb({ coords, dashed = false, active = false }: { coords: LngLat[]; dashed?: boolean; active?: boolean }) {
  const d = useMemo(() => {
    // Equirectangular projection corrected for latitude, fitted into a 100x60 box.
    const k = Math.cos((coords[0][1] * Math.PI) / 180);
    const pts = coords.map(([x, y]) => [x * k, -y]);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const s = Math.min(88 / (maxX - minX || 1), 48 / (maxY - minY || 1));
    const ox = (100 - (maxX - minX) * s) / 2;
    const oy = (60 - (maxY - minY) * s) / 2;
    return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(ox + (x - minX) * s).toFixed(1)} ${(oy + (y - minY) * s).toFixed(1)}`).join('');
  }, [coords]);

  return (
    <svg className={`route-thumb${active ? ' is-active' : ''}`} viewBox="0 0 100 60" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="thumb-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="var(--grid)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100" height="60" fill="url(#thumb-grid)" />
      <path d={d} className="route-thumb-case" />
      {dashed ? (
        <motion.path d={d} className="route-thumb-line" strokeDasharray="1.6 1.8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
      ) : (
        <motion.path d={d} className="route-thumb-line" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }} />
      )}
    </svg>
  );
}
