/**
 * Page metadata — one shape for every route.
 *
 * All thirteen routes want the same four things, and each page used to spell
 * all four out itself. That is how the site shipped with `metadataBase` set in
 * layout.js and NOT ONE canonical tag emitted anywhere: the field simply wasn't
 * in the block being copied from page to page, and nothing fails when it's
 * missing. `metadataBase` on its own emits nothing — it only resolves the
 * relative URLs that `alternates.canonical` and `openGraph.url` provide.
 *
 * `path` is the route's own URL, written ONCE per page and used for BOTH the
 * canonical and og:url — the two used to be typed separately, which is a wrong
 * canonical waiting to happen. It can't be derived: `generateMetadata` gets no
 * pathname for a static route.
 *
 * Pass a path, never an absolute URL. Next resolves it against `metadataBase`
 * (https://un.opensource.nyc — see layout.js), so the host lives in exactly one
 * place and a future move is one line.
 *
 * WHY CANONICALS EARN THEIR KEEP HERE: `opensource.nyc`, `www.opensource.nyc`
 * and `unnyc.wegov.nyc` all 307 into `un.opensource.nyc`. A redirect only helps
 * a crawler that follows it — an inbound link already indexed against a legacy
 * host has nothing else telling it which URL wins. The redirects are also 307s
 * on purpose (see next.config.mjs), and a temporary redirect passes no ranking
 * signal, so the canonical is the only durable statement of the real URL.
 *
 * `ogType` defaults to 'article'; the three hub-ish pages (/, /campaign,
 * /contact) pass 'website' explicitly, as they always did.
 */
export function pageMetadata(meta, path, ogType = 'article') {
    return {
        title: meta.title,
        description: meta.description,
        alternates: { canonical: path },
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
            type: ogType,
            url: path,
        },
    };
}
