# SEO and AI discoverability — findings and plan

**Audited 2026-08-20 against the live site**, after the domain move to
`un.opensource.nyc`. Phase 1 is done; phases 2-6 are not started.

Every number here was measured, not estimated. Re-measure before acting on any
of it — the point of writing them down is that they can be checked again, not
that they stay true.

## Why this document exists

The campaign's whole job is circulation: getting read, quoted, and cited by
people and systems deciding what New York should do about open source. That is
one problem with two audiences — search engines and language models — and they
want mostly the same things (a crawlable site, an unambiguous URL per page,
machine-readable structure, and content that is genuinely the best source on its
subject). Where they differ is called out below.

## What the audit found

    /robots.txt   404      /sitemap.xml  404      /llms.txt  404
    og:image      0 of 13 routes        JSON-LD   0 of 13 routes
    og:site_name  missing on every page (layout.js sets it)
    /resources    has no <h1>
    /principles and /principles/document: identical title AND description

Two findings needed explaining:

**`og:site_name` and `og:locale` were dropped site-wide.** `layout.js` sets
them, but Next merges metadata *shallowly* — a page's `openGraph` object
replaces the parent's rather than extending it, and every page defines its own.
`og:type` survived only because each page happened to re-declare it. The
`openGraph` block in `layout.js` had been reaching no page at all.

**No `og:image` anywhere** (fixed later the same day — phase 2 item 1), with
`twitter:card` at `summary` (the small card).
Every share of this campaign — Slack, Signal, LinkedIn, Bluesky — renders as
bare text, and og tags are also what several AI systems read when summarizing a
link. For a campaign that exists to be forwarded, this is the largest visible
gap on the site.

Measured lengths, for phase 2:

| Route | Title | Description | |
|---|---|---|---|
| `/` | 70 | **232** | both over; ~60 / ~160 is where SERPs truncate |
| `/campaign/sign` | 71 | **215** | both over |
| `/principles` | 37 | 84 | description thin, and duplicated |
| `/resources` | 25 | 99 | description thin |
| `/contact` | 15 | 78 | description thin |

Content depth is not a problem: 900-1,500 words on each of the five main pages,
all server-rendered as static HTML with no JS gate — which is the single most
important thing for AI retrieval and it is already right.

## Phase 1 — crawlability (DONE 2026-08-20)

- **`src/app/robots.js`** — a real `/robots.txt`, pointing at the sitemap.
  Nothing is disallowed, deliberately: `Disallow` blocks the *fetch*, so a
  crawler never reads the `noindex` it was sent to obey. Blocking and
  de-indexing are opposite tools and this site uses the second one.
  The AI crawlers are named explicitly. `User-agent: *` already allows them, so
  the groups change nothing today — they exist because an unstated default is
  indistinguishable from an unmade decision, and two of the tokens
  (`Google-Extended`, `Applebot-Extended`) are opt-*out* signals that do nothing
  until someone sets them to disallow. This is the one place to flip.
- **`src/app/sitemap.js`** — 12 URLs, generated from `ROUTES` in
  `src/lib/seo.js`, the same list that supplies every canonical. Verified: the
  set of sitemap URLs is *equal* to the set of canonicals in the prerendered
  HTML, and `pageMetadata()` throws on a path missing from `ROUTES`, so a new
  route cannot acquire a canonical without also entering the sitemap.
  No `lastModified`: the obvious source is file mtime, but a CI checkout stamps
  every file at clone time, so each deploy would declare all twelve pages
  modified. A confident lie is worse than saying nothing.
- **`og:site_name` / `og:locale` restored** in `pageMetadata()`, one line
  instead of thirteen.
- **`/resources` got its `<h1>`** — it was the only route with no header at all,
  so its outline opened at `<h2>`, which reads as a page with no subject. Header
  mirrors `/success`; the title and lede are in `content/resources.md`,
  claim-free and number-free.
- **Two of the three host redirects became 308s.** `unnyc.wegov.nyc` and
  `www.opensource.nyc` are folded permanently and a 307 passes no ranking
  signal, so the two hosts holding the site's entire pre-move link history were
  contributing nothing to the host that now answers.
  ⚠ **The apex stays 307** — that rule is designed to be *deleted* when
  `opensource.nyc` becomes its own project, and a hard-cached 308 would strand
  the new site. Do not "finish the job".

