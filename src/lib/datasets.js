import { getContent, getCtfgProjects, getGovossCatalogues, getUnEndorsers } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/**
 * The four datasets this site publishes at stable URLs, built from the SAME
 * files the pages render.
 *
 * ── WHY PUBLISH THEM ────────────────────────────────────────────────────────
 * Being optimised for search is not the same as being worth citing. Two of these
 * exist nowhere else in machine-readable form, and one of those is the strongest
 * asset the site has: the UN's own endorsers page carries 154 logos and ZERO
 * names — every card's title element is empty — so no crawler and no model can
 * extract that list from the source. It exists here because somebody read the
 * logos. The OSPO directory is similar in kind: 17 of its 18 entries have no
 * Civic Tech Field Guide listing, which is the largest directory in the field.
 *
 * ── SERVED FROM THE SAME SOURCE AS THE PAGES, NEVER A COPY ──────────────────
 * A published copy of a dataset drifts from the page the first time somebody
 * edits one of them. These read `content/*` through the same loaders the
 * components use, and are prerendered at build.
 *
 * ── LICENCES DIFFER BY WHO MADE THE DATA, AND THAT IS THE POINT ─────────────
 * Every payload states its own terms, because "who to credit" is not the same
 * question for all four:
 *   • The endorser transcription and the OSPO directory are OUR work, published
 *     CC BY 4.0 (owner decision, 2026-08-21) — matching what Sarapis already
 *     does with GovOSS's catalogue data.
 *   • The CTFG and GovOSS slices are THEIRS. Same CC BY 4.0 string today, but
 *     the credit belongs upstream, and each payload says so. Their licence
 *     values are read from the snapshots, which read them from the source.
 * ⚠ Do not collapse these into one shared constant. CTFG was CC BY-NC-SA until
 * July 2026 and this repo published the stale claim for two weeks; the licences
 * agreeing today is a coincidence, not an invariant.
 *
 * ── ON FACTS vs COMPILATIONS ────────────────────────────────────────────────
 * Which organizations endorsed the UN Principles is not our fact and we make no
 * claim on it. What is published here is the transcription and classification —
 * the labour — and the payload says exactly that rather than implying ownership
 * of the underlying facts.
 */

const OURS = {
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: `UNNYC (${SITE_URL}) — WeGovNYC and Sarapis`,
};

/** Everything a consumer needs to cite a dataset, in the same shape for all four. */
function envelope({ slug, name, description, count, licence, attribution, source, sourceUrl, generated, notes }) {
    return {
        name,
        description,
        url: `${SITE_URL}/data/${slug}.json`,
        licence: licence.licence,
        licenceUrl: licence.licenceUrl,
        attribution: attribution ?? licence.attribution,
        source,
        sourceUrl,
        generated,
        count,
        ...(notes?.length ? { notes } : {}),
    };
}

/** 150 organizations, transcribed from the UN's logo wall. Ours. */
function endorsers() {
    const d = getUnEndorsers();
    if (!d) return null;
    return {
        ...envelope({
            slug: 'un-endorsers',
            name: 'Organizations endorsing the UN Open Source Principles',
            description:
                'Names and sectors of the organizations shown on the United Nations’ own endorsers page, transcribed by hand because that page publishes logos and no names.',
            count: d.organizations.length,
            licence: OURS,
            source: d.source,
            sourceUrl: d.sourceUrl,
            generated: d.extracted,
            notes: [
                d.note,
                d.sectorNote,
                'The underlying fact of who endorsed is the UN’s, not ours; the CC BY 4.0 licence covers this transcription and the sector classification.',
            ].filter(Boolean),
        }),
        // Kept verbatim from the snapshot: a consumer that cannot see the
        // corrections and exclusions cannot judge the list. 154 raw -> 150.
        countRaw: d.countRaw,
        sectors: d.sectors,
        corrections: d.corrections,
        excluded: d.excluded,
        organizations: d.organizations,
    };
}

