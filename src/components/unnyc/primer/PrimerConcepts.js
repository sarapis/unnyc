import { concepts } from '@/data/unnyc-primer';

/**
 * PrimerConcepts — the glossary of key terms (DPI, DPGs, OSPO, digital
 * sovereignty…). Each card: term, plain-English definition, and a
 * "why NYC should care" line that lands the concept locally.
 */
export default function PrimerConcepts() {
    return (
        <section id="concepts" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{concepts.title}</h2>
                    <p className="unnyc-section__desc">{concepts.lede}</p>
                </header>

                <div className="unnyc-pr-concepts__grid">
                    {concepts.terms.map((t, i) => (
                        <article key={i} id={t.slug} className="unnyc-pr-concept">
                            <h3 className="unnyc-pr-concept__term">{t.term}</h3>
                            <p className="unnyc-pr-concept__def">{t.def}</p>
                            <p className="unnyc-pr-concept__nyc">
                                <span className="unnyc-pr-concept__nyc-label">Why NYC should care</span>
                                {t.nyc}
                            </p>
                            {t.link && (
                                <a
                                    href={t.link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="unnyc-pr-concept__link"
                                >
                                    Learn more · {t.link.label} ↗
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
