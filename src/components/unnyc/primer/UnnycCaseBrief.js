import Image from 'next/image';
import Link from 'next/link';

/**
 * UnnycCaseBrief — a city's research brief, rendered AS the case body under
 * its banner on /success. The banner image (with the city's name on it) is
 * the card's own header; below it: one meta line (the orange kicker and the
 * date), the brief's subtitle as the heading, the abstract, then a native
 * <details> for the full paper. Inside the paper, after the last section, the
 * link to that city's catalogue on /ospo-strategy, then the bibliography as a
 * second, nested <details>.
 *
 * Deliberately little chrome around the words — the owner's rule for web text
 * is "less is more".
 *
 * Native disclosures, not state: nothing here needs JS to read, and the
 * storyscroller's reveal observer is NOT attached inside them — a
 * `data-reveal` node that starts inside a closed <details> never intersects,
 * so it would stay at opacity 0 when opened. Only the outer card reveals.
 *
 * Content comes from content/briefs/<case>.md via getBrief(); the banner from
 * the case in content/success.md; labels from success.md's `brief:` block.
 * A section's `### ` blocks (Munich's "Open questions" under §8) render as
 * plain sub-headed lists inside that section — the heading says what they
 * are; no box, no badge (owner call, 2026-10-06).
 */
export default function UnnycCaseBrief({ brief, banner }) {
    const { subtitle, date, abstractHtml, sections, bibliographyHtml, catalogHref, labels } = brief;

    return (
        <aside className="unnyc-success-story__brief" data-reveal="1" aria-label={banner?.title || subtitle}>
            {banner && (
                <div className="unnyc-success-story__case-banner unnyc-success-story__brief-banner">
                    {banner.src && (
                        <Image
                            src={banner.src}
                            alt={banner.alt || ''}
                            fill
                            sizes="(max-width: 900px) 100vw, 900px"
                            priority={banner.priority}
                            className="unnyc-success-story__case-banner-img"
                        />
                    )}
                    {/* No title and no scrim on the image (owner call, 2026-10-06):
                        the city is named by the rail and the aria-label, and the
                        heading below carries the card. */}
                </div>
            )}

            <div className="unnyc-success-story__brief-body">
                <p className="unnyc-success-story__brief-meta">
                    <span className="unnyc-success-story__brief-kicker">{labels.kicker}</span>
                    {date && <span className="unnyc-success-story__brief-date">{date}</span>}
                </p>
                {subtitle && <h3 className="unnyc-success-story__brief-heading">{subtitle}</h3>}

                <div className="unnyc-success-story__brief-abstract">
                    <h4>{labels.abstract}</h4>
                    <div className="unnyc-success-story__brief-prose" dangerouslySetInnerHTML={{ __html: abstractHtml }} />
                </div>

                <details className="unnyc-success-story__brief-details">
                    <summary>{labels.read}</summary>

                    <div className="unnyc-success-story__brief-paper">
                        {sections.map((s) => (
                            <section key={s.label} className="unnyc-success-story__brief-section">
                                <h4>{s.label}</h4>
                                <div className="unnyc-success-story__brief-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
                                {s.blocks.map((b) => (
                                    <div key={b.label} className="unnyc-success-story__brief-block">
                                        <h5>{b.label}</h5>
                                        <div className="unnyc-success-story__brief-prose" dangerouslySetInnerHTML={{ __html: b.html }} />
                                    </div>
                                ))}
                            </section>
                        ))}

                        {catalogHref && (
                            <p className="unnyc-success-story__brief-catalog">
                                <Link href={catalogHref} className="unnyc-success-story__brief-catalog-link">
                                    {labels.catalog} <span aria-hidden="true">→</span>
                                </Link>
                                <span className="unnyc-success-story__brief-catalog-hint">{labels.catalogHint}</span>
                            </p>
                        )}

                        {bibliographyHtml && (
                            <details className="unnyc-success-story__brief-details unnyc-success-story__brief-details--nested">
                                <summary>{labels.bibliography}</summary>
                                <div className="unnyc-success-story__brief-paper">
                                    <div
                                        className="unnyc-success-story__brief-prose unnyc-success-story__brief-bib"
                                        dangerouslySetInnerHTML={{ __html: bibliographyHtml }}
                                    />
                                </div>
                            </details>
                        )}
                    </div>
                </details>
            </div>
        </aside>
    );
}
