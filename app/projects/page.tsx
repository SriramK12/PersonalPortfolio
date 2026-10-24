import type { Metadata } from 'next';
import Link from 'next/link';
import FlipCard from '@/components/FlipCard';
import { ArrowIcon, ExternalIcon } from '@/components/Icons';
import { Item, Page, PageHeading } from '@/components/Panel';
import { projects } from '@/content/site';

export const metadata: Metadata = { title: 'Projects' };

export default function Projects() {
  return (
    <Page>
      <PageHeading eyebrow={`${projects.length} projects`} title="Projects">
        <p className="lede">Products and prototypes. Click a card to flip it.</p>
      </PageHeading>
      <Item as="ul" className="card-grid">
        {projects.map((p) => (
          <li key={p.id}>
            <FlipCard
              label={p.name}
              front={
                <>
                  <span className="card-tag">{p.type}</span>
                  <span className="card-title">{p.name}</span>
                  <span className="card-sub">{p.summary}</span>
                </>
              }
              back={
                <>
                  <h2 className="card-back-title">{p.name}</h2>
                  <p className="card-text">{p.description}</p>
                  <dl className="stat-row">
                    {p.stats.map((s) => (
                      <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                    ))}
                  </dl>
                  <div className="card-actions">
                    <Link href={`/projects/${p.id}/`} className="text-link">Details <ArrowIcon width={16} height={16} /></Link>
                    {p.href && (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-link">Visit <ExternalIcon width={15} height={15} /></a>
                    )}
                  </div>
                </>
              }
            />
          </li>
        ))}
      </Item>
    </Page>
  );
}
