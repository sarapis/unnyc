/**
 * Refresh the "government open source catalogues" country-fill layer from GovOSS.
 *
 *   node scripts/fetch-govoss-catalogues.mjs
 *
 * Writes TWO files, deliberately separate:
 *
 *   content/govoss-catalogues.json     counts + catalogue metadata — reviewable in a diff
 *   content/govoss-countries.geo.json  GovOSS's own country shapes — never readable in a diff
 *
 * Splitting them is the point. The CTFG snapshot is one file because a diff of 62
 * projects is readable; a diff of boundary coordinates never is, and burying the
 * counts inside it would hide the only part a human should actually review.
 *
 * A SNAPSHOT, not a live fetch — same three reasons as the CTFG layer: the map must
 * not go half-empty if GovOSS is slow, the data deserves a human gate before it goes
 * on an advocacy page, and a snapshot is reviewable where a runtime fetch is not.
 * Nothing on the site requests govoss.cat; only this script does.
 *
 * ⚠ WHAT COMES FROM GOVOSS NOW (since 2026-09-28), AND WHAT STILL LIVES HERE.
 * GovOSS publishes its own map file, /catalogues.geo.json: which countries have a
 * harvested catalogue, which catalogues belong to each, the shapes (Natural Earth
 * 1:50m, France already trimmed to metropolitan + Corsica), what it could not draw,
 * and both licences. This script used to rebuild all of that from Natural Earth
 * itself — its own ISO_A2 "-99" fallback, its own French Guiana trim, its own list
 * of which codes were not countries — so the join logic existed twice, in two repos.
 * It now READS it. What stays here:
 *   - the headline totals and the per-country counts, from /meta.json (see below);
 *   - each catalogue's own site and harvest route, from /sources.json, because the
 *     popups link to the government's catalogue rather than to a GovOSS filter;
 *   - the decision not to draw GovOSS's EU outline or its two city points (see
 *     NOT_DRAWN_HERE) — an editorial call about THIS map, not a fact about the data;
 *   - how the shapes are USED. UnnycWorldMap draws the world-atlas 1:110m polygons,
 *     not these; GovOSS's shapes only decide WHICH PARTS of an atlas country are
 *     shaded (see splitByShape in UnnycWorldMap). Drawing 1:50m over a 1:110m base doubled every shaded
 *     border and would have added ~90 KB to every / and /start response.
 *
 * ⚠ NEVER DERIVE A PER-COUNTRY COUNT BY ADDING UP catalogues[].entries. GovOSS's
 * map file says why in its own `about`: an entry listed by two catalogues counts
 * under each. Sweden's three catalogues sum to 178 and GovOSS's Sweden is 177;
 * France's sum to 675 and GovOSS's France is 665. The per-country figure comes from
 * meta.json's `countries`, as it always has.
 *
 * ⚠ THE LICENCE IS READ, NEVER WRITTEN. It comes from the map file's `licence`
 * object and must match LICENCES below exactly, or this throws. A literal licence
 * in a fetch script is how this repo once published a stale CC BY-NC-SA claim for
 * CTFG on a live page; a refresh re-stamped the old value every time.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';

const GOVOSS = 'https://govoss.cat';
const OUT_DATA = new URL('../content/govoss-catalogues.json', import.meta.url);
const OUT_GEO = new URL('../content/govoss-countries.geo.json', import.meta.url);
const ATLAS = new URL('../content/world-atlas.json', import.meta.url);

/**
 * The licence strings this script knows how to render, verbatim from the map file's
 * `licence` object, mapped to the short form the credit line shows. ANY other value
 * throws: a new licence is a fact to read and decide on, not something to parse.
 */
const LICENCES = {
    properties: {
        'CC BY 4.0, govoss (https://govoss.cat)': { licence: 'CC BY 4.0', sourceUrl: 'https://govoss.cat' },
    },
    geometry: {
        'Natural Earth, public domain': { boundaries: 'Natural Earth (public domain)', boundariesShort: 'Natural Earth' },
    },
};

