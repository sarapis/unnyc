'use client';

import { useEffect, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

/**
 * UnnycWorldMap — the storyscroller redesign's world map: a static d3-geo SVG
 * on a dark navy panel, replacing the Leaflet map in PrimerMapInner (see
 * docs/EDITING-CONTENT.md and the Global Movement storyscroller handoff).
 *
 * THREE DATA LAYERS, same argument as PrimerMapInner, painted bottom to top:
 *   1. the GovOSS country FILL — ground, not figure;
 *   2. the CTFG "government-built programs" dots — supporting evidence (this
 *      layer was not in the design prototype; the handoff explicitly calls
 *      for adding it back, "same dot style as OSPOs or a fourth legend
 *      entry" — implemented here as its own legend row);
 *   3. the curated POLICY markers (content/start.md `mapMarkers`) — the
 *      section's argument, drawn largest and labelled.
 *
 * Real Natural Earth geometry (world-atlas @2.0.2 via a CDN fetch, same as
 * the design prototype's unnyc-world-map.js) rather than a drawn outline —
 * the same runtime-fetch pattern PrimerMapInner already uses for Leaflet's
 * CARTO tiles, just for vector boundaries instead of raster tiles. Country
 * names from the atlas are matched against govoss.geo's 13 catalogue
 * countries by NAME (govoss.countries itself only carries ISO codes;
 * govoss.geo's features are the code→name bridge).
 *
 * No popups: unlike PrimerMapInner's keyboard-navigable GeoJSON layer, this
 * SVG is decorative (aria-label only) and the argument-carrying detail lives
 * in the accessible marker list rendered below it, per the design handoff.
 */

const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
const W = 920;
const H = 430;

/* The UN's NYC office and a label point out in the Atlantic, so the "UN
 * OSPO" leader line never crosses a border — decorative staging, not data. */
const UN_HQ = [-73.9686, 40.75];
const ATLANTIC_LABEL = [-46, 33];

/* Per-marker label anchor side, in the SAME order as content/start.md's
 * `mapMarkers` — mirrors the design handoff's hand-placed layout so the
 * European cluster's labels don't collide. */
const ANCHORS = ['sw', 'w', 'e', 'e', 'n', 'e', 's', 's'];
const ANCHOR_OFFSET = { e: [10, 4], w: [-10, 4], n: [0, -10], s: [0, 15], sw: [-8, 13] };
const ANCHOR_TO_TEXT = { w: 'end', sw: 'end', n: 'middle', s: 'middle', e: 'start' };

export default function UnnycWorldMap({ markers = [], legend = [], mapSource, govoss, ospos, ctfg }) {
    const [world, setWorld] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetch(ATLAS)
            .then((r) => r.json())
            .then((topo) => {
                if (!cancelled) setWorld(topo);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const hasFill = Boolean(govoss?.countries?.length && govoss?.geo?.features?.length);
    const hasOspos = Boolean(ospos?.points?.length);
    const hasCtfg = Boolean(ctfg?.projects?.length);

    let countries = [];
    let ospoDots = [];
    let ctfgDots = [];
    let markerDots = [];
    let leader = null;

    if (world?.objects?.countries) {
        const all = feature(world, world.objects.countries).features.filter(
            (f) => f.properties.name !== 'Antarctica',
        );
        const projection = geoNaturalEarth1().fitExtent(
            [
                [8, 8],
                [W - 8, H - 8],
            ],
            { type: 'FeatureCollection', features: all },
        );
        const path = geoPath(projection);

        const codeToName = hasFill
            ? new Map(govoss.geo.features.map((f) => [f.properties.code, f.properties.name]))
            : new Map();
        const catalogueByName = hasFill
            ? new Map(govoss.countries.map((c) => [codeToName.get(c.code), c]).filter(([name]) => name))
            : new Map();

        countries = all.map((f) => ({
            key: f.id ?? f.properties.name,
            d: path(f),
            catalogue: catalogueByName.get(f.properties.name) || null,
        }));

        if (hasOspos) {
            ospoDots = ospos.points
                .map((p) => projection([p.lng, p.lat]))
                .filter(Boolean)
                .map(([x, y]) => ({ x, y }));
        }

        if (hasCtfg) {
            ctfgDots = ctfg.projects
                .map((p) => projection([p.lng, p.lat]))
                .filter(Boolean)
                .map(([x, y]) => ({ x, y }));
        }

        markerDots = markers
            .map((m, i) => {
                const xy = projection([m.lng, m.lat]);
                if (!xy) return null;
                const anchor = ANCHORS[i] || 'e';
                const [ox, oy] = ANCHOR_OFFSET[anchor];
                return {
                    ...m,
                    x: xy[0],
                    y: xy[1],
                    labelX: xy[0] + ox,
                    labelY: xy[1] + oy,
                    textAnchor: ANCHOR_TO_TEXT[anchor] || 'start',
                    delay: 40 + (i % 2) * 70,
                };
            })
            .filter(Boolean);

        const from = projection(UN_HQ);
        const to = projection(ATLANTIC_LABEL);
        if (from && to) {
            leader = { x1: from[0] + 5, y1: from[1] + 3, x2: to[0] - 8, y2: to[1] - 4, labelX: to[0], labelY: to[1] };
        }
    }

    const SWATCH_STYLE = {
        city: { background: 'var(--wg-accent-warm)', border: '1.5px solid var(--wg-surface)' },
        nation: { background: 'var(--wg-surface)', border: '2px solid var(--wg-accent)' },
        ospo: { background: 'var(--wg-accent-warm)' },
    };

    return (
        <div className="unnyc-start-story__map-block">
            <div className="unnyc-start-story__map-panel" data-reveal="1" data-delay="120">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="unnyc-start-story__map-svg"
                    role="img"
                    aria-label="World map: countries with public code catalogues, and cities with public-sector open source program offices"
                >
                    {countries.map((c) => (
                        <path
                            key={c.key}
                            d={c.d}
                            style={{
                                fill: c.catalogue ? 'var(--wg-accent)' : 'var(--wg-surface)',
                                fillOpacity: c.catalogue ? 0.34 : 0.05,
                                stroke: 'var(--wg-surface)',
                                strokeOpacity: 0.22,
                            }}
                            strokeWidth={0.6}
                        />
                    ))}
                    {ctfgDots.map((p, i) => (
                        <circle
                            key={`ctfg-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={3}
                            style={{ fill: 'var(--wg-accent-strong)', stroke: 'var(--wg-surface)' }}
                            strokeWidth={1}
                            opacity={0.85}
                        />
                    ))}
                    {ospoDots.map((p, i) => (
                        <circle
                            key={`ospo-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={3.4}
                            style={{ fill: 'var(--wg-accent-warm)', stroke: 'var(--wg-brand-deep)' }}
                            strokeOpacity={0.7}
                            strokeWidth={0.8}
                        />
                    ))}
                    {markerDots.map((m, i) => (
                        <g key={m.label ?? i}>
                            <circle
                                cx={m.x}
                                cy={m.y}
                                r={m.type === 'city' ? 6 : 5}
                                style={{
                                    fill: m.type === 'city' ? 'var(--wg-accent-warm)' : 'var(--wg-surface)',
                                    stroke: m.type === 'city' ? 'var(--wg-surface)' : 'var(--wg-accent)',
                                }}
                                strokeWidth={m.type === 'city' ? 1.6 : 2.2}
                            />
                            <text
                                x={m.labelX}
                                y={m.labelY}
                                textAnchor={m.textAnchor}
                                paintOrder="stroke"
                                style={{ fill: 'var(--wg-surface)', stroke: 'var(--wg-brand-deep)', strokeOpacity: 0.85 }}
                                strokeWidth={3}
                                strokeLinejoin="round"
                                fontFamily="var(--wg-font-body)"
                                fontSize="11"
                                fontWeight="600"
                            >
                                {m.label}
                            </text>
                        </g>
                    ))}
                    {leader && (
                        <>
                            <path
                                d={`M${leader.x1} ${leader.y1} L${leader.x2} ${leader.y2}`}
                                style={{ stroke: 'var(--wg-surface)', strokeOpacity: 0.6 }}
                                strokeWidth={1}
                                fill="none"
                            />
                            <text
                                x={leader.labelX}
                                y={leader.labelY}
                                style={{ fill: 'var(--wg-surface)' }}
                                fontFamily="var(--wg-font-body)"
                                fontSize="12"
                                fontWeight="700"
                                letterSpacing="1.2"
                            >
                                UN OSPO
                            </text>
                        </>
                    )}
                </svg>

                <div className="unnyc-start-story__map-legend">
                    {legend.map((item) => (
                        <span key={item.type} className="unnyc-start-story__map-legend-item">
                            <i
                                className="unnyc-start-story__map-swatch"
                                style={SWATCH_STYLE[item.type] || SWATCH_STYLE.ospo}
                            />
                            {item.label}
                        </span>
                    ))}
                    {hasFill && (
                        <span className="unnyc-start-story__map-legend-item">
                            <i
                                className="unnyc-start-story__map-swatch unnyc-start-story__map-swatch--area"
                                style={{ background: 'var(--wg-accent)', border: '1px solid rgba(255,255,255,0.3)' }}
                            />
                            {mapSource?.govossLegendLabel || 'National open source catalogs'}
                        </span>
                    )}
                    {hasCtfg && (
                        <span className="unnyc-start-story__map-legend-item">
                            <i
                                className="unnyc-start-story__map-swatch"
                                style={{ background: 'var(--wg-accent-strong)' }}
                            />
                            {mapSource?.ctfgLegendLabel || 'Government-built programs'}
                        </span>
                    )}
                </div>
            </div>

            {markers.length > 0 && (
                <div className="unnyc-start-story__marker-list">
                    {markers.map((m, i) => (
                        <div
                            key={m.label}
                            className="unnyc-start-story__marker-row"
                            data-reveal="1"
                            data-delay={40 + (i % 2) * 70}
                        >
                            <span
                                className={
                                    'unnyc-start-story__marker-dot' +
                                    (m.type === 'city'
                                        ? ' unnyc-start-story__marker-dot--city'
                                        : ' unnyc-start-story__marker-dot--nation')
                                }
                            />
                            <p>
                                <strong>{m.label}</strong> — {m.desc}
                            </p>
                        </div>
                    ))}
                </div>
            )}

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
                        </span>,
                    );
                if (ctfg)
                    parts.push(
                        <span key="ctfg">
                            programs:{' '}
                            <a href={ctfg.sourceUrl} target="_blank" rel="noopener noreferrer">
                                {ctfg.source}
                            </a>{' '}
                            ({ctfg.licence})
                        </span>,
                    );
                if (ospos)
                    parts.push(
                        <span key="ospo">
                            OSPOs: <a href="/resources#ospos">this site</a>
                        </span>,
                    );
                if (govoss)
                    parts.push(<span key="ne">boundaries: {govoss.boundariesShort || govoss.boundaries}</span>);
                if (!parts.length) return null;
                return (
                    <p className="unnyc-start-story__map-credit" data-reveal="1">
                        {mapSource?.creditLead || 'Map data —'}{' '}
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
    );
}
