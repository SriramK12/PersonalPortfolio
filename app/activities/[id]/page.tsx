import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Kudos from '@/components/Kudos';
import { BackIcon, ExternalIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import { activities } from '@/content/site';
import { toMiles, walkTime } from '@/lib/geo';
import { route } from '@/lib/routes';

export const dynamicParams = false;
export const generateStaticParams = () => activities.map((a) => ({ id: a.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: activities.find((a) => a.id === id)?.name ?? 'Activity' };
}

export default async function ActivityPage({ params }: Props) {
  const { id } = await params;
  const activity = activities.find((a) => a.id === id);
  if (!activity) notFound();
  const r = route(activity.id, 600);

  return (
    <MapStage routes={[r]} initial={r.id} labels={{ [r.id]: activity.name }}>
      <Panel className="activity-detail">
        <Item>
          <Link href="/activities/" className="back-link"><BackIcon width={16} height={16} /> Activities</Link>
        </Item>
        <PanelHeading eyebrow={[activity.type, activity.date].filter(Boolean).join(' · ')} title={activity.name}>
          <p className="lede">{activity.description}</p>
        </PanelHeading>
        <Item as="dl" className="big-stats">
          {activity.stats.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </Item>
        <Item className="splits">
          <h2>Splits</h2>
          <dl>
            {activity.splits.map((s, i) => (
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
          {activity.href && (
            <a className="button" href={activity.href} target="_blank" rel="noopener noreferrer">
              Visit product <ExternalIcon width={16} height={16} />
            </a>
          )}
          <Kudos id={activity.id} />
        </Item>
      </Panel>
    </MapStage>
  );
}
