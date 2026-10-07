'use client';
// Activities by category: real Strava runs and hikes, plus photos. Selecting a card traces it on the map.
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { LngLat } from '@/lib/geo';
import { useStage } from './map/MapStage';
import RouteThumb from './RouteThumb';

export type ActivityItem = { id: string; label: string; group: string; note: string };

export const GROUPS = ['Runs', 'Hikes', 'Photos'] as const;

export default function RouteFilter({ items, thumbs }: { items: ActivityItem[]; thumbs: Record<string, LngLat[]> }) {
  const { active, setActive } = useStage();
  const [group, setGroup] = useState<string>(GROUPS[0]);
  const shown = items.filter((i) => i.group === group);

  const choose = (g: string) => {
    setGroup(g);
    const first = items.find((i) => i.group === g);
    if (first) setActive(first.id);
  };

  return (
    <>
      <div className="chips" role="group" aria-label="Filter activities">
        {GROUPS.map((g) => (
          <button key={g} type="button" aria-pressed={group === g} onClick={() => choose(g)}>
            {group === g && <motion.span className="chip-pill" layoutId="chip-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <span>{g}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="empty-note">{group === 'Photos' ? 'Photos coming soon.' : `No ${group.toLowerCase()} yet.`}</p>
      )}
      <motion.ul className="route-grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((i) => (
            <motion.li key={i.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <button type="button" className={`route-card${active === i.id ? ' is-active' : ''}`} onClick={() => setActive(i.id)} aria-pressed={active === i.id}>
                <RouteThumb coords={thumbs[i.id]} active={active === i.id} />
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
