
/**
 * PrimerOspoDirectory — "Find an OSPO": public-sector Open Source Program
 * Offices already running elsewhere. Sourced from the FLOSS PSO Network's
 * directory (see data/unnyc-primer.js for provenance).
 *
 * Rendered as one continuous grid rather than a grid per country — several
 * countries in the source data have only one OSPO, and a per-country grid
 * left those rows mostly empty. Each card carries its own country tag
 * instead, so cards still read grouped (data is listed country by country)
 * without leaving gaps.
 */
import Image from 'next/image';

export default function PrimerOspoDirectory({ ospoDirectory }) {
    if (!ospoDirectory) return null;
    const items = ospoDirectory.groups.flatMap((group) =>
        group.items.map((item) => ({ ...item, country: group.country }))
    );

    return (
        <section id="ospos" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{ospoDirectory.title}</h2>
                    <p className="unnyc-section__desc">{ospoDirectory.lede}</p>
                </header>

                {ospoDirectory.intro && (
                    <p className="unnyc-pr-ospo__intro">{ospoDirectory.intro}</p>
                )}

                {ospoDirectory.diagram && (
                    <figure className="unnyc-pr-ospo__diagram">
                        {/* next/image for WebP + responsive sizing. width/height
                            must match the FILE's real aspect ratio — they size the
                            reserved box before the image loads, and CSS
                            `height: auto` hides a mismatch in the final render
                            while still shifting layout on the way there. Currently
                            /images/resources/ospo-archetypes.jpg at 1800x803;
                            update these two numbers if the diagram is replaced. */}
                        <Image
                            src={ospoDirectory.diagram.src}
                            alt={ospoDirectory.diagram.alt}
                            width={1800}
                            height={803}
                            sizes="(max-width: 900px) 100vw, 900px"
                        />
                        <figcaption>
                            {ospoDirectory.diagram.creditHref ? (
                                <a
                                    href={ospoDirectory.diagram.creditHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {ospoDirectory.diagram.creditText}
                                </a>
                            ) : (
                                ospoDirectory.diagram.creditText
                            )}
                        </figcaption>
                    </figure>
                )}

                <p className="unnyc-pr-ospo__source">
                    Full, regularly-updated list maintained by{' '}
                    <a href={ospoDirectory.sourceUrl} target="_blank" rel="noopener noreferrer">
                        the FLOSS PSO Network ↗
                    </a>
                </p>

                <div className="unnyc-pr-ospo__grid">
                    {items.map((item) => (
                        <article key={item.url} className="unnyc-pr-ospo__card">
                            <span className="unnyc-pr-ospo__country">{item.country}</span>
                            <h4 className="unnyc-pr-ospo__name">{item.name}</h4>
                            <p className="unnyc-pr-ospo__desc">{item.description}</p>
                            <div className="unnyc-pr-ospo__links">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    Visit ↗
                                </a>
                                {item.email && <a href={`mailto:${item.email}`}>Email</a>}
                                {item.flossPolicy && (
                                    <a href={item.flossPolicy} target="_blank" rel="noopener noreferrer">
                                        Policy ↗
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
