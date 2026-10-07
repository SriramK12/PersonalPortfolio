'use client';
// Saved routes (real Strava activities and items) with a filter. Selecting a card traces it on the map.
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { Interest } from '@/content/site';
import type { LngLat } from '@/lib/geo';
import { useStage } from './map/MapStage';
import RouteThumb from './RouteThumb';

export default function RouteFilter({ items, thumbs }: { items: Interest[]; thumbs: Record<string, LngLat[]> }) {
  const { active, setActive, routes } = useStage();
  const groups = ['All', ...new Set(items.map((i) => i.group))];
  const [group, setGroup] = useState('All');
  const shown = items.filter((i) => group === 'All' || i.group === group);

  const choose = (g: string) => {
    setGroup(g);
    const first = items.find((i) => g === 'All' || i.group === g);
    if (first) setActive(first.id);
  };

  return (
    <>
      <div className="chips" role="group" aria-label="Filter routes">
        {groups.map((g) => (
          <button key={g} type="button" aria-pressed={group === g} onClick={() => choose(g)}>
            {group === g && <motion.span className="chip-pill" layoutId="chip-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <span>{g}</span>
          </button>
        ))}
      </div>
      <motion.ul className="route-grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((i) => (
            <motion.li key={i.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <button type="button" className={`route-card${active === i.id ? ' is-active' : ''}`} onClick={() => setActive(i.id)} aria-pressed={active === i.id}>
                <RouteThumb coords={thumbs[i.id]} dashed={routes[i.id]?.dashed} active={active === i.id} />
                <span className="route-card-label">{i.label}</span>
                <span className="route-card-note">{i.note}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
