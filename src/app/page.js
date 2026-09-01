import './primer.css';
import './home.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHeroFullBleed from '@/components/unnyc/primer/PrimerHeroFullBleed';
import UnnycHomeJourney from '@/components/unnyc/primer/UnnycHomeJourney';
import {
    getContent,
    getGovossCatalogues,
    getUnEndorsers,
} from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { websiteLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('home');
    return pageMetadata(meta, '/', 'website');
}

/**
 * / — the campaign hub. Deliberately short: what UNNYC is, then a four-part
 * journey routing the reader to whichever sub-page matches where they're
 * starting from. Was four question/answer cards until 2026-08-19, when this
 * alternating text/image layout replaced them (Devin's redesign artifact) —
 * same four destinations, same three images, different presentation.
 *
 * HERO: this branch swaps in PrimerHeroFullBleed (a photo background, from
 * Devin's "full bleed" mockup) as a second option to compare against the
 * original PrimerHero's abstract gradient — see that component's doc
 * comment. Swap the import/usage back to PrimerHero to preview the other one.
 *
 * ALL COPY LIVES IN content/home.md. See docs/EDITING-CONTENT.md.
 */
export default function UnnycPage() {
    const doc = getContent('home');

    // ── Derived proof rows ────────────────────────────────────────────────
    // Every figure and every teaser list on the journey comes from the same
    // file its target page renders, so the homepage cannot claim a number or a
    // title the interior page no longer shows. They were authored literals for
    // one commit, and that commit's homepage already disagreed with /crosswalk
    // about three reason titles. Each source fails soft — a missing snapshot
    // drops its own stat, never the section.
    const govoss = getGovossCatalogues();
    const endorsers = getUnEndorsers();
    const ospoCount = (getContent('resources').ospoDirectory?.groups ?? [])
        .reduce((n, g) => n + (g.items?.length ?? 0), 0);
    const statValues = {
        ospos: ospoCount || null,
        // ⚠ totalEntries, NEVER a sum over per-country counts — the sum both
        // undercounts (cross-border catalogues carry no country) and
        // double-counts (an entry in two countries counts twice). See CLAUDE.md.
        'govoss-entries': govoss?.totalEntries ?? null,
        endorsers: endorsers?.organizations.length ?? null,
    };
    const derivedItems = {
        // The six reasons live as "N. Title" labelled blocks in crosswalk's
        // intro; the number is stripped — position carries it.
        '/crosswalk': (getContent('crosswalk').sections?.intro?.blocks ?? [])
            .map((b) => b.label.replace(/^\d+\.\s*/, '')),
        '/success': (getContent('success').cases ?? []).map((c) => c.title),
    };
    // Enrich the authored journey in place: home.md carries the words (labels,
    // headlines, ledes) and names its sources; this fills the values. The
    // component receives the same shape it always did.
    const journey = (doc.journey ?? []).map((section) => ({
        ...section,
        stats: section.stats
            ?.map((st) => ({
                label: st.label,
                value: statValues[st.source]?.toLocaleString('en-US'),
            }))
            .filter((st) => st.value != null),
        items: derivedItems[section.href] ?? section.items,
    }));

    return (
        <div className="unnyc-pr">
            {/* One WebSite/Organization pair for the whole site, home only. */}
            <StructuredData data={websiteLd({ description: doc.meta.description })} />
            <HeaderHeightVar />
            <PrimerHeroFullBleed hero={doc.hero} />
            <UnnycHomeJourney journey={journey} />
        </div>
    );
}
