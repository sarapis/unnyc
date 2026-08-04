import './primer.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerHero from '@/components/unnyc/primer/PrimerHero';
import UnnycPathCards from '@/components/unnyc/primer/UnnycPathCards';

export const metadata = {
    title: 'UNNYC — Make NYC the First City in the Americas to Endorse Open Source',
    description:
        'UNNYC is the campaign to make New York the first city in the Americas to endorse the UN Open Source Principles. Start wherever you are — new to government open source, curious why it matters, ready to sign, or looking for resources.',
    openGraph: {
        title: 'UNNYC — The UN Has United Around Open Source. NYC Should Too.',
        description:
            'The campaign to make New York the first city in the Americas to endorse the UN Open Source Principles.',
        type: 'website',
    },
};

/**
 * / — the campaign hub. Kept deliberately short: an introduction to
 * what UNNYC is, then four cards routing the reader to whichever of the
 * four sub-pages matches where they're starting from (new-to-open-source,
 * why-it-matters, ready-to-sign, resources). Those pages lead into one
 * another in that order; this page is the fork, not the funnel.
 */
export default function UnnycPage() {
    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />
            <PrimerHero />
            <UnnycPathCards />
        </div>
    );
}