/**
 * GovOSS draws these; this map deliberately does not. The stacking order is the
 * argument (docs/MAP-LAYERS.md): the policy markers are the figure and the inventory
 * is the ground, so the ground should not grow new outlines or dots of its own.
 *   union — an EU27 outline would draw a line round most of the map's subject and
 *           read as a claim about the EU, for a catalogue of EU INSTITUTIONS'
 *           software (code.europa.eu), not the member states'.
 *   city  — Munich and Helsingborg. Both catalogues are already in their country's
 *           popup (DE, SE), and Munich already carries a policy marker, so a GovOSS
 *           dot there would sit under the figure it is meant to support.
 * Any OTHER kind throws, so a new kind is a decision rather than a silent drop.
 */
const NOT_DRAWN_HERE = {
    union: 'EU institutions, not a member state — GovOSS draws an EU27 outline; this map does not',
    city: 'already in its country\'s popup — GovOSS draws a city point; this map does not',
};

const die = (msg) => {
    throw new Error(`fetch-govoss-catalogues: ${msg}`);
};

const j = async (url) => {
    const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) die(`${url} → ${r.status}`);
    return r.json();
};

const [geo, meta, sources] = await Promise.all([
    j(`${GOVOSS}/catalogues.geo.json`),
    j(`${GOVOSS}/meta.json`),
    j(`${GOVOSS}/sources.json`),
]);

// ---------------------------------------------------------------- shape of the file
for (const k of ['about', 'generated_at', 'licence', 'source', 'trimmed', 'not_drawn', 'features'])
    if (geo[k] == null) die(`catalogues.geo.json has no \`${k}\``);
if (geo.type !== 'FeatureCollection') die(`catalogues.geo.json is a ${geo.type}, not a FeatureCollection`);
for (const k of ['geometry', 'properties']) if (typeof geo.licence[k] !== 'string') die(`licence.${k} missing`);
for (const k of ['geometry', 'geometry_sha256']) if (typeof geo.source[k] !== 'string') die(`source.${k} missing`);
for (const k of ['trimmed', 'not_drawn', 'features']) if (!Array.isArray(geo[k])) die(`\`${k}\` is not an array`);
if (!meta?.counts?.entries || !Array.isArray(meta.countries)) die('meta.json has no counts.entries / countries');
if (!Array.isArray(sources?.ingested) || !sources.ingested.length) die('sources.json has no ingested catalogues');

/* The counts (meta.json) and the shapes (catalogues.geo.json) must describe the SAME
 * harvest, or a popup could name a catalogue the headline total does not include. */
if (geo.generated_at !== meta.generated_at)
    die(`catalogues.geo.json (${geo.generated_at}) and meta.json (${meta.generated_at}) are from different harvests — re-run once GovOSS has finished publishing`);

// ---------------------------------------------------------------- licence
const props = LICENCES.properties[geo.licence.properties];
const geom = LICENCES.geometry[geo.licence.geometry];
if (!props) die(`unexpected licence.properties "${geo.licence.properties}" — read govoss.cat, then add it to LICENCES deliberately`);
if (!geom) die(`unexpected licence.geometry "${geo.licence.geometry}" — read govoss.cat, then add it to LICENCES deliberately`);

// ---------------------------------------------------------------- features
const byKind = { country: [], union: [], city: [] };
for (const f of geo.features) {
    const kind = f?.properties?.kind;
    if (!byKind[kind]) die(`feature of unknown kind "${kind}" — decide whether this map draws it, then add it`);
    byKind[kind].push(f);
}
if (!byKind.country.length) die('zero country features');

const sourceByKey = new Map(sources.ingested.map((s) => [s.key, s]));
const countByCode = new Map(meta.countries.map((c) => [c.code, c.count]));

const catalogueOf = (c, where) => {
    const s = sourceByKey.get(c.key);
    if (!s) die(`${where}: catalogue "${c.key}" is not in sources.json's ingested list`);
    if (typeof c.entries !== 'number') die(`${where}: catalogue "${c.key}" has no entries count`);
    return { key: c.key, label: c.label ?? s.label, site: s.site, entries: c.entries, route: s.route };
};

