/**
 * Refresh the world-boundary snapshot the storyscroller map draws.
 *
 *   node scripts/fetch-world-atlas.mjs
 *
 * Writes ONE file:
 *
 *   content/world-atlas.json   Natural Earth 1:110m country boundaries, as TopoJSON
 *
 * WHY THIS SCRIPT EXISTS. `UnnycWorldMap` used to `fetch()` these boundaries from
 * cdn.jsdelivr.net at runtime, on every visit to `/` and `/start` — the site's two
 * most important pages. That is the one thing this repo's snapshot doctrine exists
 * to prevent, and the CARTO episode is exactly the bill: their free basemap went
 * behind an API key and kept returning HTTP 200 with a valid PNG, every tile
 * stamped "API KEY REQUIRED", defacing /start for an unknown period with no error
 * for any monitor to catch. A third-party freebie can degrade without failing.
 * jsdelivr blocked or slow meant a map with no countries; now it means nothing.
 *
 * ⚠ THE OUTPUT IS NOT REVIEWABLE IN A DIFF, and that is why the wrapper exists.
 * A diff of boundary coordinates is noise no human reads — the same reason
 * fetch-govoss-catalogues.mjs writes its counts to a separate file. There are no
 * counts to separate out here, so instead the reviewable facts are lifted into
 * named fields at the top of the file: `countryCount` and `sha256`. If a refresh
 * changes the geometry, those two lines change with it, and a reviewer has
 * something to actually look at.
 *
 * LICENCE. The boundary data is Natural Earth 1:110m — public domain, no
 * attribution required. `world-atlas` is Mike Bostock's ISC-licensed packaging of
 * it; nothing of his is redistributed here beyond the topology itself.
 * ⚠ Deliberately, NO licence string in the output is read by the page. The credit
 * under the map says "boundaries: Natural Earth", and it reads that from the
 * GovOSS snapshot's `boundariesShort` — the same Natural Earth 1:110m data, so the
 * rendered credit is already correct and this file adds no claim to it. That is on
 * purpose: a hardcoded licence literal in a fetch script is precisely how this repo
 * published a stale CC BY-NC-SA claim for CTFG on a live page for two weeks. The
 * fields below record where the bytes came from, not what a reader is told.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const VERSION = '2.0.2';
const ATLAS = `https://cdn.jsdelivr.net/npm/world-atlas@${VERSION}/countries-110m.json`;

const OUT = new URL('../content/world-atlas.json', import.meta.url);
const GOVOSS_GEO = new URL('../content/govoss-countries.geo.json', import.meta.url);

/**
 * Natural Earth ships 177 countries at 1:110m. Bands, not an equality check: the
 * point is to catch a truncated download or a differently-scoped file, not to fail
 * because a country was added or merged upstream.
 */
const MIN_COUNTRIES = 160;
const MAX_COUNTRIES = 200;

const die = (msg) => {
    console.error(`\n✗ ${msg}\n`);
    process.exit(1);
};

const atlas = await fetch(ATLAS, { signal: AbortSignal.timeout(60000) })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${ATLAS} → ${r.status}`))))
    .catch((e) => die(`could not fetch the atlas: ${e.message}`));

/* ---- validate, and THROW rather than write something plausible ----------------
 * Every check below guards a specific way the map fails silently. A snapshot that
 * writes anyway is worse than no snapshot: it looks refreshed. */

if (atlas.type !== 'Topology') die(`expected a TopoJSON Topology, got type "${atlas.type}"`);
if (!atlas.transform) die('no `transform` — this topology is not quantised, and d3-geo needs it to decode arcs');
if (!atlas.objects?.countries?.geometries?.length) die('no `objects.countries.geometries` — nothing to draw');

const geometries = atlas.objects.countries.geometries;

if (geometries.length < MIN_COUNTRIES || geometries.length > MAX_COUNTRIES)
    die(`${geometries.length} countries is outside the expected ${MIN_COUNTRIES}–${MAX_COUNTRIES} — truncated download, or a different file?`);

/* UnnycWorldMap matches the GovOSS country fill on `properties.name`. A geometry
 * with no name cannot be matched and cannot be excluded either (Antarctica is
 * filtered by name), so it would silently paint wrong. */
const unnamed = geometries.filter((g) => !g.properties?.name);
if (unnamed.length) die(`${unnamed.length} geometries have no properties.name — the country fill matches on name and would silently mismatch`);

/* Antarctica is filtered out by name at render time. If it were ever renamed, the
 * map would grow a large white shelf across the bottom. */
if (!geometries.some((g) => g.properties.name === 'Antarctica'))
    die('no country named "Antarctica" — UnnycWorldMap filters it out BY NAME, so a rename means it starts being drawn');

/* THE CHECK THAT MATTERS MOST. The country fill is a name join: govoss.geo gives
 * code→name, and that name is looked up in this atlas. If Natural Earth renames a
 * country, that country's catalogue silently stops being shaded — the same class of
 * bug as the ISO_A2 `-99` trap in fetch-govoss-catalogues.mjs, where matching on
 * the wrong field dropped the LARGEST catalogue on the map and looked like a
 * rendering fault. France is 676 projects; losing it should fail here, loudly. */
const names = new Set(geometries.map((g) => g.properties.name));
const govoss = JSON.parse(readFileSync(GOVOSS_GEO, 'utf8'));
const unmatched = govoss.features
    .map((f) => f.properties)
    .filter((p) => !names.has(p.name));

if (unmatched.length)
    die(
        `${unmatched.length} GovOSS catalogue countries have no polygon in this atlas — their fill would silently vanish:\n` +
            unmatched.map((p) => `    ${p.code}  ${p.name}`).join('\n') +
            '\n  Fix the name bridge in content/govoss-countries.geo.json (or the atlas version) before writing.',
    );

/* ---- trim ---------------------------------------------------------------------
 * `objects.land` is a single dissolved landmass polygon. UnnycWorldMap draws only
 * `objects.countries`, so it is dead weight — small (~1.6 KB, since the shared
 * `arcs` array is what actually costs) but its absence makes the file's one job
 * unambiguous. Antarctica is NOT dropped: it is filtered at render time, and
 * removing a geometry here would require re-indexing every arc reference in the
 * file, which is a real chance of corrupting the topology for ~4 KB. */
const topology = {
    type: atlas.type,
    bbox: atlas.bbox,
    transform: atlas.transform,
    objects: { countries: atlas.objects.countries },
    arcs: atlas.arcs,
};

const sha256 = createHash('sha256').update(JSON.stringify(topology)).digest('hex');

const out = {
    source: 'world-atlas (Natural Earth 1:110m)',
    sourceUrl: ATLAS,
    version: VERSION,
    boundaries: 'Natural Earth 1:110m (public domain)',
    generatedBy: 'scripts/fetch-world-atlas.mjs',
    generated: new Date().toISOString().slice(0, 10),
    countryCount: geometries.length,
    sha256,
    note:
        'Snapshot, not a runtime fetch. Imported directly by ' +
        'src/components/unnyc/primer/UnnycWorldMap.js. The rendered credit under the map ' +
        'says "boundaries: Natural Earth" and reads that from content/govoss-catalogues.json, ' +
        'not from this file.',
    topology,
};

writeFileSync(OUT, JSON.stringify(out));

console.log(`\n✓ content/world-atlas.json`);
console.log(`  ${geometries.length} countries · ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
console.log(`  sha256 ${sha256.slice(0, 16)}…`);
console.log(`  all ${govoss.features.length} GovOSS catalogue countries matched a polygon\n`);