Earlier the same day: canonical tags on all 12 indexable routes (PR #49).

## Phase 2 — previews and de-duplication

1. ~~**Generate OG images**~~ **DONE 2026-08-20.** Twelve 1200x630 PNGs,
   prerendered at build from `ROUTES` — not from Next's `opengraph-image.js`
   convention, which is per-directory and would have meant twelve near-identical
   files plus a thirteenth to remember. `/og/<slug>.png`, headline from each
   page's own `meta.ogTitle` with the "— UNNYC" affix stripped, wordmark in the
   UN-blue/NYC-orange split, orange rule along the foot. `twitter:card` is now
   `summary_large_image` — it was `summary`, the small square crop, which would
   have shown a 1200x630 image as a thumbnail with the headline cropped out.
   ⚠ The font is VENDORED (`src/assets/fonts/`, OFL, recorded in CREDITS.md).
   Satori reads ttf/otf/woff and **cannot read woff2**, which is the only format
   Google Fonts serves a modern browser — and asking its CSS API for an older
   format with an ancient user-agent returns EOT, not ttf.
2. **Give `/principles/document` its own title and description.** It currently
   shares both with `/principles`, so the two compete. It rewrites four
   principle titles into the imperative, so it has real distinct content and
   deserves distinct metadata rather than `noindex` — and `/start/principles`
   308s to it, so it has inbound links.
3. **Length pass** on the five routes in the table above.

## Phase 3 — structured data (DONE 2026-08-20)

Ten JSON-LD graphs across eight routes, built in `src/lib/structured-data.js`
from the same `content/*.md` the page renders and emitted by
`src/components/unnyc/StructuredData.js`.

| Route | Graph |
|---|---|
| `/` | `Organization` + `WebSite`, keyed by `@id` so other graphs reference rather than restate |
| `/start` | `DefinedTermSet` — the 8 glossary terms, each with its NYC gloss appended |
| `/principles` | `ItemList` of the 150 UN endorsers |
| `/resources` | `ItemList` of the 18 public sector OSPOs |
| `/resources/guide` | `Article` + `BreadcrumbList` |
| `/principles/document`, `/campaign/sign`, `/campaign/endorse` | `BreadcrumbList` |

**What is deliberately absent, and why** — each of these was written and then
removed:

- **`datePublished` / `dateModified`.** No per-page date exists in this repo, the
  same reason the sitemap has no `lastModified`. A build timestamp would claim
  every page changed on every deploy.
- **Geo coordinates on the OSPO list.** `content/resources.md` has lat/lng, but
  half carry `locationBasis: 'hq'` — the parent body's headquarters, not the
  office's address, which is why the map popup marks "(HQ)". `GeoCoordinates`
  would state a precision the data lacks, so only the city is emitted.
- **`isBasedOn`** for the endorser list's source page — it is a `CreativeWork`
  property and `ItemList` is an `Intangible`. Provenance moved to `description`,
  which is Thing-level and valid anywhere.
- **`additionalType`** for each endorser's sector — that property expects a URI
  from an external vocabulary, not a bare label like "Companies". The sectors
  stay on the visible filter chips, whose counts derive from the same array.

**Verified:** all 10 blocks parse; head tags byte-identical to production on all
13 routes (JSON-LD is a body script, so nothing in `<head>` should move, and
nothing did); no block contains a raw `<`, so none can break out of its own
`<script>`. Marked up only what is server-rendered — checked first that all 150
endorser names and all 18 OSPOs are in the HTML, not behind the client-side
pagination.

**Weight:** raw HTML grew 40.9 kB on `/principles`, but over the wire that is
**+2.4 kB brotli** (`/resources` +1.2, `/start` +0.5) — the structure is
repetitive and compresses hard. The raw figure is roughly twice the JSON because
App Router emits page content twice, in the DOM and again in the RSC payload;
that is equally true of the visible list beside it.

⚠ The breadcrumb work surfaced another face of the `/principles` vs
`/principles/document` duplication below: the trail read "Home > The UN Open
Source Principles > The UN Open Source Principles", because both routes read one
content file. Patched with a `crumb` override on that route entry — a symptom
fix, not the real one.

## Phase 4 — the AI-discoverability bet

This is the highest-leverage item and the only one that is not housekeeping.

The site holds four curated datasets that exist nowhere else in machine-readable
form. The strongest is the **150-organization UN endorser list, transcribed with
names**: the UN's own page carries 154 logos and *zero* names — every card's
title element is empty — so no crawler and no model can extract it from the
source. The others are 18 public sector OSPOs with hand-placed coordinates, 62
government open source programmes, and 13 country catalogues.

Publishing these at stable URLs with provenance, licence and generated date
turns the site from *optimized* into *citable* — the thing a model quotes
because it is the only place the data exists. Add `llms.txt` alongside.

⚠ **Licence check first, per dataset.** The Civic Tech Field Guide slice is
CC BY-NC-SA, so redistribution carries share-alike obligations; GovOSS is
CC BY 4.0; the endorser transcription is our own work. These are not
interchangeable and the differences are already documented in `CLAUDE.md`.

## Phase 5 — off-site and entity presence

Search Console and Bing/IndexNow registration. A Civic Tech Field Guide listing
for UNNYC itself. Cross-links from `wegov.nyc` and `sarapis.org`, GitHub repo
topics and About URL. Note that the campaign's own goal is also its best
backlink: when NYC endorses, the UN's page links here.

## Phase 6 — performance (measure first)

~630 KB of uncompressed static assets per route, near-identical across the four
routes sampled — so that is the shared bundle, not Leaflet, which is correctly
dynamically imported. Take a real LCP/INP measurement before changing anything.

## Decisions still open

1. **OG images generated or photographic?** Generated unblocks immediately.
2. **Publish the datasets, and under what licence?** Highest leverage, and the
   only item with a licence question.
3. **`/principles/document`** — indexable with its own metadata, or `noindex`
   like the other printable?
