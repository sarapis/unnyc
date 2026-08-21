/**
 * Refresh the curated "government open source programs" map layer from the
 * Civic Tech Field Guide's public API.
 *
 *   node scripts/fetch-ctfg-projects.mjs
 *
 * Writes content/ctfg-gov-open-source.json — a CURATED SNAPSHOT, deliberately not a
 * live fetch:
 *   - the map should not go blank or half-empty if the CTFG API is slow or down;
 *   - CTFG's `orgType` tagging has some noise (see EXCLUDE below), so the set needs a
 *     human gate before it goes on an advocacy page;
 *   - a snapshot is reviewable in a diff, which a runtime fetch never is.
 *
 * Re-run it when you want to pick up new CTFG entries, then read the diff before
 * committing. Attribution is required whatever the licence says — see
 * `detectLicence()` below, which READS the licence off civictech.guide rather than
 * trusting a literal in this file.
 *
 * Query: open-source projects whose organization type is Government / public sector.
 * The /map endpoint gives coordinates; /projects/search gives names + descriptions.
 */
import { writeFileSync } from 'node:fs';

const API = 'https://civictech.guide/api/v1';
const OUT = new URL('../content/ctfg-gov-open-source.json', import.meta.url);
const ORG_TYPE = 'Government / public sector';

/**
 * Tagged `Government / public sector` in CTFG but not actually government-built.
 * Dropped so the layer is defensible on a campaign page. Each with the reason —
 * re-check these if CTFG's tagging is corrected upstream.
 */
const EXCLUDE = {
    'code-for-australia-foresight': 'Code for Australia is a nonprofit; URL is a dead Wayback capture',
    govtrackus: 'run by Civic Impulse LLC, a private company',
    civicspacetech: 'a collection of primers, not a government program',
    civis: 'civis.vote — an Indian nonprofit platform, works with government but is not one',
    'civic-switchboard': 'IMLS-funded academic/public library capacity project',
    'congressional-data-coalition': 'an advocacy coalition lobbying Congress, not a government body',
};

const j = async (path, params) => {
    const url = new URL(API + path);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`${url} → ${r.status}`);
    return r.json();
};

const stripFlag = (s) =>
    (s || '')
        .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '')
        .replace(/\s*\([^)]*\)\s*$/, '')
        .trim();

/**
 * The licences we know how to name, keyed by the path in a creativecommons.org URL.
 * Anything outside this map stops the script rather than being guessed at.
 */
const LICENCES = {
    'by/4.0': 'CC BY 4.0',
    'by-sa/4.0': 'CC BY-SA 4.0',
    'by-nc/4.0': 'CC BY-NC 4.0',
    'by-nc-sa/4.0': 'CC BY-NC-SA 4.0',
    'by-nd/4.0': 'CC BY-ND 4.0',
    'by-nc-nd/4.0': 'CC BY-NC-ND 4.0',
    'zero/1.0': 'CC0 1.0',
};

/**
 * Read CTFG's own licence off their site instead of hardcoding it.
 *
 * ⚠ THIS EXISTS BECAUSE THE HARDCODED VALUE WENT STALE AND NOTHING NOTICED.
 * This script asserted `CC BY-NC-SA 4.0` as a literal. CTFG relicensed to
 * **CC BY 4.0** somewhere between 2026-07-03 and 2026-07-25 (Wayback shows
 * by-nc-sa on the 3rd; the live site, three pages of it, says by/4.0 with an
 * explicit "including commercially"). Our snapshot was generated 2026-08-07 —
 * AFTER the change — so it recorded a licence the licensor had already dropped,
 * and `/start` published that claim under the map for two weeks. Re-running the
 * script would have re-stamped it forever, because the value came from here
 * rather than from them.
 *
 * The lesson generalises: a licence is THEIR fact, not ours. Read it, or record
 * when you last checked. Never state it from memory.
 *
 * Parses the `rel="license"` anchor, which is the machine-readable form the site
 * already publishes for exactly this purpose. THROWS on anything unexpected — a
 * missing anchor, an unknown licence, or two pages disagreeing — because the
 * failure mode being prevented is a confident wrong answer, and a guess here
 * would reintroduce it. If it throws, go and read the site.
 */
