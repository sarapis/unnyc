import './home.css';
import UnnycHomeStoryscroller from '@/components/unnyc/primer/UnnycHomeStoryscroller';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import {
    getContent,
    getGovossCatalogues,
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
                principles={{ ...principlesBeat, groups: principleGroups }}
                nyc={{ ...nycBeat, rentCard: crosswalk.rentCard, reasons }}
                cases={{ ...casesBeat, items: cases }}
                openLetter={{
                    kicker: doc.storyscroller.openLetter.kicker,
                    headline: sign.title,
                    askHtml: letterAsk?.html || '',
                    signatureLabel: sign.addressed?.find((a) => a.label === 'From')?.value,
                    signatureCount: endorsers?.organizations.length ?? null,
                    signatureCountLabel: sign.signatureCountLabel,
                    ctaLabel: doc.storyscroller.openLetter.ctaLabel,
                    ctaHref: doc.storyscroller.openLetter.ctaHref,
                }}
                takeAction={doc.storyscroller.takeAction}
                keepReading={journey.map((j) => ({ kicker: j.kicker, label: j.linkLabel, href: j.href }))}
            />
        </>
    );
}
