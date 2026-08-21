/**
 * PrimerOpenData — "Open Data" on /resources: the human way in to the four
 * datasets the site publishes at /data/*.json.
 *
 * WHY IT LIVES HERE. Those files shipped with no visible link anywhere; discovery
 * was llms.txt and the Dataset markup, which serves machines and nobody else.
 * /resources is the site's own reference directory, so a reader who would want a
 * CSV-shaped answer is already on this page.
 *
 * ⚠ EVERY ROW IS DERIVED, NOTHING IS AUTHORED. Name, description, record count,
 * licence and URL all come from `datasetIndex()` — the same envelope
 * /data/index.json serves, which is built from the same content files the pages
 * render. A count typed into markdown would go stale the next time a snapshot is
 * refreshed, which is exactly why the endorser directory derives its own; only
 * the section's title, lede and note are copy.
 *
 * `ours` distinguishes the two we compiled from the two we redistribute, because
 * "who to credit" is the one thing a reader taking the data most needs and would
 * otherwise have to open each file to learn. It is inferred from the attribution
 * string the dataset itself carries rather than a second list here.
 */
/**
 * The dataset envelope's `url` is ABSOLUTE, and correctly so — a consumer of
 * /data/*.json needs a URL it can fetch from anywhere. An anchor on the page
 * wants the opposite: root-relative, so it follows whatever origin the reader is
 * on. Absolute hrefs here would send anyone on a preview deployment (or a dev
 * server) to production's copy of the file instead of the one they are testing.
 * Falls back to the absolute URL if it is ever not parseable.
 */
function hrefFor(url) {
    try {
        return new URL(url).pathname;
    } catch {
        return url;
    }
}

export default function PrimerOpenData({ copy, datasets }) {
    if (!copy || !datasets?.length) return null;

    return (
        <section id="open-data" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{copy.title}</h2>
                    <p className="unnyc-section__desc">{copy.lede}</p>
                </header>

                <ul className="unnyc-pr-data__list">
                    {datasets.map((d) => {
                        const ours = d.attribution.startsWith('UNNYC');
                        return (
                            <li key={d.slug} className="unnyc-pr-data__item">
                                <a className="unnyc-pr-data__link" href={hrefFor(d.url)}>
                                    {d.name}
                                </a>
                                <p className="unnyc-pr-data__desc">{d.description}</p>
                                <p className="unnyc-pr-data__meta">
                                    <span className="unnyc-pr-data__count">{d.count} records</span>
                                    {' · '}
                                    <span>{d.licence}</span>
                                    {' · '}
                                    {/* Says who to credit, not just what the licence is:
                                        both are CC BY 4.0 today, so the licence alone
                                        would not tell a reuser whose name goes on it. */}
                                    <span>
                                        {ours ? 'compiled by this campaign' : `credit ${d.source}`}
                                    </span>
                                </p>
                            </li>
                        );
                    })}
                </ul>

                <p className="unnyc-pr-data__note">{copy.note}</p>

                <p className="unnyc-pr-data__links">
                    <a href="/data/index.json">{copy.indexLabel}</a>
                    {' · '}
                    <a href="/llms.txt">{copy.llmsLabel}</a>
                </p>
            </div>
        </section>
    );
}
