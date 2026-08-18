import Link from 'next/link';
import '../primer.css';
import './start.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import PrimerConcepts from '@/components/unnyc/primer/PrimerConcepts';
import PrimerMovement from '@/components/unnyc/primer/PrimerMovement';
import PrimerMovementNow from '@/components/unnyc/primer/PrimerMovementNow';
import { getContent, getCtfgProjects, getGovossCatalogues, inlineMd } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('start');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
}

/**
 * /start — "The Global Movement." Orientation for a reader who knows what open
 * source is but not how it connects to government and the UN: vocabulary, the
 * the movement's timeline, and who has already signed on.
 *
 * The eight Principles used to sit here too. They are their own top-level page
 * as of 2026-08-13 (/principles), which also carries the per-principle NYC
 * argument that used to be the body of /crosswalk.
 *
 * ALL COPY LIVES IN content/start.md. See docs/EDITING-CONTENT.md.
 */
export default function StartPage() {
    const doc = getContent('start');

    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            <UnnycSectionNav items={doc.sectionNav} />

            <header className="unnyc-start__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-start__title">{doc.title}</h1>
                    {doc.basicsLink && (
                        <p
                            className="unnyc-start__basics-link"
                            dangerouslySetInnerHTML={{ __html: inlineMd(doc.basicsLink) }}
                        />
                    )}
                    <p
                        className="unnyc-start__lede"
                        dangerouslySetInnerHTML={{ __html: inlineMd(doc.lede) }}
                    />
                </div>
            </header>

            {/* Order: vocabulary, then who is already doing it, then how the UN
                got here. The eight principles used to sit between the first two;
                they are their own top-level page as of 2026-08-13 (/principles),
                and the foot CTA below is the hand-off. */}
            <PrimerConcepts concepts={doc.concepts} />
            <PrimerMovementNow
                mapMarkers={doc.mapMarkers}
                mapLegend={doc.mapLegend}
                ctfg={getCtfgProjects()}
                govoss={getGovossCatalogues()}
                mapSource={doc.mapSource}
                title={doc.movementNow?.title}
                lede={doc.movementNow?.lede}
            />
            <PrimerMovement movement={doc.movement} />

            {/* Foot CTA — leads into the next section */}
            <section className="unnyc-start__next">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.next.text}</p>
                    <Link href={doc.next.href} className="unnyc-btn unnyc-btn--primary">
                        {doc.next.label}
                    </Link>
                </div>
            </section>
        </div>
    );
}
