import type { Metadata } from 'next';
import FlipCard from '@/components/FlipCard';
import { Item, Page, PageHeading } from '@/components/Panel';
import PhotoGallery from '@/components/PhotoGallery';
import RouteThumb from '@/components/RouteThumb';
import { photos } from '@/content/photos';
import { toMiles } from '@/lib/geo';
import { sportGroup, stravaActivities, stravaNote, stravaThumb, type StravaActivity } from '@/lib/strava';

export const metadata: Metadata = { title: 'Personal' };

/** The back of the Runs and Hikes cards: totals, then each activity with a small route sketch. */
function ActivityList({ items, noun }: { items: StravaActivity[]; noun: string }) {
  if (!items.length) return <p className="card-text">No {noun} yet.</p>;
  const miles = items.reduce((sum, a) => sum + toMiles(a.distance), 0);
  return (
    <>
      <dl className="stat-row">
        <div><dt>{noun[0].toUpperCase() + noun.slice(1)}</dt><dd>{items.length}</dd></div>
        <div><dt>Total</dt><dd>{miles.toFixed(1)} mi</dd></div>
        <div><dt>Longest</dt><dd>{Math.max(...items.map((a) => toMiles(a.distance))).toFixed(1)} mi</dd></div>
      </dl>
      <ul className="activity-list">
        {items.map((a) => (
          <li key={a.id}>
            <span className="activity-sketch"><RouteThumb coords={stravaThumb(a)} /></span>
            <span><b>{a.name}</b><small>{stravaNote(a)}</small></span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Personal() {
  const activities = stravaActivities();
  const runs = activities.filter((a) => sportGroup(a.sport) === 'Runs');
  const hikes = activities.filter((a) => sportGroup(a.sport) === 'Hikes');
  const cards = [
    { id: 'runs', title: 'Runs', sub: `${runs.length} recent`, back: <ActivityList items={runs} noun="runs" /> },
    { id: 'hikes', title: 'Hikes', sub: `${hikes.length} recent`, back: <ActivityList items={hikes} noun="hikes" /> },
    {
      id: 'photos',
      title: 'Photos',
      sub: `${photos.length} photos`,
      back: photos.length ? <PhotoGallery photos={photos} /> : <p className="card-text">Photos coming soon.</p>,
    },
  ];

  return (
    <Page>
      <PageHeading eyebrow="Off the clock" title="Personal">
        <p className="lede">Runs, hikes, and photos. Click a card to flip it.</p>
      </PageHeading>
      <Item as="ul" className="card-grid">
        {cards.map((c) => (
          <li key={c.id}>
            <FlipCard
              label={c.title}
              front={
                <>
                  <span className="card-title">{c.title}</span>
                  <span className="card-sub">{c.sub}</span>
                </>
              }
              back={
                <>
                  <h2 className="card-back-title">{c.title}</h2>
                  {c.back}
                </>
              }
            />
          </li>
        ))}
      </Item>
      {activities.length > 0 && (
        <Item className="powered-by">
          Run and hike data <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer">Powered by Strava</a>
        </Item>
      )}
    </Page>
  );
}
