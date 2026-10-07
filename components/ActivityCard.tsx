'use client';
// A Strava-style feed card. Hovering or focusing it switches the map to this activity's route.
import Link from 'next/link';
import { motion } from 'motion/react';
import { useRef } from 'react';
import type { Activity } from '@/content/site';
import { profile } from '@/content/site';
import type { LngLat } from '@/lib/geo';
import { useStage } from './map/MapStage';
import Avatar from './Avatar';
import Kudos from './Kudos';
import RouteThumb from './RouteThumb';
import { ActivityIcon, ArrowIcon } from './Icons';

export default function ActivityCard({ activity, thumb, compact = false }: { activity: Activity; thumb: LngLat[]; compact?: boolean }) {
  const { active, setActive } = useStage();
  const hover = useRef(0);
  const isActive = active === activity.id;
  const href = `/activities/${activity.id}/`;
  // A short delay keeps the camera from lurching while the pointer passes over cards.
  const enter = () => { clearTimeout(hover.current); hover.current = window.setTimeout(() => setActive(activity.id), 180); };
  const leave = () => clearTimeout(hover.current);

  return (
    <motion.article
      className={`activity-card${isActive ? ' is-active' : ''}${compact ? ' is-compact' : ''}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={() => setActive(activity.id)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <header className="activity-head">
        <Avatar size={36} ring={false} />
        <div>
          <p className="activity-athlete">{profile.name}</p>
          <p className="activity-meta">
            <ActivityIcon width={14} height={14} /> {activity.type}
            {activity.date && <> · {activity.date}</>}
          </p>
        </div>
      </header>
      <h2 className="activity-title">
        <Link href={href}>{activity.name}</Link>
      </h2>
      <p className="activity-summary">{compact ? activity.summary : activity.description}</p>
      <dl className="stat-row">
        {activity.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      {!compact && (
        <Link href={href} className="activity-map" tabIndex={-1} aria-hidden="true">
          <RouteThumb coords={thumb} active={isActive} />
        </Link>
      )}
      <footer className="activity-foot">
        <Kudos id={activity.id} />
        <Link href={href} className="text-link">
          View activity <ArrowIcon width={16} height={16} />
        </Link>
      </footer>
    </motion.article>
  );
}
