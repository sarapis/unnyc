import Link from 'next/link';
import '../primer.css';
import './resources.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerResources from '@/components/unnyc/primer/PrimerResources';
import PrimerContacts from '@/components/unnyc/primer/PrimerContacts';
import PrimerOspoDirectory from '@/components/unnyc/primer/PrimerOspoDirectory';

export const metadata = {
    title: 'Related Resources — UNNYC',
    description:
        'A resource directory and the people to call. Looking for case studies? See what success looks like.',
    openGraph: {
        title: 'Related Resources — UNNYC',
        description: 'The resource directory and the people to call for the UNNYC campaign.',
        type: 'website',
    },
};

/**
 * /resources — "I'm looking for related resources." Reference
 * material: the resource directory and the people to call. Case studies
 * live on /success instead.
 */
export default function ResourcesPage() {
    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            <header className="unnyc-resources__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-resources__title">Related Resources</h1>
                    <p className="unnyc-resources__lede">
                        The <a href="#resources" className="unnyc-gloss__link">primary sources</a>,
                        the <a href="#contacts" className="unnyc-gloss__link">people to call</a>,
                        and a{' '}
                        <a href="#ospos" className="unnyc-gloss__link">directory of global OSPOs</a>.
                        If it&rsquo;s not here, one of these contacts can point you to who has it.
                        Looking for case studies instead?{' '}
                        <Link href="/success">See what success looks like →</Link>
                    </p>
                </div>
            </header>

            <PrimerResources />
            <PrimerContacts />
            <PrimerOspoDirectory />

            {/* Foot nav — the four paths don't dead-end here */}
            <section className="unnyc-resources__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>Looking for something else?</p>
                    <div className="unnyc-resources__foot-links">
                        <Link href="/start" className="unnyc-btn unnyc-btn--outline">
                            New to government open source?
                        </Link>
                        <Link href="/crosswalk" className="unnyc-btn unnyc-btn--outline">
                            Why does this matter?
                        </Link>
                        <Link href="/success" className="unnyc-btn unnyc-btn--outline">
                            What success looks like
                        </Link>
                        <Link href="/campaign" className="unnyc-btn unnyc-btn--primary">
                            Sign the open letter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
