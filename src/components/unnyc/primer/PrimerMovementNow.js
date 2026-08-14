'use client';

import dynamic from 'next/dynamic';

/**
 * PrimerMovementNow — the "who's already doing this" map: governments advancing
 * open source, with NYC marked as "the ask."
 *
 * The endorsing-organizations list used to sit under this map. It MOVED to the
 * bottom of /principles on 2026-08-14 (see PrimerEndorsers) — those are the
 * organizations that endorsed the Principles, so they belong with the
 * Principles rather than under a map of government programs.
 *
 * Leaflet needs browser globals, so the map is dynamically imported (ssr:false).
 */
const PrimerMapInner = dynamic(() => import('./PrimerMapInner'), { ssr: false });

export default function PrimerMovementNow({ mapMarkers, mapLegend, ctfg, mapSource, title, lede }) {
    if (!mapMarkers) return null;
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

            </div>
        </section>
    );
}
