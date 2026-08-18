'use client';

import dynamic from 'next/dynamic';

/**
 * PrimerMovementNow — the "who's already doing this" map: governments advancing
 * open source, with NYC marked as "the ask."
 *
 * The endorsing-organizations list used to sit under this map. It MOVED to the
 * bottom of /principles on 2026-08-14 (see UnnycEndorserDirectory) — those are the
 * organizations that endorsed the Principles, so they belong with the
 * Principles rather than under a map of government programs.
 *
 * Leaflet needs browser globals, so the map is dynamically imported (ssr:false).
 */
const PrimerMapInner = dynamic(() => import('./PrimerMapInner'), { ssr: false });

export default function PrimerMovementNow({ mapMarkers, mapLegend, ctfg, govoss, ospos, mapSource, title, lede }) {
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
                    govoss={govoss}
                    govossLabel={mapSource?.govossLegendLabel}
                    ospos={ospos}
                    ospoLabel={mapSource?.ospoLegendLabel}
                />

                {/* ONE credit line for the whole map (2026-08-17). It was two
                    paragraphs restating each layer's counts; the counts are now in the
                    popups and the key, so repeating them here only gave a reader more
                    numbers to reconcile.

                    ⚠ What could NOT be shortened away: attribution is a LICENCE TERM
                    for two of these, and the two licences differ — GovOSS is CC BY 4.0,
                    CTFG is CC BY-NC-SA 4.0. Source name, link and licence stay for
                    both, and the licence strings are read from the snapshots so they
                    cannot drift from the data they describe.

                    Dropping the counts also retired a caveat: the old line had to
                    explain that 256 entries sit in cross-border catalogues no country
                    can be shaded for, because it claimed a total. Making no numeric
                    claim removes the need to qualify one.

                    Built as parts so a missing snapshot drops its own clause instead of
                    the whole line — same fail-soft posture as the loaders. */}
                {(() => {
                    const parts = [];
                    if (govoss)
                        parts.push(
                            <span key="govoss">
                                catalogs:{' '}
                                <a href={govoss.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    {govoss.source}
                                </a>{' '}
                                ({govoss.licence})
                            </span>
                        );
                    if (ctfg)
                        parts.push(
                            <span key="ctfg">
                                programs:{' '}
                                <a href={ctfg.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    {ctfg.source}
                                </a>{' '}
                                ({ctfg.licence})
                            </span>
                        );
                    if (ospos)
                        parts.push(
                            <span key="ospo">
                                OSPOs: <a href="/resources#ospos">this site</a>
                            </span>
                        );
                    if (govoss)
                        parts.push(
                            <span key="ne">boundaries: {govoss.boundariesShort || govoss.boundaries}</span>
                        );
                    if (!parts.length) return null;
                    return (
                        <p className="unnyc-pr-map__source">
                            {mapSource?.creditLead || 'Map data:'}{' '}
                            {parts.map((el, i) => (
                                <span key={i}>
                                    {i > 0 && ' · '}
                                    {el}
                                </span>
                            ))}
                            {(govoss || ctfg) && (
                                <>
                                    {' · '}snapshots {[govoss?.generated, ctfg?.generated].filter(Boolean).join(', ')}
                                </>
                            )}
                        </p>
                    );
                })()}

            </div>
        </section>
    );
}
