import Link from 'next/link';
import '../../primer.css';
import './guide.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { articleLd, breadcrumbLd } from '@/lib/structured-data';

// Read per call, NOT at module scope — see the note in crosswalk/page.js.
export async function generateMetadata() {
    const { meta } = getContent('guide');
    return pageMetadata(meta, '/resources/guide');
}

/**
 * /resources/guide — "The UN System & NYC Government Technology", the long-form
 * briefing for city technology leadership.
 *
 * PORTED from the retired hub at old-unnyc.wegov.nyc/guide.html on 2026-08-11.
 * It was the one substantial thing on that site with no counterpart here, which
 * is why wegov.nyc/unnyc/guide had to redirect to /resources instead of to the
 * article itself. The prose was lifted mechanically and diffed word-for-word
 * against the original, not retyped.
 *
 * What did NOT come across is presentation, not content: the original rendered
 * its sub-blocks as bespoke cards (`.opportunity-card`, `.step-card`,
 * `.callout`) and tinted three rows of the calendar table. Here they are the
 * site's own labelled sub-blocks, and the calendar's emphasis survives as the
 * bold cells the original already had.
 *
 * ALL COPY LIVES IN content/guide.md. See docs/EDITING-CONTENT.md.
 */
export default function GuidePage() {
    const doc = getContent('guide');
    const { sections } = doc;

    return (
        <div className="unnyc-pr unnyc-guide">
            {/* The site's one long-form article, plus its place in the tree.
                No datePublished — see src/lib/structured-data.js. */}
            <StructuredData
                data={[
                    articleLd({
                        path: '/resources/guide',
                        headline: doc.title,
                        description: doc.meta.description,
                    }),
                    breadcrumbLd('/resources/guide'),
                ]}
            />
            <HeaderHeightVar />

            <header className="unnyc-guide__header">
                <div className="unnyc-container unnyc-container--narrow">
                    <p className="unnyc-guide__eyebrow">{doc.eyebrow}</p>
                    <h1 className="unnyc-guide__title">{doc.title}</h1>
                    <p className="unnyc-guide__subtitle">{doc.subtitle}</p>
                    <p
                        className="unnyc-guide__meta"
                        dangerouslySetInnerHTML={{ __html: `${inlineMd(doc.byline)} · ${doc.date}` }}
                    />
                </div>
            </header>

            <UnnycSectionNav items={doc.sectionNav} />

            <div className="unnyc-guide__body">
                {/* `doc.outline` deliberately is not called `sections` in the
                    frontmatter: getContent returns {...frontmatter, sections},
                    so the parsed body sections would silently overwrite it. */}
                {doc.outline.map((s) => {
                    const section = sections[s.slug];
                    return (
                        <section key={s.slug} id={s.slug} className="unnyc-guide__section">
                            <div className="unnyc-container unnyc-container--narrow">
                                <div className="unnyc-guide__heading">
                                    {s.number && <span className="unnyc-guide__number">{s.number}</span>}
                                    <h2 className="unnyc-guide__section-title">{s.title}</h2>
                                </div>

                                {s.badge && <p className="unnyc-guide__badge">{s.badge}</p>}

                                {/* Section lede — prose before the first `### Label` */}
                                <div
                                    className="unnyc-guide__prose"
                                    dangerouslySetInnerHTML={{ __html: section.html }}
                                />

                                {section.blocks.map((b) => (
                                    <div key={b.label} className="unnyc-guide__block">
                                        <h3 className="unnyc-guide__block-label">{b.label}</h3>
                                        <div
                                            className="unnyc-guide__prose"
                                            dangerouslySetInnerHTML={{ __html: b.html }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <section className="unnyc-guide__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-guide__foot-links">
                        {doc.foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
