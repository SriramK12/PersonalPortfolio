import type { Metadata } from 'next';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import RouteFilter from '@/components/RouteFilter';
import { interests } from '@/content/site';
import { route, thumb } from '@/lib/routes';
import { sportGroup, stravaActivities, stravaNote, stravaRoute, stravaRouteId, stravaStats, stravaThumb } from '@/lib/strava';

export const metadata: Metadata = { title: 'Routes' };

export default function Routes() {
  // Real Strava activities first (when connected), then the interest routes.
  const real = stravaActivities().slice(0, 12);
  const items = [
    ...real.map((a) => ({ id: stravaRouteId(a), label: a.name, group: sportGroup(a.sport), note: stravaNote(a) })),
    ...interests,
  ];
  const routes = [...real.map((a) => stravaRoute(a)), ...interests.map((i) => route(i.id))];
  const labels = Object.fromEntries(items.map((i) => [i.id, i.label]));
  const thumbs = { ...Object.fromEntries(real.map((a) => [stravaRouteId(a), stravaThumb(a)])), ...Object.fromEntries(interests.map((i) => [i.id, thumb(i.id)])) };

  return (
    <MapStage routes={routes} initial={real.length ? stravaRouteId(real[0]) : 'hiking'} labels={labels} stats={stravaStats(real)}>
      <Panel>
        <PanelHeading eyebrow={`${items.length} saved routes`} title="Routes">
          <p className="lede">{real.length ? 'Recent activities and what I do off the clock.' : 'What I do off the clock.'}</p>
        </PanelHeading>
        <Item>
          <RouteFilter items={items} thumbs={thumbs} />
        </Item>
        <Item className="coming-soon">Photo archive coming soon.</Item>
        {real.length > 0 && (
          <Item className="powered-by">
            Activity data <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer">Powered by Strava</a>
          </Item>
        )}
      </Panel>
    </MapStage>
  );
}
