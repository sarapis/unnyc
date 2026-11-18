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
 * `content` names the markdown file in content/ whose meta block supplies the
 * route's title, description and the headline of its link-preview image
 * (/og/<slug>.png).
 *
 * `metaKey` names a DIFFERENT block in that file, for the case where two routes
 * share one content file. `/principles` and `/principles/document` both read
 * `content/principles.md`; the document page reads `metaDocument`, so the two no
 * longer share a title, a description or a preview. Read it through
 * `routeMeta()` rather than reaching for `doc.meta` directly.
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

/**
 * ⚠ THE COUNCIL SITE (2026-11): the same deployment on a second host, arguing for
 * an open-source-by-default local law. Its pages live at src/app/(council)/council/*
 * and are served at council.opensource.nyc/* by the host rewrite in
 * next.config.mjs, so its ROUTES use PUBLIC paths ("/bill") with `site: 'council'`.
 *
 * ⚠ COUNCIL_LIVE gates everything outward-facing. Until the domain answers and the
 * model bill has been reviewed, every Council page is `noindex`, has NO canonical
 * (a canonical on a noindex page is a contradiction — see /campaign/endorse/document)
 * and is left out of every sitemap and llms.txt. Flip it in the same PR that adds
 * the domain.
 */
export const COUNCIL_URL = 'https://council.opensource.nyc';
export const COUNCIL_LIVE = false;
export const SITE_URLS = { un: SITE_URL, council: COUNCIL_URL };
const SITE_NAMES = { un: 'UNNYC', council: 'Open by Default NYC' };

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
    // `metaKey` is what stops this route duplicating /principles (see above).
    // `crumb` stays because a breadcrumb leaf and a page title are different
    // registers: the trail wants two or three words, and this page's own titles
    // all begin "The UN Open Source Principles", which the PARENT crumb already
    // says. It is no longer patching a collision.
    { path: '/principles/document', content: 'principles', metaKey: 'metaDocument', crumb: 'One-Pager', priority: 0.6, changeFrequency: 'yearly' },
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
    // The Council site — PUBLIC paths on council.opensource.nyc.
    { site: 'council', path: '/', content: 'council-home', priority: 1.0, changeFrequency: 'weekly' },
    { site: 'council', path: '/bill', content: 'council-bill', priority: 0.9, changeFrequency: 'monthly' },
];

/** Which site a route belongs to; the UN site is the default. */
const siteOf = (r) => r.site ?? 'un';
const isLive = (r) => siteOf(r) !== 'council' || COUNCIL_LIVE;

const BY_PATH = new Map(ROUTES.map((r) => [`${siteOf(r)}:${r.path}`, r]));

/**
 * The meta block a route reads out of its content file — `meta` for almost
 * every route, or the block named by `metaKey` where two routes share a file.
 *
 * Everything that describes a page to the outside world goes through here, so a
 * route can't end up with its own title but its sibling's preview image.
 * THROWS on a named block that isn't in the file: a typo would otherwise
 * silently fall back to `undefined` and ship a page with no title at all.
 */
export function routeMeta(doc, route) {
    if (!route?.metaKey) return doc?.meta;
    const meta = doc?.[route.metaKey];
    if (!meta) {
        throw new Error(
            `routeMeta: '${route.path}' names metaKey '${route.metaKey}', which is ` +
            `not in its content file. Add that block or drop the key.`,
        );
    }
    return meta;
}

/** One route entry by path. Returns undefined for an unknown path — callers
 *  that must not silently accept one (`pageMetadata`) check for themselves. */
export function routeForPath(path, site = 'un') {
    return BY_PATH.get(`${site}:${path}`);
}

/** One site's routes that belong in its sitemap — everything except
 *  `indexable: false`, and nothing from a site that is not live yet. */
export function indexableRoutes(site = 'un') {
    return ROUTES.filter((r) => siteOf(r) === site && r.indexable !== false && isLive(r));
}

/** The routes that get a generated link-preview image: the indexable ones that
 *  name a content file. `/campaign/endorse/document` has neither — it is a
 *  noindex printable with hand-written metadata. */
export function imageRoutes() {
    // Council routes get their images before launch on purpose: a preview card
    // is checkable now, and nothing links to it until the pages are indexable.
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
export function ogSlug(path, site = 'un') {
    const base = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-');
    // Council slugs are prefixed so '/' on both sites cannot share one image.
    return site === 'un' ? base : `${site}-${base}`;
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
export function ogImagePath(path, site = 'un') {
    return `/og/${ogSlug(path, site)}.png`;
}

/** Which site a route entry belongs to — for callers holding a route object. */
export function routeSite(route) {
    return siteOf(route);
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
export function pageMetadata(meta, path, ogType = 'article', site = 'un') {
    const route = BY_PATH.get(`${site}:${path}`);
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
        ...(route.indexable === false || !isLive(route) ? {} : { alternates: { canonical: path } }),
        // A site that is not live yet asks not to be indexed at all — see COUNCIL_LIVE.
        ...(isLive(route) ? {} : { robots: { index: false, follow: false } }),
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
            siteName: SITE_NAMES[site],
            locale: 'en_US',
            ...(route.content
                ? {
                      images: [
                          {
                              url: ogImagePath(path, site),
                              width: OG_WIDTH,
                              height: OG_HEIGHT,
                              // Describes the image's own words, because that
                              // is all the image contains — the headline, the
                              // wordmark and the domain. ⚠ Built from
                              // ogHeadline(), NOT the raw ogTitle: most
                              // ogTitles already end in "— UNNYC", so
                              // appending it produced "Contact — UNNYC —
                              // UNNYC" on eight of the twelve routes.
                              alt: `${ogHeadline(meta.ogTitle)} — ${SITE_NAMES[site]}`,
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
