# hmorin.com — portfolio

A statically-generated rebuild of [hmorin.com](https://hmorin.com) using
**Next.js**. The site is content-managed by a custom external,
Git-backed CMS..

## Tech

- Next.js App Router with `output: 'export'` → `npm run build` emits a fully
  static `out/` directory that can deploy anywhere (no server, no env vars).
- [`gray-matter`](https://github.com/jonschlinkert/gray-matter) parses YAML
  frontmatter; [`remark`](https://github.com/remarkjs/remark) + `remark-html`
  render the Markdown body to HTML at build time.
- Project detail pages are generated one-per-file with `generateStaticParams`.

## Commands

```bash
npm install
npm run dev     # local dev at http://localhost:3000
npm run build   # static export to ./out
```

## Content model

Content is organized into **collections** — one folder per collection under
`content/`, one Markdown file per entry, where **filename = slug**. Each file is
YAML frontmatter (the structured fields) followed by a Markdown body (the
long-form `rich-text` field, always named `body`).

```
content/
├── settings/
│   └── site.md            # singleton: site name + contact email
├── pages/                 # page-level singletons (one file per page)
│   ├── about.md           # the "/" hero/about section
│   ├── portfolio.md       # "/portfolio" heading
│   ├── resume.md          # "/resume" (full resume lives in the Markdown body)
│   ├── songs.md           # "/songs" heading + intro
│   ├── github.md          # nav-only entry (externalUrl, no route)
│   └── attribution.md     # "/attribution"
├── projects/              # Portfolio collection (one file per project)
│   ├── rctransmitter-usbgamepad.md
│   ├── tinytv.md
│   └── ...                # → /portfolio/<slug>/ detail pages
└── songs/                 # "Songs of the Moment" embeds
    ├── song-01.md
    └── ...
```

### Schema → file mapping

The CMS contract lives in [`ssgcms.config.json`](ssgcms.config.json) at the repo
root. Its top-level `schemas` array describes every collection. Each schema's
`path` is the subfolder under `content/`, and each `field.name` **matches a
frontmatter key exactly** — except the `rich-text` field, named `body`, which
maps to the Markdown **body** of the file (not a frontmatter key).

| Schema (config) | `path` → folder     | Notes                                                                                               |
| --------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `Pages`         | `content/pages/`    | `navLabel`/`navOrder`/`showInNav` drive the nav; `externalUrl` makes a nav-only link with no route. |
| `Projects`      | `content/projects/` | Listed on `/portfolio`; each file also generates a `/portfolio/<slug>/` page.                       |
| `Songs`         | `content/songs/`    | `embedUrl` is rendered as an Odesli iframe on `/songs`.                                             |
| `Settings`      | `content/settings/` | Single `site.md` entry: site name + contact email.                                                  |

Field `type` is one of `text`, `rich-text`, `boolean`, `date`, `image`. Images
referenced by `image` fields live in [`public/`](public/) and frontmatter stores
the path (e.g. `/images/ogpimg.JPG`).

### Adding content

Drop a new Markdown file into the relevant `content/<collection>/` folder with
frontmatter keys matching that collection's schema, then rebuild. For example, a
new project is a new file in `content/projects/`; it appears on `/portfolio`
(sorted by `order`) and gets its own detail page automatically.

## How the build reads content

[`lib/content.ts`](lib/content.ts) is the only bridge between the Markdown files
and the React components. Components call `getCollection`, `getEntry`,
`getNav`, `getSettings`, and `renderMarkdown` — they never contain editable
strings themselves.
