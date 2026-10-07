import type { Metadata } from 'next';
import Avatar from '@/components/Avatar';
import { ClubIcon, GearIcon, PinIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel } from '@/components/Panel';
import { profile, segments } from '@/content/site';
import { route } from '@/lib/routes';

export const metadata: Metadata = { title: 'Profile' };

// Student organizations from the experience list.
const clubs = segments.filter((s) => ['Texas Convergent', 'Texas Consulting / HP'].includes(s.company));

export default function Profile() {
  return (
    <MapStage routes={[route('profile')]} initial="profile" labels={{ profile: 'Campus to Mount Bonnell' }}>
      <Panel className="profile">
        <Item className="profile-head">
          <Avatar size={112} />
          <div>
            <p className="eyebrow">Athlete profile</p>
            <h1>{profile.name}</h1>
            <p className="athlete-place"><PinIcon width={15} height={15} /> Austin, Texas</p>
          </div>
        </Item>
        <Item><p className="lede">{profile.bio}</p></Item>

        <Item className="profile-section">
          <h2>School</h2>
          <dl className="fact-list">
            <div><dt>University</dt><dd>{profile.school}</dd></div>
            <div><dt>Class</dt><dd>{profile.classYear}</dd></div>
          </dl>
        </Item>

        <Item className="profile-section">
          <h2>Gear</h2>
          <ul className="gear-list">
            {profile.degrees.map((d) => <li key={d}><GearIcon /><span><b>{d}</b><small>Degree</small></span></li>)}
            {profile.minors.map((m) => <li key={m}><GearIcon /><span><b>{m}</b><small>Minor</small></span></li>)}
          </ul>
        </Item>

        <Item className="profile-section">
          <h2>Clubs</h2>
          <ul className="gear-list">
            {clubs.map((c) => <li key={c.id}><ClubIcon /><span><b>{c.company}</b><small>{c.role}</small></span></li>)}
          </ul>
        </Item>
      </Panel>
    </MapStage>
  );
}
