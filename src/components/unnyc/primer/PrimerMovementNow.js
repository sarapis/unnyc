'use client';

import dynamic from 'next/dynamic';

/**
 * PrimerMovementNow — combined "who's already in" section. Merges the former
 * "The World Is Moving" map (governments advancing open source) with the
 * "Endorsers & Contributors" list (organizations that endorsed the UN
 * Principles) into one momentum/social-proof block. The map itself carries
 * the Barcelona-first / NYC-should-follow message — Barcelona is the one
 * "city" marker on the map, NYC is marked as "the ask."
 *
 * Leaflet needs browser globals, so the map is dynamically imported (ssr:false).
 */
const PrimerMapInner = dynamic(() => import('./PrimerMapInner'), { ssr: false });

export default function PrimerMovementNow({ endorsers, mapMarkers, mapLegend, ctfg, mapSource, title, lede }) {
    if (!endorsers) return null;
    return (
        <section id="going-open-source" className="unnyc-section unnyc-section--alt unnyc-section--map">
            <div className="unnyc-container">
                {/* Title and lede come from content/start.md (`movementNow`). They
                    were hardcoded here until 2026-08-13 — the last of the copy
                    this component owned, and the reason a wording change needed a
                    developer. See docs/CONTENT-MAP.md. */}
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{title}</h2>
                    <p className="unnyc-section__desc">{lede}</p>
                </header>

                <PrimerMapInner
                    markers={mapMarkers}
                    legend={mapLegend}
                    projects={ctfg?.projects || []}
                    projectsLabel={mapSource?.ctfgLegendLabel}
                />

                {/* CTFG directory content is CC BY-NC-SA 4.0 — the credit is a licence
                    term, not a courtesy. Copy lives in content/start.md; the counts and
                    the link come from the snapshot so they can't drift from the data. */}
                {ctfg && (
                    <p className="unnyc-pr-map__source">
                        {mapSource?.ctfgCredit ||
                            'Government open source programs are drawn from the'}{' '}
                        <a href={ctfg.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {ctfg.source}
                        </a>{' '}
                        — {ctfg.count} open source programs built by public bodies across{' '}
                        {ctfg.countries} countries. Each dot links to its full profile.
                        Data licensed {ctfg.licence}; snapshot taken {ctfg.generated}.
                    </p>
                )}

                <p className="unnyc-pr-map__source">
                    This map is illustrative. For the full global picture, explore the{' '}
                    <a href="https://dpimap.org/" target="_blank" rel="noopener noreferrer">
                        DPI Map
                    </a>{' '}
                    (UCL IIPP) — click any of 210 countries to see the digital ID, payment,
                    and data-exchange systems it runs.
                </p>

                <div className="unnyc-pr-mn__endorsers">
                    <h3 className="unnyc-pr-mn__subhead">The organizations that have signed on</h3>
                    <p className="unnyc-pr-mn__lede">{endorsers.lede}</p>

                    <ul className="unnyc-pr-endorsers__grid">
                        {endorsers.orgs.map((org, i) => (
                            <li key={i} className="unnyc-pr-endorsers__org">
                                <a href={org.url} target="_blank" rel="noopener noreferrer">
                                    {org.name} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
