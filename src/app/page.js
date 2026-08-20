import './primer.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycPathCards from '@/components/unnyc/primer/UnnycPathCards';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('home');
    return pageMetadata(meta, '/', 'website');
}

/**
 * / — the campaign hub. Deliberately short: what UNNYC is, then four cards
 * routing the reader to whichever sub-page matches where they're starting from.
 *
 * ALL COPY LIVES IN content/home.md. See docs/EDITING-CONTENT.md.
 */
export default function UnnycPage() {
    const doc = getContent('home');

    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />
            <PrimerHero hero={doc.hero} />
            <UnnycPathCards paths={doc.paths} />
        </div>
    );
}
