import { getContent } from '@/lib/content';
import { SITE_URL, ROUTES, ogImagePath, OG_WIDTH, OG_HEIGHT, ogHeadline } from '@/lib/seo';

/**
 * JSON-LD builders, returning plain objects for <StructuredData> to render.
 *
 * Server-only, like `content.js` — `breadcrumbLd` reads the ancestor pages'
 * content to label their crumbs. Never import this from a "use client" file.
 * Every other builder takes its data as an argument, so the page decides what
 * gets described.
 *
 * ── WHY ────────────────────────────────────────────────────────────────────
 * The site had no structured data on any route. It matters twice over here: for
 * search, and because this campaign's whole job is to be quoted by people and
 * systems weighing what New York should do — and the site holds facts that exist
 * nowhere else in machine-readable form. The UN's own endorser page carries 154
 * logos and ZERO names (every card's title element is empty), so the 150-name
 * transcription on /principles cannot be extracted from the source. Saying so in
 * a way a machine can read is the cheapest part of that.
 *
 * ── THE RULE THAT KEEPS THIS HONEST ────────────────────────────────────────
 * Mark up only what the page actually renders. Verified before writing any of
 * this: all 150 endorser names and all 18 OSPOs are in the server-rendered HTML,
 * not fetched on demand and not hidden behind the client-side pagination. If a
 * list ever starts rendering one page of results server-side, its ItemList has
 * to shrink to match or the markup becomes a claim about content that isn't
 * there.
 *
 * ── WHAT IS DELIBERATELY ABSENT ────────────────────────────────────────────
 * `datePublished` / `dateModified`. There is no per-page date anywhere in this
 * repo — the same reason the sitemap carries no `lastModified`. A build-time
 * timestamp would say every page changed on every deploy, which is worse than
 * silence. Add them when a real date exists in the content.
 *
 * Geo coordinates on the OSPO list. `content/resources.md` has lat/lng for each
 * office, but half carry `locationBasis: 'hq'` — the parent organisation's
 * headquarters, not the office's own address, which is why the map popup marks
 * "(HQ)". Publishing an approximate point as `GeoCoordinates` states a precision
 * the data doesn't have, so only the city is emitted.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** The two organisations behind the campaign, exactly as the footer names and
 *  links them — not a separate description that can drift from the page. */
const PUBLISHERS = [
    { '@type': 'Organization', name: 'WeGovNYC', url: 'https://wegov.nyc' },
    { '@type': 'Organization', name: 'Sarapis', url: 'https://sarapis.org' },
];

function absolute(path) {
    return SITE_URL + (path === '/' ? '' : path);
}

/** Home only. One WebSite/Organization pair for the whole site, keyed by @id so
 *  the other graphs can reference it instead of restating it. */
export function websiteLd({ description }) {
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': ORG_ID,
            name: 'UNNYC',
            url: SITE_URL,
            description,
            // A campaign, not an institution: it has no address, no logo of its
            // own beyond the wordmark, and — per the footer — no affiliation
            // with the UN or any government. Claiming otherwise in markup would
            // contradict the disclaimer the page prints.
            founder: PUBLISHERS,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': SITE_ID,
            name: 'UNNYC',
            url: SITE_URL,
            description,
            inLanguage: 'en-US',
            publisher: { '@id': ORG_ID },
        },
    ];
}

/**
 * Breadcrumbs for a nested route, derived from ROUTES: a path's parent is the
 * path with its last segment removed, and every nested route on this site has
 * its parent in the table (`/campaign/sign` -> `/campaign`, `/resources/guide`
 * -> `/resources`, `/principles/document` -> `/principles`). Returns null for a
 * top-level route, which has nothing to show.
 *
 * Each ancestor's label is read from that route's own content title, so a
 * renamed page renames its own crumb and no label is authored twice.
 */
export function breadcrumbLd(path) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length < 2) return null;

    const trail = ['/'];
    for (let i = 1; i <= segments.length; i += 1) {
        const p = '/' + segments.slice(0, i).join('/');
        if (ROUTES.some((r) => r.path === p)) trail.push(p);
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p === '/' ? 'Home' : crumbLabel(p),
            item: absolute(p),
        })),
    };
}