const countries = byKind.country.map((f) => {
    const { code, name, catalogues } = f.properties;
    if (!/^[A-Z]{2}$/.test(code ?? '')) die(`country feature with code "${code}"`);
    if (!name) die(`${code}: country feature has no name`);
    if (!Array.isArray(catalogues) || !catalogues.length) die(`${code}: country feature has no catalogues`);
    if (!['Polygon', 'MultiPolygon'].includes(f.geometry?.type)) die(`${code}: geometry is ${f.geometry?.type}`);
    /* GovOSS's own per-country figure, de-duplicated across that country's
     * catalogues. NOT the sum of catalogues[].entries — see the header. */
    const entries = countByCode.get(code);
    if (typeof entries !== 'number') die(`${code}: has a feature but no count in meta.json`);
    return {
        code,
        name,
        entries,
        catalogues: catalogues.map((c) => catalogueOf(c, code)).sort((a, b) => b.entries - a.entries),
    };
});
const drawnCodes = new Set(countries.map((c) => c.code));

// Everything GovOSS does NOT give a country shape: its union outline, and not_drawn.
const excluded = [
    ...byKind.union.map((f) => ({
        code: f.properties.code,
        reason: NOT_DRAWN_HERE.union,
        entries: countByCode.get(f.properties.code) ?? die(`${f.properties.code}: union feature has no count in meta.json`),
        catalogues: (f.properties.catalogues ?? []).map((c) => catalogueOf(c, f.properties.code)),
    })),
    ...geo.not_drawn.map((c) => {
        const code = c.key?.split('/')[0];
        return {
            code,
            reason: `${c.label} — GovOSS has no shape for it`,
            entries: countByCode.get(code) ?? die(`not_drawn "${c.key}" has no count in meta.json`),
            catalogues: [catalogueOf(c, code)],
        };
    }),
];
const excludedCodes = new Set(excluded.map((e) => e.code));

/* A catalogue country with no feature: meta.json counts entries under a code the
 * map file gives no shape and does not explain. The old script's ISO "-99" trap
 * produced exactly this, silently, for France. */
const shapeless = meta.countries.filter((c) => !drawnCodes.has(c.code) && !excludedCodes.has(c.code));
if (shapeless.length) die(`meta.json counts entries under ${shapeless.map((c) => c.code).join(', ')}, which have no feature and are not in not_drawn`);

/* Every harvested catalogue must land somewhere: a country, the union, not_drawn.
 * (City features only repeat catalogues their country already lists.) */
const placed = new Set([...countries, ...excluded].flatMap((c) => c.catalogues.map((x) => x.key)));
for (const f of byKind.city)
    for (const c of f.properties.catalogues ?? [])
        if (!placed.has(c.key)) die(`city catalogue "${c.key}" is not in any country's catalogues`);
const unplaced = sources.ingested.filter((s) => !placed.has(s.key));
if (unplaced.length) die(`catalogues in sources.json with nowhere on the map: ${unplaced.map((s) => s.key).join(', ')}`);

// ---------------------------------------------------------------- the atlas join
/* UnnycWorldMap shades atlas polygons matched BY NAME. A GovOSS name the atlas does
 * not have would unshade a country with a green build — check it here, where the
 * mismatch is introduced, as well as in fetch-world-atlas.mjs. */
const topo = JSON.parse(readFileSync(ATLAS, 'utf8')).topology;
const atlasByName = new Map(feature(topo, topo.objects.countries).features.map((f) => [f.properties?.name, f]));
const unmatched = countries.filter((c) => !atlasByName.has(c.name));
if (unmatched.length) die(`GovOSS country names with no polygon in content/world-atlas.json: ${unmatched.map((c) => `${c.code} "${c.name}"`).join(', ')}`);

/* Which atlas parts GovOSS's shapes leave UNSHADED — the same bounding-box test
 * UnnycWorldMap's splitByShape() applies. Printed on every refresh so the one
 * editorial effect of GovOSS's trims on this map (today: French Guiana) is read,
 * not assumed; a country left with NO shaded part would vanish from the fill. */
