import type { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import { projects } from '@/content/site';
import { route, thumb } from '@/lib/routes';

export const metadata: Metadata = { title: 'Projects' };

export default function Projects() {
  const routes = projects.map((a) => route(a.id));
  const labels = Object.fromEntries(projects.map((a) => [a.id, a.name]));

  return (
    <MapStage routes={routes} initial={projects[0].id} labels={labels}>
      <Panel>
        <PanelHeading eyebrow={`${projects.length} projects`} title="Projects">
          <p className="lede">Products and prototypes. Hover a card to trace its route.</p>
        </PanelHeading>
        {projects.map((a) => (
          <Item key={a.id}>
            <ProjectCard project={a} thumb={thumb(a.id)} />
          </Item>
        ))}
      </Panel>
    </MapStage>
  );
}