async function detectLicence() {
    // Two pages, because one page's footer could be a stale build. They must agree.
    const pages = ['https://civictech.guide/', 'https://civictech.guide/guiding-principles/'];
    const found = new Map();

    for (const page of pages) {
        const r = await fetch(page, { signal: AbortSignal.timeout(60000) });
        if (!r.ok) throw new Error(`licence check: ${page} → ${r.status}`);
        const html = await r.text();

        // rel="license" first (the declared one); fall back to any CC URL on the
        // page, which is how the prose version reads on /guiding-principles.
        const rel = [...html.matchAll(/<a[^>]+rel="[^"]*\blicense\b[^"]*"[^>]*>/gi)]
            .map((m) => m[0].match(/href="([^"]+)"/i)?.[1])
            .filter(Boolean);
        const any = [...html.matchAll(/creativecommons\.org\/(?:licenses|publicdomain)\/([a-z-]+\/[0-9.]+)/gi)]
            .map((m) => m[1]);
        const paths = [...new Set([...rel.flatMap((u) => {
            const m = u.match(/creativecommons\.org\/(?:licenses|publicdomain)\/([a-z-]+\/[0-9.]+)/i);
            return m ? [m[1]] : [];
        }), ...any])];

        if (!paths.length) throw new Error(`licence check: no Creative Commons link on ${page}`);
        if (paths.length > 1) {
            throw new Error(
                `licence check: ${page} names more than one licence (${paths.join(', ')}) — read the page`,
            );
        }
        found.set(page, paths[0]);
    }

    const distinct = [...new Set(found.values())];
    if (distinct.length !== 1) {
        throw new Error(
            'licence check: CTFG pages disagree — ' +
                [...found].map(([p, l]) => `${p} says ${l}`).join('; '),
        );
    }

    const licence = LICENCES[distinct[0]];
    if (!licence) {
        throw new Error(
            `licence check: unrecognised licence '${distinct[0]}'. Add it to LICENCES ` +
                'once you have read it and know the redistribution terms.',
        );
    }
    return { licence, licenceUrl: `https://creativecommons.org/licenses/${distinct[0]}/`, licenceCheckedFrom: pages };
}

const [licenceInfo, points, search] = await Promise.all([
    detectLicence(),
    j('/map', { openSource: 'Yes', orgType: ORG_TYPE }),
    j('/projects/search', { openSource: 'Yes', orgType: ORG_TYPE, limit: '100' }),
]);

const meta = new Map(search.data.map((p) => [p.slug, p]));
const projects = [];
const dropped = [];

for (const pt of points) {
    if (EXCLUDE[pt.slug]) {
        dropped.push({ slug: pt.slug, reason: EXCLUDE[pt.slug] });
        continue;
    }
    const m = meta.get(pt.slug) || {};
    const desc = (m.introduction || m.description || '').replace(/\s+/g, ' ').trim();
    projects.push({
        slug: pt.slug,
        name: m.title || pt.name,
        country: stripFlag(m.location?.country),
        lat: pt.lat,
        lng: pt.lng,
        // Trimmed: these render in a map popup, not as body copy.
        desc: desc.length > 180 ? desc.slice(0, 177).trimEnd() + '…' : desc,
        profile: `https://civictech.guide/projects/${pt.slug}`,
    });
}

projects.sort((a, b) => (a.country || 'zz').localeCompare(b.country || 'zz') || a.name.localeCompare(b.name));
// Sort the exclusions too. They come out in whatever order /map returned the
// points, which is NOT stable — the 2026-08-21 refresh reshuffled all six with no
// change to the set, and a snapshot that exists to be read in a diff should not
// invent six lines of movement to scroll past.
dropped.sort((a, b) => a.slug.localeCompare(b.slug));

const out = {
    // Provenance. Attribution is a licence term under every licence CTFG has used,
    // so the credit renders under the map either way (copy lives in
    // content/start.md). `licence` is READ from their site by detectLicence(),
    // never asserted here — see the note on that function.
    source: 'Civic Tech Field Guide',
    sourceUrl: 'https://civictech.guide',
    sourceApi: `${API}/projects/search?openSource=Yes&orgType=${encodeURIComponent(ORG_TYPE)}`,
    licence: licenceInfo.licence,
    licenceUrl: licenceInfo.licenceUrl,
    // Where and when it was read, so the next reader can tell a verified licence
    // from an inherited one — the distinction this script previously lost.
    licenceCheckedFrom: licenceInfo.licenceCheckedFrom,
    generatedBy: 'scripts/fetch-ctfg-projects.mjs',
    generated: new Date().toISOString().slice(0, 10),
    count: projects.length,
    countries: new Set(projects.map((p) => p.country).filter(Boolean)).size,
    excluded: dropped,
    projects,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(
    `wrote ${projects.length} projects across ${out.countries} countries ` +
        `(${dropped.length} excluded) → content/ctfg-gov-open-source.json`
);
console.log(`  licence read from civictech.guide: ${out.licence}`);
for (const d of dropped) console.log(`  excluded ${d.slug} — ${d.reason}`);
