import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFrame from '../components/SiteFrame';
import { byOrder, getCollection, getEntry } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Henry Morin',
  openGraph: {
    title: 'Henry Morin Portfolio',
    type: 'website',
    url: 'https://hmorin.com/',
    images: ['/images/ogpimg.JPG'],
  },
};

export default function PortfolioPage() {
  const page = getEntry('pages', 'portfolio');
  if (!page) throw new Error('Missing content/pages/portfolio.md');
  const projects = getCollection('projects').sort(byOrder);

  return (
    <SiteFrame pageId="portfolio">
      <h1>{String(page.data.title)}</h1>
      <ul id="portfolioItems">
        {projects.map((project) => (
          <li key={project.slug}>
            <h2>
              <Link href={`/portfolio/${project.slug}/`}>
                {String(project.data.title)}
              </Link>
            </h2>
            {project.data.thumbnail ? (
              <img
                src={String(project.data.thumbnail)}
                alt={String(project.data.title)}
              />
            ) : null}
            <h3>{String(project.data.role)}</h3>
            <p>{String(project.data.summary)}</p>
          </li>
        ))}
      </ul>
    </SiteFrame>
  );
}
