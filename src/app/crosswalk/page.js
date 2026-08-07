import Link from 'next/link';
import UnnycIcon from '@/components/unnyc/UnnycIcon';
import '../primer.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { getContent, inlineMd } from '@/lib/content';

// Read per call, NOT once at module scope: content/crosswalk.md isn't a module
// dependency, so a module-level `const doc = getContent(...)` is evaluated once
// per server process and edits to the markdown don't show up in `next dev`
// until a restart. Calling it inside generateMetadata/the component re-reads the
// file, so editing the markdown and refreshing just works.
export async function generateMetadata() {
    const { meta } = getContent('crosswalk');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
            type: 'article',
        },
    };
}

/**
 * /crosswalk — "why this matters to NYC." The persuasive core of the campaign:
 * who pays for vendor reliance today, what endorsement would actually cost and
 * fund, then a principle-by-principle crosswalk between the UN's agenda and
 * NYC's reality.
 *
 * ALL COPY ON THIS PAGE LIVES IN content/crosswalk.md — frontmatter for the
 * structure (titles, the eight principles, foot CTAs), markdown body for the
 * prose, split into `## <slug>` sections. This file is layout only; to change
 * wording, edit the markdown. See docs/EDITING-CONTENT.md.
 */
export default function CrosswalkPage() {
    const doc = getContent('crosswalk');
    const { sections } = doc;

    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            {/* Header */}
            <header className="unnyc-pr-cw__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-pr-cw__header-title">{doc.title}</h1>
                    <p
                        className="unnyc-pr-cw__lede"
                        dangerouslySetInnerHTML={{ __html: inlineMd(doc.lede) }}
                    />
                </div>
            </header>

            {/* No section subnav here on purpose. This page's sections ARE the
                eight principles, so the bar could only be a list of all eight —
                too dense to scan, and it duplicated the page's own structure.
                See UnnycSectionNav for where the bar is used. */}

            {/* Persuasive intro — the "meat" of the campaign */}
            <section className="unnyc-pr-why">
                <div className="unnyc-container unnyc-container--narrow">
                    <div dangerouslySetInnerHTML={{ __html: sections.intro.html }} />
                    {sections.intro.blocks.map((b) => (
                        <div key={b.label}>
                            <h2 className="unnyc-pr-why__heading">{b.label}</h2>
                            <div dangerouslySetInnerHTML={{ __html: b.html }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* One section per principle */}
            <div className="unnyc-pr-cw">
                {doc.principles.map((p) => {
                    const section = sections[p.slug];
                    return (
                        <section key={p.slug} id={p.slug} className="unnyc-pr-cw__section">
                            <div className="unnyc-container unnyc-container--narrow">
                                <div className="unnyc-pr-cw__heading">
                                    <UnnycIcon
                                        name={p.icon}
                                        size={40}
                                        className="unnyc-pr-cw__icon"
                                    />
                                    <h2 className="unnyc-pr-cw__title">
                                        {p.number}. {p.title}
                                    </h2>
                                </div>

                                <div
                                    className="unnyc-pr-cw__part"
                                    dangerouslySetInnerHTML={{ __html: section.html }}
                                />

                                {section.blocks.map((b) => (
                                    <div
                                        key={b.label}
                                        className="unnyc-pr-cw__part unnyc-pr-cw__part--gap"
                                    >
                                        <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">
                                            {b.label}
                                        </h4>
                                        <div dangerouslySetInnerHTML={{ __html: b.html }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Closing — why NYC is central to the movement */}
            <section className="unnyc-pr-cw__closing">
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-pr-cw__closing-title">{doc.closingTitle}</h2>
                    <div dangerouslySetInnerHTML={{ __html: sections.closing.html }} />
                </div>
            </section>

            {/* Foot nav */}
            <section className="unnyc-pr-cw__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-pr-cw__foot-ctas">
                        {doc.foot.ctas.map((c) => (
                            <Link
                                key={c.href}
                                href={c.href}
                                className={`unnyc-btn unnyc-btn--${c.style}`}
                            >
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
