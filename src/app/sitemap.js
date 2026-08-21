import { SITE_URL, indexableRoutes } from '@/lib/seo';

/**
 * /sitemap.xml — generated from `ROUTES` in src/lib/seo.js, the same list that
 * supplies every page's canonical. One list on purpose: a canonical the sitemap
 * doesn't mention, or a sitemap entry with no canonical, is a contradiction a
 * crawler has to resolve on our behalf.
 *
 * `/campaign/endorse/document` is absent because it is `noindex` — asking a
 * crawler to index a page that tells it not to is the same contradiction from
 * the other end. It carries `indexable: false` in ROUTES.
 *
 * REDIRECTS ARE NOT LISTED and must never be added: `/start/principles` 308s to
 * `/principles/document`, and three legacy hostnames fold into this one (see
 * next.config.mjs). A sitemap entry for a redirect asks a crawler to index a URL
 * we are telling it to leave.
 *
 * ⚠ NO `lastModified`. The obvious source is the content file's mtime, but a
 * fresh CI checkout stamps every file at clone time, so each deploy would
 * declare all twelve pages modified — a confident lie, and worse than saying
 * nothing. Add it only with a real per-page date (git commit time for the
 * page's markdown, resolved at build), not a checkout timestamp.
 */
export default function sitemap() {
    return indexableRoutes().map((r) => ({
        url: SITE_URL + (r.path === '/' ? '' : r.path),
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));
}
