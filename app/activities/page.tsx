import type { Metadata } from 'next';
import ActivityCard from '@/components/ActivityCard';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import { activities } from '@/content/site';
import { route, thumb } from '@/lib/routes';

export const metadata: Metadata = { title: 'Activities' };

export default function Activities() {
  const routes = activities.map((a) => route(a.id));
  const labels = Object.fromEntries(activities.map((a) => [a.id, a.name]));

  return (
    <MapStage routes={routes} initial={activities[0].id} labels={labels}>
      <Panel>
        <PanelHeading eyebrow={`${activities.length} activities`} title="Activities">
          <p className="lede">Products and prototypes. Hover a card to trace its route.</p>
        </PanelHeading>
        {activities.map((a) => (
          <Item key={a.id}>
            <ActivityCard activity={a} thumb={thumb(a.id)} />
          </Item>
        ))}
      </Panel>
    </MapStage>
  );
}
