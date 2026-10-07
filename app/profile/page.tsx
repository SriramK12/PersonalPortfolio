import type { Metadata } from 'next';
import Avatar from '@/components/Avatar';
import { ClubIcon, ExternalIcon, FileIcon, GearIcon, GithubIcon, LinkedinIcon, MailIcon, PinIcon, TrophyIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel } from '@/components/Panel';
import { links, profile, segments } from '@/content/site';
import { route } from '@/lib/routes';

export const metadata: Metadata = { title: 'Profile' };

const linkIcons = { GitHub: GithubIcon, LinkedIn: LinkedinIcon, Email: MailIcon, 'Résumé': FileIcon } as const;

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

        <Item className="profile-section" id="contact">
          <h2>Contact</h2>
          <ul className="link-list">
            {links.filter((l) => l.href).map((l) => {
              const Icon = linkIcons[l.label as keyof typeof linkIcons];
              const external = !l.href.startsWith('mailto:');
              return (
                <li key={l.label}>
                  <a href={l.href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
                    <span className="link-icon">{Icon && <Icon />}</span>
                    <span className="link-text"><b>{l.label}</b>{l.handle && <small>{l.handle}</small>}</span>
                    <ExternalIcon width={18} height={18} />
                  </a>
                </li>
              );
            })}
          </ul>
        </Item>

        <Item className="profile-section">
          <h2>School</h2>
          <dl className="fact-list">
            <div><dt>University</dt><dd>{profile.school}</dd></div>
            <div><dt>Class</dt><dd>{profile.classYear}</dd></div>
          </dl>
        </Item>

        <Item className="profile-section">
          <h2>Trophy case</h2>
          <ul className="trophy-list">
            {profile.honors.map((h) => (
              <li key={h.title + h.when}>
                <span className="trophy-badge"><TrophyIcon /></span>
                <span><b>{h.result}</b><small>{h.title}{h.when && ` · ${h.when}`}</small></span>
              </li>
            ))}
          </ul>
        </Item>

        <Item className="profile-section">
          <h2>Gear</h2>
          <ul className="gear-list">
            {profile.degrees.map((d) => <li key={d}><GearIcon /><span><b>{d}</b><small>Degree</small></span></li>)}
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
