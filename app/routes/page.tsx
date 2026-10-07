import type { Metadata } from 'next';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import RouteFilter from '@/components/RouteFilter';
import { interests } from '@/content/site';
import { route, thumb } from '@/lib/routes';

export const metadata: Metadata = { title: 'Routes' };

export default function Routes() {
  const routes = interests.map((i) => route(i.id));
  const labels = Object.fromEntries(interests.map((i) => [i.id, i.label]));
  const thumbs = Object.fromEntries(interests.map((i) => [i.id, thumb(i.id)]));

  return (
    <MapStage routes={routes} initial="hiking" labels={labels}>
      <Panel>
        <PanelHeading eyebrow={`${interests.length} saved routes`} title="Routes">
          <p className="lede">What I do off the clock.</p>
        </PanelHeading>
        <Item>
          <RouteFilter interests={interests} thumbs={thumbs} />
        </Item>
        <Item className="coming-soon">Photo archive coming soon.</Item>
      </Panel>
    </MapStage>
  );
}
