import Link from 'next/link';
import PrintButton from '@/components/unnyc/PrintButton';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('council-bill');
    return pageMetadata(meta, '/bill', 'article', 'council');
}

/**
 * council.opensource.nyc/bill — the model local law, section by section.
 *
 * The text is content/council-bill.md: `## preamble` and `## enactment` frame
 * the bill, and each `### <anchor>` block under the preamble is one section.
 * The homepage's plain-English summaries (`provisions`) name those anchors.
 *
 * ⚠ THROWS when a provision names an anchor the body does not have. A renamed
 * section would otherwise leave the homepage summarising text that no longer
 * exists, with a green build — the same reason principlesResolve() throws.
 */
export default function CouncilBillPage() {
    const doc = getContent('council-bill');
    const blocks = doc.sections?.preamble?.blocks ?? [];
    const byAnchor = new Map(blocks.map((b) => [b.label, b]));
    for (const p of doc.provisions ?? []) {
        if (!byAnchor.has(p.anchor)) {
            throw new Error(`content/council-bill.md: provision "${p.anchor}" has no "### ${p.anchor}" section in the bill text.`);
        }
    }

    return (
        <div className="council council-bill">
            <section className="council__hero council__hero--short">
                <div className="unnyc-container">
                    <p className="council__kicker">{doc.kicker}</p>
                    <h1 className="council__title">{doc.title}</h1>
                    <p className="council__status">{doc.status}</p>
                    <div className="council__actions">
                        <PrintButton variant="outline">Print / Save as PDF</PrintButton>
                        <Link href="/" className="council__link council__link--inverse">
                            ← Why New York needs it
                        </Link>
                    </div>
                </div>
            </section>

            <section className="council__section">
                <div className="unnyc-container council-bill__layout">
                    <nav className="council-bill__toc" aria-label="Sections of the bill">
                        <p className="council-bill__toc-title">In this bill</p>
                        <ol>
                            {(doc.provisions ?? []).map((p) => (
                                <li key={p.anchor}>
                                    <a href={`#${p.anchor}`}>{p.title}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <article className="council-bill__text">
                        <p className="council-bill__long-title">{doc.billTitle}</p>
                        <div dangerouslySetInnerHTML={{ __html: doc.sections.preamble.html }} />
                        {blocks.map((b) => {
                            const p = (doc.provisions ?? []).find((x) => x.anchor === b.label);
                            return (
                                <section key={b.label} id={b.label} className="council-bill__section">
                                    {p && <p className="council-bill__plain">In plain English: {p.summary}</p>}
                                    <div dangerouslySetInnerHTML={{ __html: b.html }} />
                                </section>
                            );
                        })}
                        {doc.sections.enactment && (
                            <div className="council-bill__section" dangerouslySetInnerHTML={{ __html: doc.sections.enactment.html }} />
                        )}
                    </article>
                </div>
            </section>
        </div>
    );
}
