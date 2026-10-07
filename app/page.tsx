import Link from 'next/link';
import ActivityCard from '@/components/ActivityCard';
import Avatar from '@/components/Avatar';
import CountUp from '@/components/CountUp';
import Intro from '@/components/Intro';
import { ArrowIcon, PinIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel } from '@/components/Panel';
import { activities, interests, profile, segments } from '@/content/site';
import { route, thumb } from '@/lib/routes';

export default function Dashboard() {
  const routes = [route('intro'), ...activities.map((a) => route(a.id))];
  const labels = { intro: 'Campus to Lady Bird Lake', ...Object.fromEntries(activities.map((a) => [a.id, a.name])) };

  return (
    <MapStage routes={routes} initial="intro" labels={labels} intro>
      <Intro />
      <Panel className="dashboard">
        <Item className="athlete-card">
          <Avatar size={88} />
          <h1>{profile.name}</h1>
          <p className="athlete-place"><PinIcon width={15} height={15} /> UT Austin · Class of {profile.classYear}</p>
          <p className="athlete-tagline">{profile.tagline}</p>
          <dl className="athlete-stats">
            <div><dt>Activities</dt><dd><CountUp to={activities.length} /></dd></div>
            <div><dt>Segments</dt><dd><CountUp to={segments.length} delay={0.4} /></dd></div>
            <div><dt>Routes</dt><dd><CountUp to={interests.length} delay={0.5} /></dd></div>
          </dl>
          <div className="button-row">
            <Link className="button" href="/activities/">View activities <ArrowIcon width={16} height={16} /></Link>
            <Link className="button is-ghost" href="/profile/">Profile</Link>
          </div>
        </Item>

        <Item className="feed-label"><h2>Recent activity</h2></Item>
        {activities.map((a) => (
          <Item key={a.id}>
            <ActivityCard activity={a} thumb={thumb(a.id)} compact />
          </Item>
        ))}
      </Panel>
    </MapStage>
  );
}
