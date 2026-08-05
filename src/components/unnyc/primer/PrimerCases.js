"use client";


/**
 * A single case-study card. `hidden` marks cards in the duplicated set used
 * to create the seamless carousel loop — kept out of the accessibility
 * tree and tab order so screen readers / keyboard users only encounter
 * each case study once.
 */
function CaseCard({ c, hidden }) {
    return (
        <article className="unnyc-pr-case" aria-hidden={hidden || undefined}>
            <div className="unnyc-pr-case__image-wrap">
                <img
                    src={c.image}
                    alt=""
                    className="unnyc-pr-case__image"
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                />
            </div>
            <div className="unnyc-pr-case__content">
                <div className="unnyc-pr-case__place">{c.place}</div>
                <h3 className="unnyc-pr-case__headline">{c.headline}</h3>
                <p className="unnyc-pr-case__body">{c.body}</p>
                <p className="unnyc-pr-case__lesson">
                    <span className="unnyc-pr-case__lesson-label">Lesson for NYC</span>
                    {c.lesson}
                </p>
                <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="unnyc-pr-case__link"
                    tabIndex={hidden ? -1 : undefined}
                >
                    Learn more →
                </a>
            </div>
        </article>
    );
}

/**
 * PrimerCases — further case studies of governments running open source
 * programs now (Munich, Estonia, Germany, India, DHIS2, OpenCRVS). Barcelona
 * and Paris get full narrative treatment on /success instead of a
 * card here. Renders as a continuously scrolling, hover-to-pause carousel
 * (the item list is duplicated once so the loop has no visible seam) rather
 * than a static grid, with each card fronted by an image pulled from the
 * linked site's own Open Graph tag (Munich has none, so its city-crest logo
 * is used instead).
 */
export default function PrimerCases({ cases }) {
    if (!cases) return null;
    return (
        <section id="cases" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{cases.title}</h2>
                    <p className="unnyc-section__desc">{cases.lede}</p>
                </header>
            </div>

            <div className="unnyc-pr-cases__viewport">
                <div className="unnyc-pr-cases__track">
                    {cases.items.map((c, i) => (
                        <CaseCard c={c} key={`case-${i}`} />
                    ))}
                    <div aria-hidden="true" style={{ display: 'contents' }}>
                        {cases.items.map((c, i) => (
                            <CaseCard c={c} key={`case-dup-${i}`} hidden />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
