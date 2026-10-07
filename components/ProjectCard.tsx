'use client';
// A project card. Hovering or focusing it switches the map to this project's route.
import Link from 'next/link';
import { motion } from 'motion/react';
import { useRef } from 'react';
import type { Project } from '@/content/site';
import type { LngLat } from '@/lib/geo';
import { useStage } from './map/MapStage';
import Kudos from './Kudos';
import RouteThumb from './RouteThumb';
import { ArrowIcon, ProjectIcon } from './Icons';

export default function ProjectCard({ project, thumb }: { project: Project; thumb: LngLat[] }) {
  const { active, setActive } = useStage();
  const hover = useRef(0);
  const isActive = active === project.id;
  const href = `/projects/${project.id}/`;
  // A short delay keeps the camera from lurching while the pointer passes over cards.
  const enter = () => { clearTimeout(hover.current); hover.current = window.setTimeout(() => setActive(project.id), 180); };
  const leave = () => clearTimeout(hover.current);

  return (
    <motion.article
      className={`activity-card${isActive ? ' is-active' : ''}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={() => setActive(project.id)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <p className="activity-meta">
        <ProjectIcon width={14} height={14} /> {project.type}
        {project.date && <> · {project.date}</>}
      </p>
      <h2 className="activity-title">
        <Link href={href}>{project.name}</Link>
      </h2>
      <p className="activity-summary">{project.description}</p>
      <dl className="stat-row">
        {project.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      <Link href={href} className="activity-map" tabIndex={-1} aria-hidden="true">
        <RouteThumb coords={thumb} active={isActive} />
      </Link>
      <footer className="activity-foot">
        <Kudos id={project.id} />
        <Link href={href} className="text-link">
          View project <ArrowIcon width={16} height={16} />
        </Link>
      </footer>
    </motion.article>
  );
}
