import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackIcon, ExternalIcon } from '@/components/Icons';
import { Item, Page, PageHeading } from '@/components/Panel';
import { projects } from '@/content/site';

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ id: p.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: projects.find((p) => p.id === id)?.name ?? 'Project' };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <Page className="is-narrow">
      <Item>
        <Link href="/projects/" className="back-link"><BackIcon width={16} height={16} /> Projects</Link>
      </Item>
      <PageHeading eyebrow={[project.type, project.date].filter(Boolean).join(' · ')} title={project.name}>
        <p className="lede">{project.description}</p>
      </PageHeading>
      <Item as="dl" className="big-stats">
        {project.stats.map((s) => (
          <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
        ))}
      </Item>
      <Item className="splits">
        <h2>Details</h2>
        <dl>
          {project.splits.map((s, i) => (
            <div key={s.label}>
              <dt><span className="split-index">{i + 1}</span>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </Item>
      {project.href && (
        <Item className="button-row">
          <a className="button" href={project.href} target="_blank" rel="noopener noreferrer">
            Visit product <ExternalIcon width={16} height={16} />
          </a>
        </Item>
      )}
    </Page>
  );
}
