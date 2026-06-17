import Link from 'next/link';
import { getEntry, getNav, getSettings } from '@/lib/content';

interface SiteFrameProps {
  /** Matches the original site's <body> id used by the stylesheet. */
  pageId: 'about' | 'portfolio' | 'resume';
  children: React.ReactNode;
}

/**
 * The shared page chrome (header / nav / footer) replicating the original
 * grid layout. Every label and link here is sourced from `content/`.
 */
export default function SiteFrame({ pageId, children }: SiteFrameProps) {
  const settings = getSettings();
  const nav = getNav();
  const attribution = getEntry('pages', 'attribution');

  return (
    <div id={pageId}>
      <div id="body">
        <header>
          <h1>{String(settings.name ?? '')}</h1>
        </header>
        <nav>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <main>{children}</main>
        <footer>
          <p>{String(settings.email ?? '')}</p>
          {attribution && (
            <p>
              <Link href="/attribution/">
                {String(attribution.data.navLabel ?? attribution.data.title)}
              </Link>
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
