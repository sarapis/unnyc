import Link from 'next/link';
import '../primer.css';
import './start.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import PrincipleDefinitions from '@/components/unnyc/primer/PrincipleDefinitions';
import PrimerConcepts from '@/components/unnyc/primer/PrimerConcepts';
import PrimerMovement from '@/components/unnyc/primer/PrimerMovement';
import PrimerMovementNow from '@/components/unnyc/primer/PrimerMovementNow';
import { getContent, getCtfgProjects, inlineMd } from '@/lib/content';

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
 * eight Principles, the movement's timeline, and who has already signed on.
 *
 * ALL COPY LIVES IN content/start.md (the eight Principles come from
 * content/principles.md, shared with /start/principles so the two can't drift).
 * See docs/EDITING-CONTENT.md.
 */
export default function StartPage() {
    const doc = getContent('start');
    const { principlesDoc } = getContent('principles');

    return (
        <div className="unnyc-pr unnyc-start">
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

            <PrimerConcepts concepts={doc.concepts} />
            <PrincipleDefinitions principlesDoc={principlesDoc} />
            <PrimerMovement movement={doc.movement} />
            <PrimerMovementNow
                endorsers={doc.endorsers}
                mapMarkers={doc.mapMarkers}
                mapLegend={doc.mapLegend}
                ctfg={getCtfgProjects()}
                mapSource={doc.mapSource}
            />

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
