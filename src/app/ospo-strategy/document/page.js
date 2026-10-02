import '../../printable-doc.css';
import PrintButton from '@/components/unnyc/PrintButton';
import { getContent } from '@/lib/content';
import { pageMetadata, routeForPath, routeMeta } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { breadcrumbLd } from '@/lib/structured-data';

export async function generateMetadata() {
    // `metaDocument`, not `meta` — this page shares content/ospo-strategy.md
    // with /ospo-strategy and would otherwise state the same title and carry
    // the same preview image. See `metaKey` in src/lib/seo.js.
    const path = '/ospo-strategy/document';
    const doc = getContent('ospo-strategy');
    return pageMetadata(routeMeta(doc, routeForPath(path)), path);
}

/**
 * /ospo-strategy/document — the executive summary as a standalone, printable
 * memo, for putting directly in front of the CTO, the Mayor and the
 * administration. Named `document` to match the site's two other printables.
 *
 * Reads the SAME content as /ospo-strategy: the `## summary` section, the
 * `memo` header and the `summary.recommendations` list from
 * content/ospo-strategy.md. Nothing is duplicated here, so the web page and
 * the paper never disagree. Shares its "paper" styling (printable-doc.css)
 * with the other two printables.
 */
export default function OspoDocumentPage() {
    // getContent reads the filesystem — called in the component, never at
    // module scope (see CLAUDE.md), so content edits appear without a restart.
    const doc = getContent('ospo-strategy');
    const { memo, summary } = doc;
    const section = doc.sections.summary;

    return (
        <div className="unnyc-doc-wrap">
            <StructuredData data={breadcrumbLd('/ospo-strategy/document')} />
            <div className="unnyc-doc-toolbar">
                <PrintButton>Print / Save as PDF</PrintButton>
                <p className="unnyc-doc-toolbar__note">
                    Opens your browser&rsquo;s print dialog — choose &ldquo;Save as PDF&rdquo; to download.
                </p>
            </div>

            <main className="unnyc-doc-page">
                <header className="unnyc-doc-page__letterhead">
                    <p className="unnyc-doc-page__city">UNNYC</p>
                    <p className="unnyc-doc-page__office">{memo.kicker}</p>
                </header>

                <h1 className="unnyc-doc-page__title">{memo.documentTitle}</h1>

                <dl className="unnyc-doc-page__memo">
                    {memo.addressed.map((row) => (
                        <div key={row.label} className="unnyc-doc-page__memo-row">
                            <dt>{row.label}</dt>
                            <dd>{row.value}</dd>
                        </div>
                    ))}
                    <div className="unnyc-doc-page__memo-row">
                        <dt>Date</dt>
                        <dd>{memo.date}</dd>
                    </div>
                </dl>

                {/* The section's lead paragraph(s), then each `### Label` block
                    as a headed passage — markdown already rendered to HTML by
                    content.js, same renderer the web page uses. */}
                <div
                    className="unnyc-doc-page__prose unnyc-doc-page__prose--lead"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                />
                {section.blocks.map((b) => (
                    <section key={b.label} className="unnyc-doc-page__group">
                        <h2 className="unnyc-doc-page__group-title">{b.label}</h2>
                        <div className="unnyc-doc-page__prose" dangerouslySetInnerHTML={{ __html: b.html }} />
                    </section>
                ))}

                <section className="unnyc-doc-page__group">
                    <h2 className="unnyc-doc-page__group-title">{summary.recommendationsTitle}</h2>
                    <ol className="unnyc-doc-page__numbered">
                        {summary.recommendations.map((r) => (
                            <li key={r.title}>
                                <strong>{r.title}</strong> {r.desc}
                            </li>
                        ))}
                    </ol>
                </section>

                <footer className="unnyc-doc-page__footnote">{memo.footnote}</footer>
            </main>
        </div>
    );
}
