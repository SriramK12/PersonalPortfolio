import type { Metadata } from 'next';
import MapStage, { type Pin } from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import SegmentList from '@/components/SegmentList';
import { places, segments } from '@/content/site';
import { route } from '@/lib/routes';

export const metadata: Metadata = { title: 'Experience' };

export default function Experience() {
  const routes = segments.map((s) => route(s.id));
  const labels = Object.fromEntries(segments.map((s) => [s.id, s.company]));
  // One pin per city name, linked to the first segment there.
  const pins: Pin[] = [];
  for (const s of segments) {
    const name = places.find((p) => p.id === s.place)!.name;
    // The first place listed under a city name is its center (e.g. central Austin, not the IBM campus).
    const center = places.find((p) => p.name === name)!.center;
    if (!pins.some((p) => p.label === name)) pins.push({ routeId: s.id, center, label: name });
  }
  // Put a label on the left when another pin sits close by to the east, so labels don't collide.
  for (const pin of pins) if (pins.some((o) => o !== pin && o.center[0] > pin.center[0] && o.center[0] - pin.center[0] < 6 && Math.abs(o.center[1] - pin.center[1]) < 3)) pin.side = 'left';
  const cities = new Set(pins.map((p) => p.label)).size;

  return (
    <MapStage routes={routes} initial={null} labels={labels} pins={pins}>
      <Panel>
        <PanelHeading eyebrow={`${segments.length} roles · ${cities} cities`} title="Experience">
          <p className="lede">Roles and teams along the way. Hover to fly there, click for details.</p>
        </PanelHeading>
        <Item>
          <SegmentList segments={segments} />
        </Item>
      </Panel>
    </MapStage>
  );
}