const bbox = (ring) => ring.reduce((a, [x, y]) => [Math.min(a[0], x), Math.min(a[1], y), Math.max(a[2], x), Math.max(a[3], y)], [Infinity, Infinity, -Infinity, -Infinity]);
const partsOf = (g) => (g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]);
const unshadedParts = [];
for (const f of byKind.country) {
    const boxes = partsOf(f.geometry).map((p) => bbox(p[0]));
    const atlasParts = partsOf(atlasByName.get(f.properties.name).geometry).map((p) => bbox(p[0]));
    const out = atlasParts.filter((b) => !boxes.some((k) => b[0] <= k[2] && b[2] >= k[0] && b[1] <= k[3] && b[3] >= k[1]));
    if (out.length === atlasParts.length) die(`${f.properties.code}: no atlas part meets GovOSS's shape — the country would drop out of the fill`);
    for (const b of out) unshadedParts.push(`${f.properties.code} [${b.map((n) => n.toFixed(1)).join(', ')}]`);
}

// ---------------------------------------------------------------- write
countries.sort((a, b) => b.entries - a.entries);
const data = {
    source: 'GovOSS',
    sourceUrl: props.sourceUrl,
    sourceApi: [`${GOVOSS}/catalogues.geo.json`, `${GOVOSS}/meta.json`, `${GOVOSS}/sources.json`],
    // Read from catalogues.geo.json's `licence` object — never typed. See LICENCES.
    licence: props.licence,
    licenceRaw: geo.licence,
    boundaries: geom.boundaries,
    // Short form for the credit line. Public domain carries no attribution
    // requirement, so the UI names the source as a courtesy.
    boundariesShort: geom.boundariesShort,
    shapesFrom: `${geo.source.geometry} (sha256 ${geo.source.geometry_sha256.slice(0, 12)}…), via GovOSS`,
    generatedBy: 'scripts/fetch-govoss-catalogues.mjs',
    generated: new Date().toISOString().slice(0, 10),
    govossGenerated: geo.generated_at.slice(0, 10),
    // GovOSS's own headline, and the only total safe to render. It is NOT the sum
    // of `countries` below, in BOTH directions at once: GLOBAL/EU entries get no
    // shape (pushing the sum down), while an entry listed by catalogues in two
    // countries counts under each (pushing it up). Never add the fills up.
    totalEntries: meta.counts.entries,
    // What the shaded countries actually cover, so the UI can say so without
    // arithmetic of its own.
    countryAttributedEntries: countries.reduce((n, c) => n + c.entries, 0),
    countryCount: countries.length,
    catalogueCount: sources.ingested.length,
    // GovOSS's own editorial trims, recorded beside the counts so they are reviewed
    // with them. Applied by GovOSS, not here.
    trimmed: geo.trimmed,
    excluded,
    // GovOSS features this map chooses not to draw — see NOT_DRAWN_HERE.
    notDrawnHere: byKind.city.map((f) => ({
        kind: 'city',
        code: f.properties.code,
        catalogues: (f.properties.catalogues ?? []).map((c) => c.key),
        reason: NOT_DRAWN_HERE.city,
    })),
    countries,
};

/* The geometry file is GovOSS's country features verbatim, minus the catalogue
 * lists (those are in the counts file). It is read server-side and reduced to part
 * bounding boxes before anything reaches the browser — see getGovossCatalogues(). */
const features = byKind.country
    .map((f) => ({ type: 'Feature', properties: { code: f.properties.code, name: f.properties.name }, geometry: f.geometry }))
    .sort((a, b) => a.properties.code.localeCompare(b.properties.code));

writeFileSync(OUT_DATA, JSON.stringify(data, null, 2) + '\n');
writeFileSync(OUT_GEO, JSON.stringify({ type: 'FeatureCollection', features }) + '\n');

const kb = (u) => (Buffer.byteLength(JSON.stringify(u)) / 1024).toFixed(0);
console.log(`wrote ${countries.length} countries / ${data.catalogueCount} catalogues / ${data.totalEntries} entries → content/govoss-catalogues.json (${kb(data)} KB)`);
console.log(`wrote ${features.length} shapes → content/govoss-countries.geo.json (${kb({ features })} KB)`);
for (const e of excluded) console.log(`  excluded ${e.code} (${e.entries} entries) — ${e.reason}`);
for (const n of data.notDrawnHere) console.log(`  not drawn: ${n.kind} ${n.code} ${n.catalogues.join(', ')}`);
for (const t of geo.trimmed) console.log(`  trimmed by GovOSS: ${t.code} — ${t.reason}`);
console.log(`  atlas parts left unshaded: ${unshadedParts.join('; ') || 'none'}`);
