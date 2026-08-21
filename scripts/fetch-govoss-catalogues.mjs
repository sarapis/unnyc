/**
 * Refresh the "government open source catalogues" country-fill layer from GovOSS.
 *
 *   node scripts/fetch-govoss-catalogues.mjs
 *
 * Writes TWO files, deliberately separate:
 *
 *   content/govoss-catalogues.json   counts + catalogue metadata — reviewable in a diff
 *   content/govoss-countries.geo.json  the polygons — geometry, regenerated rarely
 *
 * Splitting them is the point. The CTFG snapshot is one file because a diff of 62
 * projects is readable; a diff of country boundary coordinates never is, and burying
 * the counts inside it would hide the only part a human should actually review.
 *
 * A SNAPSHOT, not a live fetch — same three reasons as the CTFG layer: the map must
 * not go half-empty if GovOSS is slow, the data deserves a human gate before it goes
 * on an advocacy page, and a snapshot is reviewable where a runtime fetch is not.
 *
 * GovOSS catalogue data is CC BY 4.0 — its own footer: "Catalogue data CC BY 4.0;
 * code MIT. Individual entries remain under the terms of their own sources."
 * Attribution is a licence term. Boundaries are Natural Earth, public domain.
 *
 * ⚠ THIS LICENCE IS A LITERAL HERE, AND THAT IS THE RISK THE CTFG SCRIPT JUST GOT
 * BITTEN BY: it asserted CC BY-NC-SA long after CTFG had relicensed, and a refresh
 * re-stamped the stale value every time. That script now reads the licence off the
 * site (`detectLicence()`); this one cannot use the same trick, because GovOSS
 * publishes NO `rel="license"` anchor — the only Creative Commons strings on its
 * pages are facet values for the licences of the catalogued PROJECTS, which is a
 * different fact entirely and would parse into a confidently wrong answer.
 * Verified by hand against the footer on 2026-08-21. Re-read it when you refresh,
 * and move the date.
 */
import { writeFileSync } from 'node:fs';

const GOVOSS = 'https://govoss-catalog.vercel.app';
const NE =
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const OUT_DATA = new URL('../content/govoss-catalogues.json', import.meta.url);
const OUT_GEO = new URL('../content/govoss-countries.geo.json', import.meta.url);

/**
 * GovOSS reports these in `countries`, but they are not countries and cannot be
 * polygons. Excluded from the fill and surfaced in the credit line instead, so the
 * entries are not silently dropped from the totals a reader sees.
 */
const NOT_A_COUNTRY = {
    GLOBAL: 'Digital Public Goods Registry — global, not a national catalogue',
    EU: 'code.europa.eu — EU institutions, not a member state',
};

/**
 * Parts of a country's geometry to leave unpainted, as [minLon, minLat, maxLon, maxLat]
 * of what to KEEP. Editorial, not a correction: Natural Earth is right, and these are
 * genuinely the country.
 *
 * ⚠ EXPLICIT AND PER-COUNTRY, never a heuristic. The obvious rule — "drop parts far
 * from the main landmass" — destroys this map. Canada is 30 parts and 27 of them sit
 * >15° from the mainland: the Arctic archipelago, Newfoundland, Nova Scotia,
 * Vancouver Island. Italy's outliers are Sicily and Sardinia. A distance threshold
 * that trims French Guiana also trims most of Canada, and it would look like a
 * rendering glitch rather than a decision.
 *
 * Each entry has to be argued for on its own, and the dropped parts are recorded in
 * the output's `trimmed` array so the choice is visible where the counts are reviewed.
 */
const TRIM = {
    FR: {
        keep: [-10, 40, 12, 52],
        reason:
            'French Guiana (2°N, 53°W) is France and Natural Earth is correct to include it, ' +
            'but on a map arguing about European government catalogues a shaded patch in ' +
            'South America reads as an error. Metropolitan France and Corsica only.',
    },
};

const j = async (url) => {
    const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`${url} → ${r.status}`);
    return r.json();
};

const [meta, sources, ne] = await Promise.all([j(`${GOVOSS}/meta.json`), j(`${GOVOSS}/sources.json`), j(NE)]);

// ---------------------------------------------------------------- the data
const byCountry = new Map();
for (const { code, count } of meta.countries) {
    if (NOT_A_COUNTRY[code]) continue;
    byCountry.set(code, { code, entries: count, catalogues: [] });
}

for (const s of sources.ingested) {
    const c = byCountry.get(s.country);
    if (!c) continue; // GLOBAL / EU, already excluded above
    c.catalogues.push({ label: s.label, site: s.site, entries: s.entries, route: s.route });
}

// A country in `countries` with no catalogue in `ingested` would mean an entry was
// attributed to a country nobody harvests — a real inconsistency upstream, not
// something to paper over with an empty popup.
const orphans = [...byCountry.values()].filter((c) => !c.catalogues.length);
if (orphans.length) throw new Error(`countries with no catalogue: ${orphans.map((o) => o.code).join(', ')}`);

for (const c of byCountry.values()) c.catalogues.sort((a, b) => b.entries - a.entries);

// ---------------------------------------------------------------- the geometry
/**
 * ⚠ Natural Earth's ISO_A2 is "-99" for several countries — France and Norway are
 * the well-known ones, and Taiwan is disputed-tagged too. Matching on ISO_A2 alone
 * silently loses France, which is the LARGEST catalogue here (676 entries), so the
 * failure would look like a rendering bug rather than a join bug. Fall back through
 * the other ISO fields, then fail loudly on anything still unmatched.
 */
