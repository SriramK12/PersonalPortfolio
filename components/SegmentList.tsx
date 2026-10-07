'use client';
// Segment leaderboard. Hover previews a segment on the map; click pins it and expands details.
import { AnimatePresence, motion } from 'motion/react';
import { useRef } from 'react';
import type { Segment } from '@/content/site';
import { placeById } from '@/content/site';
import { toMiles } from '@/lib/geo';
import { useStage } from './map/MapStage';
import { PinIcon, SegmentIcon } from './Icons';

export default function SegmentList({ segments }: { segments: Segment[] }) {
  const { active, setActive, routes } = useStage();
  const hover = useRef(0);
  const preview = (id: string) => { clearTimeout(hover.current); hover.current = window.setTimeout(() => setActive(id), 260); };

  return (
    <ol className="segment-list">
      {segments.map((s, i) => {
        const open = active === s.id;
        return (
          <motion.li
            key={s.id}
            className={`segment${open ? ' is-active' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.25 + i * 0.06 }}
            onMouseEnter={() => preview(s.id)}
            onMouseLeave={() => clearTimeout(hover.current)}
          >
            <button type="button" className="segment-row" aria-expanded={open} onClick={() => setActive(open ? null : s.id)}>
              <span className="segment-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="segment-main">
                <span className="segment-company">{s.company}</span>
                <span className="segment-role">{s.role}</span>
              </span>
              <span className="segment-place"><PinIcon width={13} height={13} /> {placeById(s.place).name}</span>
              {open && <motion.span className="segment-marker" layoutId="segment-marker" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div className="segment-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                  <dl className="stat-row">
                    {s.context && <div><dt>Team</dt><dd>{s.context}</dd></div>}
                    {s.dates && <div><dt>Dates</dt><dd>{s.dates}</dd></div>}
                    <div><dt>Route</dt><dd>{toMiles(routes[s.id].length).toFixed(2)} mi</dd></div>
                  </dl>
                  {s.highlights.length > 0 && (
                    <ul className="highlights">
                      {s.highlights.map((h) => <li key={h}><SegmentIcon width={14} height={14} /> {h}</li>)}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}
