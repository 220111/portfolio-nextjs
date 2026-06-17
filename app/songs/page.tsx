import type { Metadata } from 'next';
import SiteFrame from '../components/SiteFrame';
import { byOrder, getCollection, getEntry, renderMarkdown } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Henry Morin',
  openGraph: {
    title: 'Henry Morin Songs of the Moment',
    type: 'website',
    url: 'https://hmorin.com/',
    images: ['/images/turntables.png'],
  },
};

export default async function SongsPage() {
  const page = getEntry('pages', 'songs');
  if (!page) throw new Error('Missing content/pages/songs.md');
  const introHtml = await renderMarkdown(page.body);
  const songs = getCollection('songs').sort(byOrder);

  return (
    <SiteFrame pageId="about">
      <h1>{String(page.data.title)}</h1>
      {page.data.image ? (
        <img src={String(page.data.image)} alt={String(page.data.title)} />
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: introHtml }} />

      <hr />

      {songs.map((song) => (
        <iframe
          key={song.slug}
          className="song-embed"
          title={String(song.data.title ?? song.slug)}
          width="100%"
          height={150}
          src={String(song.data.embedUrl)}
          frameBorder={0}
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
          allow="clipboard-read; clipboard-write"
        />
      ))}

      <hr />
    </SiteFrame>
  );
}
