/**
 * Route metadata and the one list of routes.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * All thirteen routes want the same handful of metadata fields, and each page
 * used to spell them all out itself. That is how the site shipped with
 * `metadataBase` set in layout.js and NOT ONE canonical tag emitted anywhere:
 * the field simply wasn't in the block being copied from page to page, and
 * nothing fails when it's missing. `metadataBase` emits nothing on its own — it
 * only resolves the relative URLs that `alternates.canonical` and
 * `openGraph.url` provide.
 *
 * ── THE ROUTE TABLE ─────────────────────────────────────────────────────────
 * `ROUTES` is the single list of this site's own URLs, and both consumers read
 * it: `pageMetadata()` for the canonical, and `sitemap.js` for the sitemap. A
 * canonical the sitemap doesn't list, or a sitemap entry with no canonical, is
 * a contradiction a crawler has to resolve — so they are not allowed to come
 * from two lists. `pageMetadata()` THROWS on a path that isn't here, following
 * `principlesResolve()`: a new route cannot quietly acquire a canonical without
 * also appearing in the sitemap.
 *
 * Redirects are NOT routes and must never be added (`/start/principles`,
 * the three legacy hosts — see next.config.mjs). A sitemap that lists a
 * redirect asks a crawler to index a URL we're telling it to leave.
 *
 * `content` names the markdown file in content/ whose `meta.ogTitle` becomes
 * the headline of that route's link-preview image (/og/<slug>.png). Two routes
 * legitimately share one file: `/principles` and `/principles/document` read
 * `content/principles.md`, so they share a preview until the document page gets
 * its own metadata (phase 2 of docs/SEO-PLAN.md).
 *
 * `indexable: false` means the route exists but stays out of the sitemap and
 * gets no canonical. One route uses it: `/campaign/endorse/document` is
 * `noindex`, and a self-referencing canonical on a noindex page hands a crawler
 * two contradictory instructions ("don't index this" / "this is the URL to
 * index"). It's listed here anyway so this table stays a true inventory.
 *
 * ── PATHS, NOT URLs ─────────────────────────────────────────────────────────
 * Next resolves a relative path against `metadataBase`
 * (https://un.opensource.nyc — see layout.js), so the host lives in exactly one
 * place and a future move is one line. Never write an absolute URL here.
 *
 * ── WHY CANONICALS EARN THEIR KEEP ──────────────────────────────────────────
 * `www.opensource.nyc` and `unnyc.wegov.nyc` redirect into `un.opensource.nyc`,
 * and the apex does too on a 307 that passes no ranking signal at all. A
 * redirect only helps a crawler that follows it — an inbound link already
 * indexed against a legacy host has nothing else telling it which URL wins.
 */

/**
 * The site's own origin, in ONE place.
 *
 * `layout.js` feeds it to `metadataBase` (which resolves every canonical and
 * og:url) and `sitemap.js`/`robots.js` need it absolute, because neither is
 * resolved against `metadataBase` the way page metadata is. Three hostnames
 * redirect here; this is the one that answers 200.
 */
export const SITE_URL = 'https://un.opensource.nyc';

/** Open Graph's expected image size, restated here so metadata doesn't have to
 *  import the renderer (src/lib/og-image.js reads the filesystem and pulls in
 *  next/og — not something every page's metadata should drag along). Keep the
 *  two in step; OG_SIZE there is the one that actually draws the pixels. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Every route this site serves. `changeFrequency`/`priority` are sitemap
 *  hints only; they say "this page changes more often than that one", nothing
 *  a crawler is obliged to honour. */
export const ROUTES = [
    { path: '/', content: 'home', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/start', content: 'start', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/principles', content: 'principles', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/principles/document', content: 'principles', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/crosswalk', content: 'crosswalk', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/success', content: 'success', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/campaign', content: 'campaign', priority: 0.8, changeFrequency: 'monthly' },
    // The two conversion pages. `/campaign/sign` carries the endorser wall, so
    // it genuinely changes whenever a signature is published.
    { path: '/campaign/sign', content: 'sign', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/campaign/endorse', content: 'endorse', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/campaign/endorse/document', indexable: false },
    { path: '/resources', content: 'resources', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/resources/guide', content: 'guide', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/contact', content: 'contact', priority: 0.5, changeFrequency: 'yearly' },
];

const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

/** The routes that belong in the sitemap — everything except `indexable: false`. */
export function indexableRoutes() {
    return ROUTES.filter((r) => r.indexable !== false);
}

