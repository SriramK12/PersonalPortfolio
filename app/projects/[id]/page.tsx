import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Kudos from '@/components/Kudos';
import { BackIcon, ExternalIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import { projects } from '@/content/site';
import { toMiles, walkTime } from '@/lib/geo';
import { route } from '@/lib/routes';

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((a) => ({ id: a.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: projects.find((a) => a.id === id)?.name ?? 'Project' };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((a) => a.id === id);
  if (!project) notFound();
  const r = route(project.id, 600);

  return (
    <MapStage routes={[r]} initial={r.id} labels={{ [r.id]: project.name }}>
      <Panel className="project-detail">
        <Item>
          <Link href="/projects/" className="back-link"><BackIcon width={16} height={16} /> Projects</Link>
        </Item>
        <PanelHeading eyebrow={[project.type, project.date].filter(Boolean).join(' · ')} title={project.name}>
          <p className="lede">{project.description}</p>
        </PanelHeading>
        <Item as="dl" className="big-stats">
          {project.stats.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </Item>
        <Item className="splits">
          <h2>Splits</h2>
          <dl>
            {project.splits.map((s, i) => (
              <div key={s.label}>
                <dt><span className="split-index">{i + 1}</span>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Item>
        <Item className="route-note">
          Route: {toMiles(r.length).toFixed(2)} mi through Austin · about {walkTime(r.length)} on foot
        </Item>
        <Item className="button-row">
          {project.href && (
            <a className="button" href={project.href} target="_blank" rel="noopener noreferrer">
              Visit product <ExternalIcon width={16} height={16} />
            </a>
          )}
          <Kudos id={project.id} />
        </Item>
      </Panel>
    </MapStage>
  );
}