/** 18 public sector open source programme offices. Ours. */
function ospos() {
    const dir = getContent('resources')?.ospoDirectory;
    if (!dir?.groups) return null;
    // The groups are BY COUNTRY (`country`, not `title` — checked, after a first
    // pass published `"group": null` on all 18 rows). Flattened with the country
    // carried onto each office, because a consumer wanting one office should not
    // have to reconstruct which bucket it came from.
    const offices = dir.groups.flatMap((g) =>
        (g.items ?? []).map((o) => ({ country: g.country ?? null, ...o })),
    );
    return {
        ...envelope({
            slug: 'public-sector-ospos',
            name: 'Public sector open source programme offices',
            description:
                'Government and public-sector OSPOs with their own websites, contact addresses and open source policies, compiled for this campaign.',
            count: offices.length,
            licence: OURS,
            source: 'UNNYC — compiled from each office’s own website',
            sourceUrl: `${SITE_URL}/resources`,
            generated: null,
            notes: [
                'Coordinates are hand-placed. `locationBasis: "seat"` means the body’s own city; `"hq"` means it sits at its parent organisation’s headquarters, so the point is approximate — the two are different claims and are not interchangeable.',
                'The map at /start groups these by city and merges cities within 25 km, which changes what is DRAWN and never what is claimed. This dataset is ungrouped.',
            ],
        }),
        offices,
    };
}

/** 62 government-built open source programmes. Theirs (Civic Tech Field Guide). */
function ctfgPrograms() {
    const d = getCtfgProjects();
    if (!d) return null;
    return {
        ...envelope({
            slug: 'government-open-source-programs',
            name: 'Government-built open source programmes (Civic Tech Field Guide)',
            description:
                'The Civic Tech Field Guide’s open source projects tagged Government / public sector, as drawn on this site’s map, with the entries we excluded and why.',
            count: d.projects.length,
            licence: { licence: d.licence, licenceUrl: d.licenceUrl ?? null },
            attribution: `Civic Tech Field Guide (${d.sourceUrl}) — redistributed under its own licence; credit CTFG, not this site`,
            source: d.source,
            sourceUrl: d.sourceUrl,
            generated: d.generated,
            notes: [
                'A curated snapshot, not a live mirror: six entries tagged Government / public sector upstream are excluded here with reasons, because they are not government-built.',
                'The licence is read off civictech.guide at fetch time rather than asserted — CTFG relicensed from CC BY-NC-SA to CC BY 4.0 in July 2026.',
            ],
        }),
        countries: d.countries,
        excluded: d.excluded,
        projects: d.projects,
    };
}

/** 13 countries' public code catalogues. Theirs (GovOSS). */
function govossCatalogues() {
    const d = getGovossCatalogues();
    if (!d?.countries) return null;
    return {
        ...envelope({
            slug: 'government-code-catalogues',
            name: 'National public code catalogues (GovOSS)',
            description:
                'How many open source projects each country’s own public code catalogues list, with a link to every catalogue.',
            count: d.countries.length,
            licence: { licence: d.licence, licenceUrl: null },
            attribution: `GovOSS (${d.sourceUrl}) — catalogue data CC BY 4.0; credit GovOSS, not this site`,
            source: d.source,
            sourceUrl: d.sourceUrl,
            generated: d.generated,
            notes: [
                '⚠ Never sum the per-country entry counts. It matches neither total, in both directions at once: entries in cross-border catalogues get no country, and an entry listed by catalogues in two countries counts under each. Use countryAttributedEntries or totalEntries.',
                'Excluded catalogues are listed with their entry counts, so the gap between the two totals is checkable rather than asserted.',
            ],
        }),
        totalEntries: d.totalEntries,
        countryAttributedEntries: d.countryAttributedEntries,
        catalogueCount: d.catalogueCount,
        excluded: d.excluded,
        countries: d.countries,
    };
}

/** slug -> builder. The slug is the URL, so renaming one breaks a published
 *  address; add rather than rename. */
export const DATASETS = {
    'un-endorsers': endorsers,
    'public-sector-ospos': ospos,
    'government-open-source-programs': ctfgPrograms,
    'government-code-catalogues': govossCatalogues,
};

/** /data/index.json — the catalogue. Each entry is the dataset's own envelope
 *  minus its rows, so the index cannot describe a dataset differently from the
 *  dataset itself. Fail-soft per entry, like the loaders. */
export function datasetIndex() {
    const datasets = Object.entries(DATASETS)
        .map(([slug, build]) => {
            const d = build();
            if (!d) return null;
            const { organizations, offices, projects, countries, ...meta } = d;
            return { slug, ...meta };
        })
        .filter(Boolean);

    return {
        name: 'UNNYC open data',
        description:
            'Datasets behind the UNNYC campaign site, served from the same files the pages render.',
        url: `${SITE_URL}/data/index.json`,
        homepage: SITE_URL,
        note: 'Licences differ by who made the data — read each dataset’s own `licence` and `attribution` rather than assuming one covers all four.',
        count: datasets.length,
        datasets,
    };
}
