/**
 * Refresh the public-sector OSPO directory from GovOSS.
 *
 *   node scripts/fetch-govoss-ospos.mjs
 *
 * Writes ONE file, content/govoss-ospos.json: the FLOSS-PSO Network's public-sector
 * OSPO list as GovOSS republishes it, with GovOSS's placements. One file rather than
 * the catalogues layer's two because there is no geometry here — 18 offices are
 * readable in a diff, which is the point of a snapshot.
 *
 * A SNAPSHOT, not a live fetch — same three reasons as every other layer: the page
 * must not go half-empty if GovOSS is slow, the data deserves a human gate before it
 * goes on an advocacy page, and a snapshot is reviewable where a runtime fetch is not.
 * Nothing on the site requests govoss.cat; only this script does.
 *
 * ⚠ /ospos.json IS PUBLISHED UNDER A CONSUMER CONTRACT WRITTEN FOR THIS SITE
 * (ospo_contract.py in sarapis/govoss-catalog, enforced by their tests). Everything
 * this script reads is in that contract, and anything outside it THROWS rather than
 * being guessed at:
 *   - top level: generated_at, sources, ospos, licence, country_codes;
 *   - licence.govoss_fields / licence.lists, and sources["floss-pso"].licence —
 *     READ and matched VERBATIM against LICENCES, never typed into the output;
 *   - sources["floss-pso"]: url (the credit link), fetched_at, count, ok;
 *   - rows with source == "floss-pso" only: id, name, url, description, email,
 *     policy, code, type, country, location {lat, lon, place, basis, country}.
 * Not read, and free to change on their side: human_page, about, created,
 * resources_case, source_url, kind, ospo_note, and every non-FLOSS-PSO row.
 *
 * WHOSE IS WHAT, and the credit follows it:
 *   - the LIST (which offices, their names, URLs, descriptions, emails, policies,
 *     forges) is the FLOSS-PSO Network's, CC0 1.0. Credit them, not GovOSS and not us.
 *   - the PLACEMENTS (lat/lon, place, basis) and the type/country fields are
 *     GovOSS's, CC0 1.0 — and most of the 18 were copied from this site's own
 *     hand placements in content/resources.md, before this script replaced them.
 *     From now on a placement correction goes to GovOSS, not into our markdown.
 *
 * ⚠ ok:false MEANS "STALE", so this refuses. GovOSS keeps serving the last good list
 * when FLOSS-PSO's fetch fails — and holds back a new office until it has placed it —
 * with fetched_at frozen at the last success. Writing that out under today's
 * `generated` date would re-stamp an old list as current, the same shape as the
 * literal licence that kept re-stamping CTFG's stale CC BY-NC-SA claim.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import matter from 'gray-matter';

const GOVOSS = 'https://govoss.cat';
const SOURCE = 'floss-pso';
const OUT = new URL('../content/govoss-ospos.json', import.meta.url);
const RESOURCES = new URL('../content/resources.md', import.meta.url);

/**
 * Every licence string this script knows how to render, verbatim, mapped to the
 * short form a reader sees and whose name the credit carries. ANY other value
 * throws: a new licence is a fact to read and decide on, never something to parse.
 */