const iso = (p) => {
    for (const k of ['ISO_A2_EH', 'ISO_A2', 'WB_A2', 'ADM0_A3']) {
        const v = p[k];
        if (v && v !== '-99' && v.length === 2) return v;
    }
    return null;
};

const round = (n) => Math.round(n * 100) / 100; // ~1.1 km; this renders at zoom 2-6
const roundGeom = (g) => (Array.isArray(g[0]) ? g.map(roundGeom) : [round(g[0]), round(g[1])]);

const partBbox = (part, acc = [Infinity, Infinity, -Infinity, -Infinity]) => {
    if (typeof part[0] === 'number') {
        return [
            Math.min(acc[0], part[0]),
            Math.min(acc[1], part[1]),
            Math.max(acc[2], part[0]),
            Math.max(acc[3], part[1]),
        ];
    }
    return part.reduce((a, x) => partBbox(x, a), acc);
};
const intersects = (b, k) => b[0] <= k[2] && b[2] >= k[0] && b[1] <= k[3] && b[3] >= k[1];

const features = [];
const trimmed = [];
for (const f of ne.features) {
    const code = iso(f.properties);
    if (!code || !byCountry.has(code)) continue;
    const name = f.properties.NAME_EN || f.properties.NAME || code;

    let type = f.geometry.type;
    let coords = f.geometry.coordinates;
    const rule = TRIM[code];
    if (rule) {
        const parts = type === 'MultiPolygon' ? coords : [coords];
        const kept = parts.filter((p) => intersects(partBbox(p), rule.keep));
        const dropped = parts.length - kept.length;
        // Trimming everything would silently blank a country. Louder than a blank map.
        if (!kept.length) throw new Error(`${code}: TRIM.keep matched no part of the geometry`);
        if (dropped) {
            trimmed.push({ code, name, partsDropped: dropped, partsKept: kept.length, reason: rule.reason });
            type = kept.length > 1 ? 'MultiPolygon' : 'Polygon';
            coords = kept.length > 1 ? kept : kept[0];
        }
    }

    features.push({
        type: 'Feature',
        properties: { code, name },
        geometry: { type, coordinates: roundGeom(coords) },
    });
}

const missing = [...byCountry.keys()].filter((c) => !features.some((f) => f.properties.code === c));
if (missing.length) throw new Error(`no polygon matched for: ${missing.join(', ')} — check the ISO_A2 "-99" fallback`);

features.sort((a, b) => a.properties.code.localeCompare(b.properties.code));

// ---------------------------------------------------------------- write
const countries = [...byCountry.values()].sort((a, b) => b.entries - a.entries);
const data = {
    source: 'GovOSS',
    sourceUrl: 'https://govoss-catalog.vercel.app',
    sourceApi: `${GOVOSS}/meta.json`,
    licence: 'CC BY 4.0',
    boundaries: 'Natural Earth 1:110m (public domain)',
    // Short form for the credit line. Public domain carries no attribution
    // requirement, so the UI names the source as a courtesy and leaves the version
    // and licence to this file. Stored rather than derived by string surgery in JSX.
    boundariesShort: 'Natural Earth',
    generatedBy: 'scripts/fetch-govoss-catalogues.mjs',
    generated: new Date().toISOString().slice(0, 10),
    govossGenerated: meta.generated_at.slice(0, 10),
    // GovOSS's own headline, and the only total safe to render. It is NOT the sum
    // of `countries` below, in BOTH directions at once: 256 entries sit under
    // GLOBAL/EU and get no polygon (pushing the sum down), while an entry listed by
    // catalogues in two countries counts under each (pushing it up). Today that is
    // 2,619 summed against 2,772 actual. Never add the fills up for a headline.
    totalEntries: meta.counts.entries,
    // What the 13 polygons actually cover, so the UI can say so without arithmetic.
    countryAttributedEntries: countries.reduce((n, c) => n + c.entries, 0),
    countryCount: countries.length,
    catalogueCount: sources.ingested.length,
    // Editorial trims to the geometry — see TRIM. Recorded beside the counts so the
    // decision is reviewed with them, rather than hidden in the polygon file.
    trimmed,
    excluded: Object.entries(NOT_A_COUNTRY).map(([code, reason]) => ({
        code,
        reason,
        entries: meta.countries.find((c) => c.code === code)?.count ?? 0,
    })),
    countries,
};

writeFileSync(OUT_DATA, JSON.stringify(data, null, 2) + '\n');
writeFileSync(OUT_GEO, JSON.stringify({ type: 'FeatureCollection', features }) + '\n');

const kb = (u) => (Buffer.byteLength(JSON.stringify(u)) / 1024).toFixed(0);
console.log(
    `wrote ${countries.length} countries / ${data.catalogueCount} catalogues ` +
        `→ content/govoss-catalogues.json (${kb(data)} KB)`
);
console.log(`wrote ${features.length} polygons → content/govoss-countries.geo.json (${kb({ features })} KB)`);
for (const e of data.excluded) console.log(`  excluded ${e.code} (${e.entries} entries) — ${e.reason}`);
for (const t of trimmed) console.log(`  trimmed ${t.code}: dropped ${t.partsDropped} part(s), kept ${t.partsKept} — ${t.reason}`);
