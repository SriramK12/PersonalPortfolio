'use client';
// Floating stat strip over the map: the active route's name and distance, counting up as it draws.
import { AnimatePresence, motion, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { toMiles, walkTime } from '@/lib/geo';
import { useStage } from './MapStage';

export type RouteStats = { distance: number; movingTime: number };

const duration = (s: number) => {
  const m = Math.round(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`;
};

/** `stats` holds real recorded totals (Strava); other routes show a walking estimate. */
export default function RouteHud({ labels, stats = {} }: { labels: Record<string, string>; stats?: Record<string, RouteStats> }) {
  const { active, routes, progress } = useStage();
  const [p, setP] = useState(0);
  useMotionValueEvent(progress, 'change', setP);
  const route = active ? routes[active] : null;
  const label = active ? labels[active] : null;
  const real = active ? stats[active] : undefined;

  return (
    <AnimatePresence mode="wait">
      {route && label && (
        <motion.div
          key={active}
          className="route-hud"
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          aria-hidden="true"
        >
          <span className={`hud-live${p < 1 ? ' is-recording' : ''}`}>{p < 1 ? 'Drawing' : 'Route'}</span>
          <span className="hud-name">{label}</span>
          {!route.dashed && (
            <>
              <span className="hud-stat"><b>{toMiles((real?.distance ?? route.length) * p).toFixed(2)}</b> mi</span>
              {real ? (
                <span className="hud-stat"><b>{duration(real.movingTime * p)}</b> moving</span>
              ) : (
                <span className="hud-stat"><b>{walkTime(route.length * p)}</b> est.</span>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
