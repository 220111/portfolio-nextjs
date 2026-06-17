import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

// All human-editable copy lives in Markdown files under `content/`.
// This module is the single bridge between those files and the components:
// nothing in the UI hardcodes editable text — it is all read from here.
const CONTENT_DIR = path.join(process.cwd(), 'content');

export type Frontmatter = Record<string, unknown>;

export interface Entry {
  /** Filename without the `.md` extension. */
  slug: string;
  /** Parsed YAML frontmatter (the structured fields). */
  data: Frontmatter;
  /** The Markdown body (the `rich-text` field named `body`). */
  body: string;
}

/** Read every `.md` file in a collection folder under `content/`. */
export function getCollection(collection: string): Entry[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.md$/, ''), data, body: content };
    });
}

/** Read a single entry by collection + slug. */
export function getEntry(collection: string, slug: string): Entry | undefined {
  return getCollection(collection).find((entry) => entry.slug === slug);
}

/** Render a Markdown body string to an HTML string at build time. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(markdown ?? '');
  return processed.toString();
}

/** Sort helper for collections that carry a numeric `order` field. */
export function byOrder(a: Entry, b: Entry): number {
  return Number(a.data.order ?? 0) - Number(b.data.order ?? 0);
}

export interface NavItem {
  label: string;
  href: string;
  external: boolean;
}

/** Build the primary navigation from the `pages` collection. */
export function getNav(): NavItem[] {
  return getCollection('pages')
    .filter((page) => page.data.showInNav)
    .sort((a, b) => Number(a.data.navOrder ?? 0) - Number(b.data.navOrder ?? 0))
    .map((page) => {
      const external = Boolean(page.data.externalUrl);
      return {
        label: String(page.data.navLabel ?? page.data.title ?? page.slug),
        href: external
          ? String(page.data.externalUrl)
          : page.slug === 'about'
            ? '/'
            : `/${page.slug}/`,
        external,
      };
    });
}

/** Site-wide singleton settings (name, contact email). */
export function getSettings(): Frontmatter {
  return getEntry('settings', 'site')?.data ?? {};
}
