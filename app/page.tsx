import type { Metadata } from 'next';
import SiteFrame from './components/SiteFrame';
import { getEntry, renderMarkdown } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Henry Morin',
  openGraph: {
    title: 'Henry Morin About',
    type: 'website',
    url: 'https://hmorin.com/',
    images: ['/images/ogpimg.JPG'],
  },
};

export default async function AboutPage() {
  const page = getEntry('pages', 'about');
  if (!page) throw new Error('Missing content/pages/about.md');
  const bodyHtml = await renderMarkdown(page.body);

  return (
    <SiteFrame pageId="about">
      <h1>{String(page.data.title)}</h1>
      {page.data.image ? (
        <img src={String(page.data.image)} alt={String(page.data.title)} />
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SiteFrame>
  );
}
