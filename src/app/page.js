import './primer.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycPathCards from '@/components/unnyc/primer/UnnycPathCards';
import { getContent } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('home');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'website' },
    };
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
        // `unnyc-home` scopes dark-mode.css to just this page for now — see
        // that file for why (other pages don't have dark styling yet).
        <div className="unnyc-pr unnyc-home">
            <HeaderHeightVar />
            <PrimerHero hero={doc.hero} />
            <UnnycPathCards paths={doc.paths} />
        </div>
    );
}