/** The routes that get a generated link-preview image: the indexable ones that
 *  name a content file. `/campaign/endorse/document` has neither — it is a
 *  noindex printable with hand-written metadata. */
export function imageRoutes() {
    return ROUTES.filter((r) => r.indexable !== false && r.content);
}

/**
 * A route path as a flat filename fragment: '/' -> 'home',
 * '/campaign/sign' -> 'campaign-sign'.
 *
 * Nested paths are flattened because the image route is a single dynamic
 * segment. Keep it collision-free: two routes that flatten to the same slug
 * would silently share one preview, so `ogSlug` is asserted to be injective in
 * the image route's own tests-by-construction (generateStaticParams would
 * produce a duplicate param and Next would fail the build).
 */
export function ogSlug(path) {
    return path === '/' ? 'home' : path.slice(1).replace(/\//g, '-');
}

/**
 * The headline for the image, from the page's own `meta.ogTitle`.
 *
 * Strips the "— UNNYC" affix, in either position ("UNNYC — The UN Has United…",
 * "Related Resources — UNNYC"), because the wordmark is already drawn in the
 * corner and a preview that says UNNYC twice wastes the one line a reader scans.
 */
export function ogHeadline(ogTitle) {
    return String(ogTitle ?? '')
        .replace(/^UNNYC\s+[—-]\s+/, '')
        .replace(/\s+[—-]\s+UNNYC$/, '')
        .trim();
}

/** Where a route's generated preview image lives. Relative on purpose — Next
 *  resolves it against `metadataBase`, same as the canonical. */
export function ogImagePath(path) {
    return `/og/${ogSlug(path)}.png`;
}

/**
 * Build a route's metadata.
 *
 * @param meta    the page's `meta:` frontmatter (content/*.md)
 * @param path    this route's own path — must be in ROUTES
 * @param ogType  'article' by default; the three hub-ish pages (/, /campaign,
 *                /contact) pass 'website', as they always did.
 *
 * The path can't be derived: `generateMetadata` gets no pathname for a static
 * route. It is written once and drives both the canonical and og:url — typing
 * those separately is a wrong canonical waiting to happen.
 */
export function pageMetadata(meta, path, ogType = 'article') {
    const route = BY_PATH.get(path);
    if (!route) {
        // Loud on purpose. The alternative is a page that renders fine, states
        // a canonical for a URL the sitemap never mentions, and looks correct.
        throw new Error(
            `pageMetadata: '${path}' is not in ROUTES (src/lib/seo.js). Add it there ` +
            `so the canonical and the sitemap agree — or fix the path if it's a typo.`,
        );
    }

    return {
        title: meta.title,
        description: meta.description,
        // `indexable: false` routes set their own metadata by hand and never
        // reach this branch, but guard anyway — a canonical is the one field
        // that must not appear on a noindex page.
        ...(route.indexable === false ? {} : { alternates: { canonical: path } }),
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
            type: ogType,
            url: path,
            // ⚠ RESTATED HERE, NOT INHERITED. Next merges metadata SHALLOWLY:
            // a page's `openGraph` object REPLACES the parent's rather than
            // extending it. layout.js sets siteName/locale and every page
            // defines its own openGraph, so both were silently dropped from all
            // thirteen routes — og:type survived only because each page
            // happened to re-declare it. Verified against production: no
            // og:site_name, no og:locale, anywhere.
            siteName: 'UNNYC',
            locale: 'en_US',
            ...(route.content
                ? {
                      images: [
                          {
                              url: ogImagePath(path),
                              width: OG_WIDTH,
                              height: OG_HEIGHT,
                              // Describes the image's own words, because that
                              // is all the image contains — the headline, the
                              // wordmark and the domain. ⚠ Built from
                              // ogHeadline(), NOT the raw ogTitle: most
                              // ogTitles already end in "— UNNYC", so
                              // appending it produced "Contact — UNNYC —
                              // UNNYC" on eight of the twelve routes.
                              alt: `${ogHeadline(meta.ogTitle)} — UNNYC`,
                          },
                      ],
                  }
                : {}),
        },
        // ⚠ SET EXPLICITLY. Next derives the twitter tags from openGraph but
        // defaults the card to 'summary' — the small square crop — which shows a
        // 1200x630 image as a thumbnail with most of the headline cropped out.
        // The site was emitting `twitter:card: summary` with no image at all.
        twitter: {
            card: route.content ? 'summary_large_image' : 'summary',
            title: meta.ogTitle,
            description: meta.ogDescription,
        },
    };
}
