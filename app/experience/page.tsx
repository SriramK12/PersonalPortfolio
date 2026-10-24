import type { Metadata } from 'next';
import FlipCard from '@/components/FlipCard';
import { PinIcon } from '@/components/Icons';
import { Item, Page, PageHeading } from '@/components/Panel';
import { placeName, segments as allSegments } from '@/content/site';

export const metadata: Metadata = { title: 'Experience' };

const roles = allSegments.filter((s) => !s.hidden);

export default function Experience() {
  return (
    <Page>
      <PageHeading eyebrow={`${roles.length} roles`} title="Experience">
        <p className="lede">Where I've worked. Click a card to flip it.</p>
      </PageHeading>
      <Item as="ul" className="card-grid">
        {roles.map((s) => (
          <li key={s.id}>
            <FlipCard
              label={s.company}
              front={
                <>
                  <span className="card-tag"><PinIcon width={12} height={12} /> {placeName(s.place)}</span>
                  <span className="card-title">{s.company}</span>
                  <span className="card-sub">{s.role}</span>
                </>
              }
              back={
                <>
                  <h2 className="card-back-title">{s.company}</h2>
                  <p className="card-meta">{[s.role, s.context].filter(Boolean).join(' · ')}</p>
                  <ul className="card-list">
                    {s.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </>
              }
            />
          </li>
        ))}
      </Item>
    </Page>
  );
}
