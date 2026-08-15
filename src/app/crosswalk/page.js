import Link from 'next/link';
import '../primer.css';
import './crosswalk.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycPrinciplesRail from '@/components/unnyc/UnnycPrinciplesRail';
import { getContent, inlineMd } from '@/lib/content';

/** Each reason heading is `### N. Title` (see content/crosswalk.md); split that
 * into the rail's {id, n, label} shape once, up front, so both the rail and
 * the block below it stay in sync from one source instead of two. Falls back
 * to the raw label if a heading is ever written without a leading number. */
function reasonToRailItem(block, i) {
    const m = block.label.match(/^(\d+)\.\s*(.+)$/);
    return {
        id: m ? `reason-${m[1]}` : `reason-${i + 1}`,
        n: m ? m[1] : i + 1,
        label: m ? m[2] : block.label,
    };
}

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
 * /crosswalk — "why this matters to NYC." Who pays for vendor reliance today,
 * and why New York is central to the movement.
 *
 * The principle-by-principle crosswalk that gave this page its name MOVED to
 * /principles on 2026-08-13, so it sits with the principles it maps rather than
 * restating them a page away. Moved, not copied — this repo has already spent a
 * day untangling drifted copies of the principles. The page name stayed: it is
 * still the crosswalk between the UN's agenda and NYC's reality, just the half
 * that is about NYC.
 *
 * ALL COPY ON THIS PAGE LIVES IN content/crosswalk.md — frontmatter for the
 * structure (titles, foot CTAs), markdown body for the prose, split into
 * `## <slug>` sections. This file is layout only; to change wording, edit the
 * markdown. See docs/EDITING-CONTENT.md.
 */
export default function CrosswalkPage() {
    const doc = getContent('crosswalk');
    const { sections } = doc;
    const railItems = sections.intro.blocks.map(reasonToRailItem);

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

            {/* No section subnav here on purpose — the page is now two sections
                long (the cost of vendor reliance, and why NYC is central), so
                there is nothing to jump past. See UnnycSectionNav for the rule. */}

            {/* Persuasive intro — the "meat" of the campaign */}
            <section className="unnyc-pr-why">
                <div className="unnyc-container unnyc-container--narrow">
                    <div dangerouslySetInnerHTML={{ __html: sections.intro.html }} />

                    {/* The rail is a SIBLING of the six blocks, absolutely positioned
                        into room this wrapper's padding-right makes above 1200px —
                        see crosswalk.css. Its sticky inner element is bounded by
                        this wrapper, which is what parks it at reason 6 instead of
                        following the reader into the foot CTAs. Reuses the same
                        UnnycPrinciplesRail component /principles uses; it is
                        generic (an {id, n, label} list), not principles-specific. */}
                    <div className="unnyc-pr-why__detail">
                        <UnnycPrinciplesRail
                            items={railItems}
                            title="The Six Reasons"
                            ariaLabel="Jump to a reason"
                        />

                        <div className="unnyc-pr-why__blocks">
                            {sections.intro.blocks.map((b, i) => {
                                // Splits the trailing pull-quote (if any) out of the prose so
                                // the two can float side by side instead of stacking.
                                const match = b.html.match(/^([\s\S]*?)(<blockquote[\s\S]*<\/blockquote>)\s*$/);
                                const prose = match ? match[1] : b.html;
                                const quote = match ? match[2] : null;
                                return (
                                    <div key={b.label} id={railItems[i].id} className="unnyc-pr-why__block">
                                        <h2 className="unnyc-pr-why__heading">{b.label}</h2>
                                        <div className="unnyc-pr-why__prose" dangerouslySetInnerHTML={{ __html: prose }} />
                                        {quote && <div dangerouslySetInnerHTML={{ __html: quote }} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* The eight per-principle sections MOVED to /principles on 2026-08-13.
                They were the same eight this page's argument leads up to, so they
                now sit with the principles themselves rather than being restated
                here. This page keeps what is genuinely its own: what vendor
                reliance costs New York, and why the city is central to the
                movement. The foot CTA hands off. */}

            {/* No closing section — removed 2026-08-14. The page ends on reason 6
                (whose last paragraph carries the center-of-the-world line) and
                hands off through the foot buttons. */}

            {/* Foot nav */}
            <section className="unnyc-pr-cw__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    {doc.foot.text && <p>{doc.foot.text}</p>}
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
