import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteFrame from '../../components/SiteFrame';
import { getCollection, getEntry, renderMarkdown } from '@/lib/content';

// One static page per file in content/projects/.
export function generateStaticParams() {
  return getCollection('projects').map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getEntry('projects', slug);
  return {
    title: project ? `${project.data.title} — Henry Morin` : 'Henry Morin',
    openGraph: {
      title: `${project?.data.title ?? 'Project'} — Henry Morin`,
      type: 'website',
      images: [String(project?.data.thumbnail ?? '/images/ogpimg.JPG')],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getEntry('projects', slug);
  if (!project) notFound();
  const bodyHtml = await renderMarkdown(project.body);

  return (
    <SiteFrame pageId="portfolio">
      <Link className="back-link" href="/portfolio/">
        ← Back to Portfolio
      </Link>
      <article className="project-detail">
        <h1>{String(project.data.title)}</h1>
        {project.data.thumbnail ? (
          <img
            src={String(project.data.thumbnail)}
            alt={String(project.data.title)}
          />
        ) : null}
        <h3>{String(project.data.role)}</h3>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        {project.data.url ? (
          <p>
            <a href={String(project.data.url)}>Visit project →</a>
          </p>
        ) : null}
      </article>
    </SiteFrame>
  );
}
