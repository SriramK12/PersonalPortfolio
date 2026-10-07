import type { Metadata } from 'next';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import RouteFilter, { type ActivityItem } from '@/components/RouteFilter';
import { route } from '@/lib/routes';
import { sportGroup, stravaActivities, stravaNote, stravaRoute, stravaRouteId, stravaStats, stravaThumb } from '@/lib/strava';

export const metadata: Metadata = { title: 'Activities' };

export default function Activities() {
  // Only runs and hikes are shown; photos arrive separately.
  const real = stravaActivities().filter((a) => ['Runs', 'Hikes'].includes(sportGroup(a.sport)));
  const items: ActivityItem[] = real.map((a) => ({ id: stravaRouteId(a), label: a.name, group: sportGroup(a.sport), note: stravaNote(a) }));
  // Without Strava data the map still needs something to show; the hiking route stands in.
  const routes = real.length ? real.map((a) => stravaRoute(a)) : [route('hiking')];
  const labels = Object.fromEntries(items.map((i) => [i.id, i.label]));
  const thumbs = Object.fromEntries(real.map((a) => [stravaRouteId(a), stravaThumb(a)]));
  const firstRun = items.find((i) => i.group === 'Runs') ?? items[0];

  return (
    <MapStage routes={routes} initial={firstRun?.id ?? null} labels={labels} stats={stravaStats(real)}>
      <Panel>
        <PanelHeading eyebrow={`${real.length} recent activities`} title="Activities">
          <p className="lede">Runs, hikes, and photos from off the clock.</p>
        </PanelHeading>
        <Item>
          <RouteFilter items={items} thumbs={thumbs} />
        </Item>
        {real.length > 0 && (
          <Item className="powered-by">
            Activity data <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer">Powered by Strava</a>
          </Item>
        )}
      </Panel>
    </MapStage>
  );
}
