import './home.css';
/* The map panel's look. Shared with /start, which draws the same component —
 * page CSS is per-route, so this must be imported by every route that renders
 * UnnycWorldMap or the map is unstyled on a fresh load. See world-map.css. */
import './world-map.css';
import UnnycHomeStoryscroller from '@/components/unnyc/primer/UnnycHomeStoryscroller';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import {
    getContent,
    getCtfgProjects,
    getGovossCatalogues,
    getOspoMapPoints,
    getUnEndorsers,
    principlesResolve,
} from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { websiteLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('home');
    return pageMetadata(meta, '/', 'website');
}

/**
 * / — the campaign hub, storyscroller layout (2026-09). Reimplements a
 * Claude Design handoff: a dark, photo-backed narrative homepage (Manhattan
 * map hero, global-movement stats, the UN principles as two horizontal
 * branch diagrams, a pinned horizontal carousel of six reasons, a case-study
 * timeline, the open letter, an audience chooser, keep-reading band) against
 * this repo's own content and conventions, rather than the alternating
 * text/image `journey` layout in UnnycHomeJourney (a separate, still-open
 * option — this file replaces it on this branch only).
 *
 * The four narrative beats this design shares with `journey` (Global
 * Movement / UN Principles / Open Source for NYC / Case Studies, plus the
 * Keep Reading band) read `journey`'s own kicker/headline/lede/href —
 * IDENTICAL wording on both layouts — rather than duplicating that copy.
 * Everything `journey` has no shape for (the two-screen hero, the open
 * letter section, the audience chooser) is new copy under `storyscroller:`
 * in content/home.md.
 *
 * ALL COPY LIVES IN content/*.md. See docs/EDITING-CONTENT.md.
 */
export default function UnnycPage() {
    const doc = getContent('home');
    const crosswalk = getContent('crosswalk');
    const success = getContent('success');
    const sign = getContent('sign');
    const principlesDoc = getContent('principles').principlesDoc;

    // ── Derived proof rows — same derivation as UnnycHomeJourney (page.js
    //    before this branch), so both homepage layouts can never disagree on
    //    a figure. See the note there on why these are ALWAYS derived, never
    //    authored literals. ──────────────────────────────────────────────
    const govoss = getGovossCatalogues();
    // The map's markers/legend/credit are authored in content/start.md, the page
    // whose map this is — read, not copied, so /start and / cannot disagree.
    const startDoc = getContent('start');
    const endorsers = getUnEndorsers();
    const ospoCount = (getContent('resources').ospoDirectory?.groups ?? [])
        .reduce((n, g) => n + (g.items?.length ?? 0), 0);
    const statValues = {
        ospos: ospoCount || null,
        'govoss-entries': govoss?.totalEntries ?? null,
        endorsers: endorsers?.organizations.length ?? null,
    };
    const withStats = (section) => ({
        ...section,
        stats: section.stats
            // ⚠ RAW NUMBER, NOT FORMATTED. The storyscroller's count-up reads
            // `Number(el.dataset.count)`, and Number("2,789") is NaN — so
            // formatting here silently replaced the correct server-rendered
            // value with "NaN" the moment the page hydrated. 18 and 150 survived
            // because they have no comma, which is why it looked like a
            // one-stat bug. The separator is the COMPONENT's job (it already
            // calls toLocaleString on every animation frame).
            ?.map((st) => ({ label: st.label, value: statValues[st.source] }))
            .filter((st) => st.value != null),
    });

    const journey = doc.journey ?? [];
    const movement = withStats(journey[0]);
    const principlesBeat = withStats(journey[1]);
    const nycBeat = withStats(journey[2]);
    const casesBeat = withStats(journey[3]);

    // The six reasons, in order, title only — same source crosswalk's own
    // page renders under "## intro"'s `### N. Reason` blocks.
    const reasons = (crosswalk.sections?.intro?.blocks ?? []).map((b) =>
        b.label.replace(/^\d+\.\s*/, ''),
    );

    // The two branch diagrams reuse the SAME two-section grouping the
    // /principles storyscroller reads — see the note on `groupsGrid` in
    // content/principles.md.
    const principleGroups = principlesResolve(principlesDoc, 'groupsGrid').map((g) => ({
        label: g.title,
        lead: { n: g.lead.n, title: g.lead.titleCanonical || g.lead.title },
        items: g.items.map((p) => ({ n: p.n, title: p.titleCanonical || p.title })),
    }));

    const cases = (success.cases ?? []).map((c) => {
        const [name, subtitle] = c.title.split(/:\s*/);
        return { id: c.id, name, subtitle: subtitle || '', image: c.banner?.src, alt: c.banner?.alt };
    });

    const letterAsk = sign.sections?.letter?.blocks?.find((b) => b.label === 'Take Action');
    // The block's own lead sentence ("We respectfully call on...") is now the
    // section's headline (openLetter.lede, below) — stripped here so it isn't
    // repeated immediately under itself. sign.md itself is untouched: the
    // paragraph still belongs on the real /campaign/sign page, where there's
    // no such headline above it.
    const letterAskList = (letterAsk?.html || '').replace(/^\s*<p>[\s\S]*?<\/p>\s*/, '');

    return (
        <>
            <StructuredData data={websiteLd({ description: doc.meta.description })} />
            <HeaderHeightVar />
            <UnnycHomeStoryscroller
                hero={{
                    kicker: doc.hero.kicker,
                    h1Html: doc.storyscroller.hero.h1,
                    h2Lines: doc.storyscroller.hero.h2Lines,
                    cta: doc.hero.ctas[0],
                }}
                movement={movement}
                /* The real world map, replacing the "coming soon" placeholder
                   this section shipped with. Same component and the SAME four
                   sources /start draws — markers and legend live in
                   content/start.md, so the two maps cannot disagree. */
                worldMap={{
                    markers: startDoc.mapMarkers,
                    legend: startDoc.mapLegend,
                    mapSource: startDoc.mapSource,
                    govoss,
                    ospos: getOspoMapPoints(),
                    ctfg: getCtfgProjects(),
                }}
                principles={{ ...principlesBeat, groups: principleGroups }}
                nyc={{ ...nycBeat, rentCard: crosswalk.rentCard, reasons }}
                cases={{ ...casesBeat, items: cases }}
                openLetter={{
                    kicker: doc.storyscroller.openLetter.kicker,
                    headline: doc.storyscroller.openLetter.lede,
                    askHtml: letterAskList,
                    signatureLabel: sign.addressed?.find((a) => a.label === 'From')?.value,
                    signatureCount: endorsers?.organizations.length ?? null,
                    signatureCountLabel: sign.signatureCountLabel,
                    ctaLabel: doc.storyscroller.openLetter.ctaLabel,
                    ctaHref: doc.storyscroller.openLetter.ctaHref,
                }}
                takeAction={doc.storyscroller.takeAction}
            />
        </>
    );
}