const LICENCES = {
    // sources["floss-pso"].licence — the list itself.
    list: {
        "CC0 1.0 (the FLOSS-PSO Network's OSPO list)": {
            source: 'FLOSS-PSO Network',
            licence: 'CC0 1.0',
            licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
    },
    // licence.govoss_fields — GovOSS's own additions: the placements.
    govossFields: {
        'CC0 1.0, govoss (https://govoss.cat)': {
            source: 'GovOSS',
            sourceUrl: 'https://govoss.cat',
            licence: 'CC0 1.0',
            licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
    },
    // licence.lists — a pointer, not a licence. Pinned so a change to what it
    // points at cannot slip past.
    lists: { "each list's own: sources[*].licence": true },
};

/**
 * Our group heading per country code. Only the codes the FLOSS-PSO rows use need an
 * entry; a FLOSS-PSO row with any other code throws, so a new country is a decision
 * about a heading, not a silent "undefined" group. (GovOSS's own `country_codes`
 * values are descriptions — "Greece (the EU's code; ISO is GR)" — not headings.)
 */
const COUNTRY_NAMES = {
    US: 'United States',
    INT: 'International',
    DE: 'Germany',
    DK: 'Denmark',
    EL: 'Greece',
    FR: 'France',
    NL: 'Netherlands',
    ES: 'Spain',
    GB: 'United Kingdom',
    IE: 'Ireland',
    LU: 'Luxembourg',
};

const die = (msg) => {
    throw new Error(`fetch-govoss-ospos: ${msg}`);
};
const ISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/;
const str = (v) => typeof v === 'string' && v.trim().length > 0;
const strOrNull = (v) => v === null || typeof v === 'string';

const r = await fetch(`${GOVOSS}/ospos.json`, { signal: AbortSignal.timeout(60000) });
if (!r.ok) die(`${GOVOSS}/ospos.json → ${r.status}`);
const file = await r.json();

// ---------------------------------------------------------------- top level
for (const k of ['generated_at', 'sources', 'ospos', 'licence', 'country_codes'])
    if (file?.[k] == null) die(`no \`${k}\``);
if (!ISO.test(file.generated_at)) die(`generated_at "${file.generated_at}" is not ISO 8601 UTC`);
if (!Array.isArray(file.ospos)) die('`ospos` is not an array');
if (typeof file.country_codes !== 'object') die('`country_codes` is not an object');

// ---------------------------------------------------------------- licences
const govossFields = LICENCES.govossFields[file.licence.govoss_fields];
if (!govossFields) die(`unexpected licence.govoss_fields "${file.licence.govoss_fields}" — read govoss.cat, then add it to LICENCES deliberately`);
if (!LICENCES.lists[file.licence.lists]) die(`unexpected licence.lists "${file.licence.lists}"`);

const src = file.sources[SOURCE];
if (!src) die(`no sources["${SOURCE}"]`);
const list = LICENCES.list[src.licence];
if (!list) die(`unexpected sources["${SOURCE}"].licence "${src.licence}" — read floss-pso.network, then add it to LICENCES deliberately`);
if (!str(src.url) || !/^https:\/\//.test(src.url)) die(`sources["${SOURCE}"].url "${src.url}"`);
if (!ISO.test(src.fetched_at ?? '')) die(`sources["${SOURCE}"].fetched_at "${src.fetched_at}"`);
if (typeof src.ok !== 'boolean') die(`sources["${SOURCE}"].ok is not a boolean`);
if (!src.ok)
    die(`sources["${SOURCE}"].ok is false — GovOSS is serving its last good copy from ${src.fetched_at}` +
        `${src.failed_at ? ` (failed ${src.failed_at}: ${src.error ?? 'no error given'})` : ''}. Not refreshing a stale list; try again later.`);

// ---------------------------------------------------------------- rows
const ids = new Set();
for (const o of file.ospos) {
    if (!str(o?.id)) die('a row has no id');
    if (ids.has(o.id)) die(`duplicate id "${o.id}"`);
    ids.add(o.id);
}
const rows = file.ospos.filter((o) => o.source === SOURCE);
if (!Number.isInteger(src.count) || src.count !== rows.length)
    die(`sources["${SOURCE}"].count is ${src.count} but there are ${rows.length} "${SOURCE}" rows`);
if (!rows.length) die(`zero "${SOURCE}" rows`);

const ospos = rows.map((o) => {
    const at = `"${o.id}"`;
    for (const k of ['name', 'url', 'description']) if (!str(o[k])) die(`${at}: ${k} is not a non-empty string`);
    for (const k of ['email', 'policy']) if (!strOrNull(o[k])) die(`${at}: ${k} is neither a string nor null`);
    if (!Array.isArray(o.code) || !o.code.every((u) => str(u))) die(`${at}: code is not an array of URLs`);
    if (!['government', 'academic'].includes(o.type)) die(`${at}: type "${o.type}"`);
    if (!(o.country in file.country_codes)) die(`${at}: country "${o.country}" is not a key of country_codes`);
    if (!COUNTRY_NAMES[o.country]) die(`${at}: country "${o.country}" has no heading in COUNTRY_NAMES — add one deliberately`);
    const L = o.location ?? die(`${at}: no location`);
    if (typeof L.lat !== 'number' || L.lat < -90 || L.lat > 90) die(`${at}: location.lat ${L.lat}`);
    if (typeof L.lon !== 'number' || L.lon < -180 || L.lon > 180) die(`${at}: location.lon ${L.lon}`);
    if (!str(L.place)) die(`${at}: location.place`);
    if (!['seat', 'hq'].includes(L.basis)) die(`${at}: location.basis "${L.basis}"`);
    if (!(L.country in file.country_codes)) die(`${at}: location.country "${L.country}"`);

    // Our field names, so the page, the map, the dataset and the JSON-LD keep
    // their shape: lon -> lng, basis -> locationBasis, place -> city.
    return {
        id: o.id,
        name: o.name,
        type: o.type,
        countryCode: o.country,
        country: COUNTRY_NAMES[o.country],
        city: L.place,
        lat: L.lat,
        lng: L.lon,
        locationBasis: L.basis,
        url: o.url,
        description: o.description,
        email: o.email,
        // Verbatim, even where it repeats `url` (ANSSI, Strasbourg upstream). Hiding
        // that is the loader's job, so the snapshot stays a faithful copy.
        policy: o.policy,
        code: o.code,
    };
});

// ---------------------------------------------------------------- write
const data = {
    // The LIST's provenance — what the credit on /resources and under the map names.
    source: list.source,
    sourceUrl: src.url,
    licence: list.licence,
    licenceUrl: list.licenceUrl,
    // The PLACEMENTS' provenance — recorded for /data/public-sector-ospos.json.
    locations: {
        source: govossFields.source,
        sourceUrl: govossFields.sourceUrl,
        licence: govossFields.licence,
        licenceUrl: govossFields.licenceUrl,
        note: 'Hand-placed by UNNYC until 2026-10; GovOSS copied those placements and maintains them now.',
    },
    // The strings exactly as GovOSS published them, so a reviewer can see what the
    // short forms above were mapped from.
    licenceRaw: { list: src.licence, govossFields: file.licence.govoss_fields },
    via: `${GOVOSS}/ospos.json`,
    generatedBy: 'scripts/fetch-govoss-ospos.mjs',
    generated: new Date().toISOString().slice(0, 10),
    govossGenerated: file.generated_at,
    listFetchedAt: src.fetched_at,
    count: ospos.length,
    ospos,
};

writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');

const byType = ospos.reduce((m, o) => ((m[o.type] = (m[o.type] ?? 0) + 1), m), {});
console.log(`wrote ${ospos.length} offices (${Object.entries(byType).map(([k, v]) => `${v} ${k}`).join(', ')}) → content/govoss-ospos.json`);
console.log(`  list: ${data.source} (${data.licence}), fetched ${src.fetched_at}`);
console.log(`  placements: ${data.locations.source} (${data.locations.licence})`);
/* The pinned description overrides in content/resources.md. A refresh that changes
 * an overridden office's text will FAIL THE BUILD (getOspoDirectory throws) — say so
 * here, where whoever ran the refresh is looking, rather than at deploy time. */
const overrides = matter(readFileSync(RESOURCES, 'utf8')).data?.ospoDirectory?.descriptionOverrides ?? [];
for (const ov of overrides) {
    const o = ospos.find((x) => x.id === ov.id);
    if (!o) console.log(`  ⚠ override "${ov.id}": no such office any more — delete it from content/resources.md`);
    else if (o.description !== ov.upstream) console.log(`  ⚠ override "${ov.id}": upstream text changed — re-read it, then update or delete the override (the build will fail until you do)`);
    else console.log(`  override "${ov.id}" still pinned to current upstream text`);
}
const dup = ospos.filter((o) => o.policy && o.policy.replace(/\/$/, '') === o.url.replace(/\/$/, ''));
if (dup.length) console.log(`  policy == url (hidden on the page): ${dup.map((o) => o.name).join('; ')}`);
