import { DATASETS, datasetIndex } from '@/lib/datasets';

/**
 * /data/<slug>.json — the site's published datasets, plus /data/index.json as
 * the catalogue of them.
 *
 * STATIC. `force-static` + `generateStaticParams` prerenders every payload at
 * build, so a consumer hits a file and nothing runs per request.
 *
 * `Access-Control-Allow-Origin: *` because published open data that a browser
 * cannot fetch cross-origin is only half published. Safe here: these are static
 * public files with no credentials and no per-user content — the exact opposite
 * of the CMS endpoints, whose allowlist exists because they accept writes.
 *
 * ⚠ SLUGS ARE PUBLISHED ADDRESSES. Renaming one breaks whatever cited it. Add a
 * new slug instead, and keep the old one working.
 */
export const dynamic = 'force-static';

export function generateStaticParams() {
    return [...Object.keys(DATASETS).map((slug) => ({ slug: `${slug}.json` })), { slug: 'index.json' }];
}

/** Pretty-printed, and deliberately so: these get read by people deciding
 *  whether to trust the data, not only by parsers. */
function json(body) {
    return new Response(JSON.stringify(body, null, 2) + '\n', {
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'access-control-allow-origin': '*',
        },
    });
}

export async function GET(request, { params }) {
    const { slug } = await params;
    const name = slug.replace(/\.json$/, '');

    if (name === 'index') return json(datasetIndex());

    const build = DATASETS[name];
    // Only reachable by hand — every real caller comes from the index or
    // llms.txt. A 404 with the list beats a silent empty object.
    if (!build) {
        return json({
            error: `no dataset '${name}'`,
            available: Object.keys(DATASETS),
            index: '/data/index.json',
        });
    }

    const data = build();
    if (!data) {
        // Fail-soft, like the loaders: a missing snapshot costs its own dataset,
        // never the build.
        return json({ error: `dataset '${name}' is unavailable — its source file is missing or empty` });
    }
    return json(data);
}
