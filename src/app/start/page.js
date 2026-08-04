import Link from 'next/link';
import '../primer.css';
import './start.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrincipleDefinitions from '@/components/unnyc/primer/PrincipleDefinitions';
import PrimerConcepts from '@/components/unnyc/primer/PrimerConcepts';
import PrimerMovement from '@/components/unnyc/primer/PrimerMovement';
import PrimerMovementNow from '@/components/unnyc/primer/PrimerMovementNow';

export const metadata = {
    title: 'New to Government Open Source? Start Here — UNNYC',
    description:
        'New to government open source? Learn the key vocabulary, the eight UN Open Source Principles, how the movement reached the UN, and who has already signed on.',
    openGraph: {
        title: 'New to Government Open Source? Start Here — UNNYC',
        description:
            'The vocabulary, the principles, the history, and the map — everything you need to follow the UNNYC campaign from the beginning.',
        type: 'article',
    },
};

/**
 * /start — "I am new to government open source." Orientation for a
 * reader who already knows what open source is, but not how it connects to
 * government and the UN: vocabulary, the eight UN Open Source Principles,
 * the movement's history, and who has already signed on. Leads into
 * /crosswalk ("why this matters to NYC").
 */
export default function StartPage() {
    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            <header className="unnyc-start__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-start__title">Let&rsquo;s Get You Oriented</h1>
                    <p className="unnyc-start__basics-link">
                        Are you entirely new to open source?{' '}
                        <a
                            href="https://en.wikipedia.org/wiki/Open-source_software"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Start with the basics ↗
                        </a>
                    </p>
                    <p className="unnyc-start__lede">
                        Here&rsquo;s how open source connects to government and the UN: the{' '}
                        <a href="#concepts" className="unnyc-gloss__link">vocabulary</a> specific to
                        this movement, the{' '}
                        <a href="#principles" className="unnyc-gloss__link">eight principles</a> the
                        UN adopted, the{' '}
                        <a href="#movement" className="unnyc-gloss__link">timeline</a> of how the
                        movement got here, and{' '}
                        <a href="#going-open-source" className="unnyc-gloss__link">who</a> has
                        already signed on.
                    </p>
                </div>
            </header>

            <PrimerConcepts />
            <PrincipleDefinitions />
            <PrimerMovement />
            <PrimerMovementNow />

            {/* Foot CTA — leads into the next section */}
            <section className="unnyc-start__next">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>Now that you know the basics —</p>
                    <Link href="/crosswalk" className="unnyc-btn unnyc-btn--primary">
                        Why does this matter to NYC? →
                    </Link>
                </div>
            </section>
        </div>
    );
}
