import type { Metadata } from 'next';
import SiteFrame from '../components/SiteFrame';
import { getEntry, renderMarkdown } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Henry Morin',
  openGraph: {
    title: 'Henry Morin Resume',
    type: 'website',
    url: 'https://hmorin.com/',
    images: ['/images/ogpimg.JPG'],
  },
};

export default async function ResumePage() {
  const page = getEntry('pages', 'resume');
  if (!page) throw new Error('Missing content/pages/resume.md');
  const bodyHtml = await renderMarkdown(page.body);

  return (
    <SiteFrame pageId="resume">
      <h1>{String(page.data.title)}</h1>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SiteFrame>
  );
}
