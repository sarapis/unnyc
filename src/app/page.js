import './primer.css';
import './home.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycHomeJourney from '@/components/unnyc/primer/UnnycHomeJourney';
import { getContent, getGovossCatalogues, getUnEndorsers } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { websiteLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('home');
    return pageMetadata(meta, '/', 'website');
}

/**
 * / — the campaign hub as a vertical scroll: the hero, then one full-width
 * section per interior page in nav order, each with a headline and one link
 * deeper. Replaced the four-card grid on 2026-08-21.
 *
 * ALL COPY LIVES IN content/home.md (`journey:`). The proof rows are DERIVED
 * HERE — every number and every teaser list comes from the same file its
 * target page renders, so the homepage cannot claim what a page no longer
 * shows. Each loader fails soft: a missing snapshot drops its own stat, never
 * the section, matching the loaders' own posture.
 */
export default function UnnycPage() {
    const doc = getContent('home');

    // --- derived proof VALUES, keyed by the `source:` names the markdown's
    // stat entries use. The labels are the editor's, over there; the numbers
    // are computed here; a missing snapshot drops its own stat, never a section.
    const govoss = getGovossCatalogues();
    const endorsers = getUnEndorsers();
    // Every office in /resources' OSPO directory — the same list that page
    // renders and the map plots, flattened the same way.
    const ospoCount = (getContent('resources').ospoDirectory?.groups ?? [])
        .reduce((n, g) => n + (g.items?.length ?? 0), 0);
    const values = {
        ospos: ospoCount || null,
        // ⚠ totalEntries, NEVER a sum over the per-country counts — the sum both
        // undercounts (cross-border catalogues carry no country) and
        // double-counts (an entry in two countries' catalogues counts twice).
        // See the GovOSS section of CLAUDE.md.
        'govoss-entries': govoss?.totalEntries ?? null,
        endorsers: endorsers?.organizations.length ?? null,
    };

    // The six reasons are crosswalk's own labelled blocks, "1. Save Money…" —
    // number stripped; retitling a reason there retitles it here.
    const reasons = (getContent('crosswalk').sections?.intro?.blocks ?? [])
        .map((b) => b.label.replace(/^\d+\.\s*/, ''));
    const successCases = getContent('success').cases ?? [];

    const proofs = {
        '/start': { values },
        '/principles': { values },
        '/crosswalk': { items: reasons },
        '/success': { items: successCases.map((c) => c.title) },
    };

    return (
        <div className="unnyc-pr">
            {/* One WebSite/Organization pair for the whole site, home only. */}
            <StructuredData data={websiteLd({ description: doc.meta.description })} />
            <HeaderHeightVar />
            <PrimerHero hero={doc.hero} />
            <UnnycHomeJourney journey={doc.journey} proofs={proofs} />
        </div>
    );
}
