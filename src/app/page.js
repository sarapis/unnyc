import './primer.css';
import './home.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycHomeJourney from '@/components/unnyc/primer/UnnycHomeJourney';
import {
    getContent,
    getCtfgProjects,
    getGovossCatalogues,
    getUnEndorsers,
    principlesFlat,
} from '@/lib/content';
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

    // --- derived proof rows, keyed by the section's href ---------------------
    const ctfg = getCtfgProjects();
    const govoss = getGovossCatalogues();
    const endorsers = getUnEndorsers();
    const principles = principlesFlat(getContent('principles').principlesDoc);
    const successCases = getContent('success').cases ?? [];
    // The six reasons live as labelled blocks in crosswalk's intro section,
    // titled "1. Save Money, …" — strip the literal number, the component
    // renders position instead.
    const reasons = (getContent('crosswalk').sections?.intro?.blocks ?? [])
        .map((b) => b.label.replace(/^\d+\.\s*/, ''));

    const proofs = {
        '/start': {
            stats: [
                ctfg && { value: ctfg.count, label: 'government-built programs' },
                ctfg && { value: ctfg.countries, label: 'countries on the map' },
                govoss && { value: govoss.catalogueCount, label: 'national code catalogues' },
            ].filter(Boolean),
        },
        '/principles': {
            stats: [
                { value: principles.length, label: 'principles' },
                endorsers && { value: endorsers.organizations.length, label: 'endorsing organizations' },
            ].filter(Boolean),
        },
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
