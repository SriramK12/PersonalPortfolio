import type { Metadata } from 'next';
import Avatar from '@/components/Avatar';
import { ExternalIcon, FileIcon, GithubIcon, LinkedinIcon, MailIcon } from '@/components/Icons';
import MapStage from '@/components/map/MapStage';
import { Item, Panel, PanelHeading } from '@/components/Panel';
import { links, profile } from '@/content/site';
import { route } from '@/lib/routes';

export const metadata: Metadata = { title: 'Follow' };

const icons = { GitHub: GithubIcon, LinkedIn: LinkedinIcon, Email: MailIcon, 'Résumé': FileIcon } as const;

export default function Follow() {
  const live = links.filter((l) => l.href);

  return (
    <MapStage routes={[route('follow')]} initial="follow" labels={{ follow: 'The finish line' }} tracer={false}>
      <Panel>
        <Item className="follow-head"><Avatar size={72} /></Item>
        <PanelHeading eyebrow="Follow" title={`Keep up with ${profile.name.split(' ')[0]}`}>
          <p className="lede">The route ends here.</p>
        </PanelHeading>
        <Item as="ul" className="link-list">
          {live.map((l) => {
            const Icon = icons[l.label as keyof typeof icons];
            return (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <span className="link-icon">{Icon && <Icon />}</span>
                  <span className="link-text"><b>{l.label}</b>{l.handle && <small>{l.handle}</small>}</span>
                  <ExternalIcon width={18} height={18} />
                </a>
              </li>
            );
          })}
        </Item>
      </Panel>
    </MapStage>
  );
}
