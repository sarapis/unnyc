import { getContent } from '@/lib/content';
import { imageRoutes, ogSlug, routeMeta } from '@/lib/seo';
import { ogHeadline, renderOgImage, OG_CONTENT_TYPE } from '@/lib/og-image';

/**
 * /og/<slug>.png — one link-preview image per route, drawn from that route's own
 * `meta.ogTitle`.
 *
 * WHY A ROUTE AND NOT NEXT'S `opengraph-image.js` CONVENTION: that convention is
 * per-directory, so twelve routes means twelve near-identical files — and a new
 * route silently gets no preview until somebody remembers to add a thirteenth.
 * That is the exact shape of the bug this site just fixed: thirteen copied
 * metadata blocks, none of which happened to contain a canonical. Here the
 * images are generated FROM `ROUTES`, the same list that drives the canonicals
 * and the sitemap, so adding a route to that table is all it takes — the
 * preview, the canonical and the sitemap entry arrive together or not at all.
 *
 * The cost of not using the convention is that `openGraph.images` has to be set
 * by hand rather than injected — it is one branch in `pageMetadata()`, reading
 * the same route entry, so the two cannot disagree.
 *
 * STATIC. `force-static` plus `generateStaticParams` prerenders every image at
 * build, so nothing renders per request and the fonts are read once. Verify with
 * `.next/server/app/og/*.png` after a build, not by trusting this comment.
 */
export const dynamic = 'force-static';
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
    // `.png` is part of the slug rather than a real extension: crawlers key on
    // Content-Type, but a bare /og/start looks like a page in a log or a paste.
    return imageRoutes().map((r) => ({ slug: `${ogSlug(r.path)}.png` }));
}

export async function GET(request, { params }) {
    const { slug } = await params;
    const route = imageRoutes().find((r) => `${ogSlug(r.path)}.png` === slug);

    // Only reachable if someone requests a slug by hand; every real caller comes
    // from generateStaticParams. 404 rather than a blank image, so a mistyped
    // og:image URL fails visibly in a preview debugger instead of shipping an
    // empty card.
    if (!route) return new Response('Not found', { status: 404 });

    // routeMeta, not doc.meta: two routes share content/principles.md and the
    // document page names its own block, so this is what keeps their previews
    // from being the same image.
    const meta = routeMeta(getContent(route.content), route);
    return renderOgImage(ogHeadline(meta.ogTitle));
}
