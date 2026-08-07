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
 * committing. Attribution is required — CTFG directory content is CC BY-NC-SA 4.0.
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

const [points, search] = await Promise.all([
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

const out = {
    // Provenance — CTFG content is CC BY-NC-SA 4.0, so attribution is a licence term,
    // not a courtesy. The UI renders it under the map (copy lives in content/start.md).
    source: 'Civic Tech Field Guide',
    sourceUrl: 'https://civictech.guide',
    sourceApi: `${API}/projects/search?openSource=Yes&orgType=${encodeURIComponent(ORG_TYPE)}`,
    licence: 'CC BY-NC-SA 4.0',
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
for (const d of dropped) console.log(`  excluded ${d.slug} — ${d.reason}`);
