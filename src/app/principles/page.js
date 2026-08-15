import Link from 'next/link';
import UnnycIcon from '@/components/unnyc/UnnycIcon';
import '../primer.css';
import './principles.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycEndorserDirectory from '@/components/unnyc/primer/UnnycEndorserDirectory';
import { getContent, getUnEndorsers, inlineMd } from '@/lib/content';

// Read per call, NOT at module scope — see the note in crosswalk/page.js.
export async function generateMetadata() {
    const { meta } = getContent('principles');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
}

/**
 * /principles — the UN Open Source Principles, top level (2026-08-13).
 *
 * Two halves, and the point is that they are the SAME eight:
 *   1. the plain-English grid that used to be /start#principles, now with every
 *      icon+title clickable;
 *   2. the per-principle NYC argument that used to be the body of /crosswalk.
 * Clicking a card jumps to that principle's section below.
 *
 * The prose MOVED off /crosswalk rather than being copied. This repo has already
 * spent a day untangling three drifted copies of the principles; a fourth was
 * not worth the convenience. /crosswalk keeps its own argument — what vendor
 * reliance costs — and links here.
 *
 * The jump target is `slug` on each principle in content/principles.md, which is
 * also the `## slug` of its section. One id, defined once.
 *
 * ALL COPY LIVES IN content/principles.md. See docs/EDITING-CONTENT.md.
 */
export default function PrinciplesPage() {
    const doc = getContent('principles');
    const endorsers = getUnEndorsers();
    const { principlesDoc, sections } = doc;
    const { lead, groups } = principlesDoc;

    // Grid order = the UN's own grouping. Detail order = 1-8, which reads as a
    // list rather than as three thematic clusters.
    const detailOrder = [lead, ...groups.flatMap((g) => g.items)].sort((a, b) => a.n - b.n);

    return (
        <div className="unnyc-pr unnyc-principles">
            <HeaderHeightVar />

            <header className="unnyc-pr-cw__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-pr-cw__header-title">{doc.title}</h1>
                    <p
                        className="unnyc-pr-cw__lede"
                        dangerouslySetInnerHTML={{ __html: inlineMd(doc.lede) }}
                    />
                </div>
            </header>

            {/* 1 — the eight, in the UN's own grouping. Every card is a jump link. */}
            <section className="unnyc-section unnyc-section--alt">
                <div className="unnyc-container">
                    {/* Both framing lines were cut from the content on
                        2026-08-14 so the grid reads as a list, not a preamble.
                        Rendered only if the key comes back — an empty <p> would
                        otherwise leave a stranded margin above the lead card. */}
                    {doc.gridIntro && (
                        <p className="unnyc-principles__intro">{doc.gridIntro}</p>
                    )}

                    <Link
                        href={`#${lead.slug}`}
                        className="unnyc-principles__tile unnyc-principles__tile--primary unnyc-principles__card"
                    >
                        <UnnycIcon name={lead.icon} size={56} className="unnyc-principles__tile-icon" />
                        <h2 className="unnyc-principles__tile-title">{lead.title}.</h2>
                        {lead.body.map((p, i) => (
                            <p key={i} className="unnyc-principles__tile-desc">{p}</p>
                        ))}
                    </Link>

                    {doc.gridCommitted && (
                        <p className="unnyc-principles__intro unnyc-principles__intro--committed">
                            {doc.gridCommitted}
                        </p>
                    )}

                    {groups.map((group) => (
                        <div className="unnyc-principles__group" key={group.title}>
                            <h2 className="unnyc-principles__group-title">{group.title}</h2>
                            <div className="unnyc-principles__grid">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`#${item.slug}`}
                                        className="unnyc-principles__tile unnyc-principles__card"
                                    >
                                        <UnnycIcon
                                            name={item.icon}
                                            size={56}
                                            className="unnyc-principles__tile-icon"
                                        />
                                        <h3 className="unnyc-principles__tile-title">{item.title}</h3>
                                        {/* `item.desc` is deliberately NOT rendered here
                                            (2026-08-14): the grid is a scannable list of
                                            the eight names, and the full description is
                                            two screens down in this page's own detail
                                            section. Do NOT delete `desc` from the content
                                            to match — /principles/document and
                                            /campaign/endorse/document fall back to it
                                            whenever `descCity` is absent, which is six of
                                            the seven items. */}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2 — the same eight, against NYC's reality. */}
            <section className="unnyc-principles__detail-intro">
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-principles__detail-title">{doc.detailTitle}</h2>
                    <p className="unnyc-principles__detail-lede">{doc.detailLede}</p>
                </div>
            </section>

            <div className="unnyc-pr-cw">
                {detailOrder.map((p) => {
                    const section = sections[p.slug];
                    return (
                        <section key={p.slug} id={p.slug} className="unnyc-pr-cw__section">
                            <div className="unnyc-container unnyc-container--narrow">
                                <div className="unnyc-pr-cw__heading">
                                    <UnnycIcon name={p.icon} size={40} className="unnyc-pr-cw__icon" />
                                    <h2 className="unnyc-pr-cw__title">
                                        {p.n}. {p.titleCanonical || p.title}
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
                                        <h3 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">
                                            {b.label}
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ __html: b.html }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* The organizations that endorsed the Principles. The list is DATA
                (content/un-endorsers.json), read here on the server and passed
                down — UnnycEndorserDirectory is a client component for the
                sector filter and cannot read the filesystem itself. Copy still
                comes from the markdown. */}
            <UnnycEndorserDirectory organizations={endorsers?.organizations} copy={doc.endorsers} />

            <section className="unnyc-principles__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-principles__foot-links">
                        {doc.foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                    <p className="unnyc-principles__doc-link">
                        <Link href="/principles/document">View as a printable one-pager ↗</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
