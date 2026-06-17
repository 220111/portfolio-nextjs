import type { Metadata } from 'next';
import SiteFrame from '../components/SiteFrame';
import { getEntry, renderMarkdown } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Henry Morin',
  openGraph: {
    title: 'Henry Morin Attribution',
    type: 'website',
    url: 'https://hmorin.com/',
    images: ['/images/ogpimg.JPG'],
  },
};

export default async function AttributionPage() {
  const page = getEntry('pages', 'attribution');
  if (!page) throw new Error('Missing content/pages/attribution.md');
  const bodyHtml = await renderMarkdown(page.body);

  return (
    <SiteFrame pageId="about">
      <h1>{String(page.data.title)}</h1>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SiteFrame>
  );
}
