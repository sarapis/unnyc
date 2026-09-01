import './primer.css';
import './home.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycHomeJourney from '@/components/unnyc/primer/UnnycHomeJourney';
import { getContent } from '@/lib/content';
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
 * ALL COPY LIVES IN content/home.md. See docs/EDITING-CONTENT.md.
 */
export default function UnnycPage() {
    const doc = getContent('home');

    return (
        <div className="unnyc-pr">
            {/* One WebSite/Organization pair for the whole site, home only. */}
            <StructuredData data={websiteLd({ description: doc.meta.description })} />
            <HeaderHeightVar />
            <PrimerHero hero={doc.hero} />
            <UnnycHomeJourney journey={doc.journey} />
        </div>
    );
}