/** /resources/guide — the one long-form article on the site. */
export function articleLd({ path, headline, description }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        inLanguage: 'en-US',
        mainEntityOfPage: absolute(path),
        image: {
            '@type': 'ImageObject',
            url: SITE_URL + ogImagePath(path),
            width: OG_WIDTH,
            height: OG_HEIGHT,
        },
        author: PUBLISHERS,
        publisher: { '@id': ORG_ID },
        isAccessibleForFree: true,
    };
}

/**
 * The vocabulary on /start as a DefinedTermSet.
 *
 * The best-fitting type on the site: eight terms, each with a definition and an
 * NYC-specific gloss, already single-sourced in `content/start.md` under
 * `concepts.terms` (the same data every `[term](gloss:slug)` link reads). The
 * `nyc` line is appended to the description rather than dropped — it is the half
 * a reader here actually needs, and a definition of "vendor lock-in" without the
 * city context is available anywhere.
 */
export function glossaryLd({ terms, path, name }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name,
        url: absolute(path),
        inLanguage: 'en-US',
        hasDefinedTerm: terms.map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            description: [t.def, t.nyc].filter(Boolean).join(' '),
            ...(t.slug ? { url: `${absolute(path)}#${t.slug}` } : {}),
        })),
    };
}

/**
 * The 150 UN endorsers as an ItemList.
 *
 * Names only, because that is all the snapshot holds: the source page has no
 * URLs to carry, and this site deliberately shows no logos (third-party
 * trademarks — the UN displaying them grants no onward rights). The count comes
 * from the array, never from a literal.
 *
 * ⚠ TWO PROPERTIES WERE PULLED BACK OUT of this after checking schema.org
 * rather than trusting that they looked right:
 *   • `isBasedOn` for the source page — it is a CreativeWork property, and
 *     ItemList is an Intangible, not a CreativeWork. The provenance is in
 *     `description` instead, which is Thing-level and valid anywhere.
 *   • `additionalType` for each organisation's sector — that property expects a
 *     URI from an external vocabulary, not a bare label like "Companies". There
 *     is no clean schema.org property for a string sector on Organization, so
 *     the sectors stay where they already work: the visible filter chips, whose
 *     counts are derived from this same array.
 * Both were valid-looking JSON that a validator would have flagged and a
 * consumer would have quietly mis-read.
 */
export function endorserListLd({ organizations, path, name, source, sourceUrl }) {
    const provenance = [
        `${organizations.length} organizations that have publicly endorsed the UN Open Source Principles.`,
        source && sourceUrl ? `Transcribed from ${source} (${sourceUrl}).` : null,
    ]
        .filter(Boolean)
        .join(' ');

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        description: provenance,
        url: absolute(path),
        numberOfItems: organizations.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: organizations.map((o, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'Organization', name: o.organization },
        })),
    };
}

/** The 18 public sector OSPOs as an ItemList. Richer than the endorsers — each
 *  has a homepage, a description and a city. See the note above about why no
 *  coordinates are emitted. */
export function ospoListLd({ groups, path, name }) {
    const items = groups.flatMap((g) => g.items ?? []);
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url: absolute(path),
        numberOfItems: items.length,
        itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: items.map((o, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Organization',
                name: o.name,
                ...(o.url ? { url: o.url } : {}),
                ...(o.description ? { description: o.description } : {}),
                ...(o.email ? { email: o.email } : {}),
                ...(o.city
                    ? { address: { '@type': 'PostalAddress', addressLocality: o.city } }
                    : {}),
            },
        })),
    };
}

/** A route's own headline, for a crumb label: the content title if the page has
 *  one, else its sharing title with the "— UNNYC" affix stripped. Falls back to
 *  the last path segment so a crumb is never empty. */
function crumbLabel(path) {
    const route = ROUTES.find((r) => r.path === path);
    if (route?.crumb) return route.crumb;
    if (route?.content) {
        const doc = getContent(route.content);
        const label = doc?.title || ogHeadline(doc?.meta?.ogTitle);
        if (label) return label;
    }
    return path.split('/').filter(Boolean).pop() ?? 'Home';
}
