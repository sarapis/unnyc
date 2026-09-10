'use client';

import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import worldAtlas from '../../../../content/world-atlas.json';

/**
 * UnnycWorldMap — the storyscroller redesign's world map: a static d3-geo SVG
 * on a dark navy panel. It replaced a Leaflet map (PrimerMapInner), which was
 * deleted on 2026-09-10 — so this is now the site's only map. See
 * docs/EDITING-CONTENT.md and the Global Movement storyscroller handoff.
 *
 * THREE DATA LAYERS, carrying the same argument the Leaflet map did, painted
 * bottom to top:
 *   1. the GovOSS country FILL — ground, not figure;
 *   2. the CTFG "government-built programs" dots — supporting evidence (this
 *      layer was not in the design prototype; the handoff explicitly calls
 *      for adding it back, "same dot style as OSPOs or a fourth legend
 *      entry" — implemented here as its own legend row);
 *   3. the curated POLICY markers (content/start.md `mapMarkers`) — the
 *      section's argument, drawn largest and labelled.
 *
 * Real Natural Earth geometry rather than a drawn outline. Country names from
 * the atlas are matched against govoss.geo's 13 catalogue countries by NAME
 * (govoss.countries itself only carries ISO codes; govoss.geo's features are
 * the code→name bridge).
 *
 * ⚠ THE BOUNDARIES ARE A SNAPSHOT IN THE REPO, NOT A RUNTIME FETCH — changed
 * 2026-09-10, and the reason is the whole point of this file's existence. The
 * first version of this component `fetch()`ed the atlas from
 * cdn.jsdelivr.net on every visit to `/` and `/start`, inheriting exactly the
 * runtime-third-party dependency that had just cost the site its old map:
 * CARTO put their free basemap behind an API key and kept answering HTTP 200
 * with a valid PNG, every tile stamped "API KEY REQUIRED". No error, no
 * failed request, nothing for a monitor to see. jsdelivr blocked or slow
 * meant a map with no countries. Refresh the snapshot with
 * `node scripts/fetch-world-atlas.mjs` and read its summary (country count +
 * sha256) — the coordinates themselves are not reviewable in a diff.
 *
 * A STATIC IMPORT, deliberately, where `getCtfgProjects()` and
 * `getGovossCatalogues()` are fail-soft server-side reads. Those are called
 * on the server and a missing file costs a layer; this is a bundler import in
 * a client component, so a missing file fails the BUILD. That is the louder
 * and cheaper failure: nobody can ship a countryless map by accident. It also
 * means the geometry rides a content-hashed JS chunk our own CDN caches
 * immutably, instead of being re-sent in every HTML response the way a
 * server-passed prop would be.
 *
 * NO POPUPS, AND EVERY LAYER'S DETAIL IS IN TEXT INSTEAD. The SVG is
 * decorative — `role="img"` with one `aria-label`, which deliberately hides
 * its whole subtree from assistive tech. That is why detail is NOT wired onto
 * the shapes: a `tabindex` inside a `role="img"` produces a focus stop with no
 * accessible name, and an SVG `<path>` cannot hold a link at all.
 *
 * So each layer's detail is rendered as real text below the map:
 *   - the policy markers, in `__marker-list` (8 rows, from the design handoff);
 *   - the GovOSS country fill, in `__catalogues` — ADDED 2026-09-10.
 *
 * ⚠ The catalogue list is not only an accessibility fix. Replacing Leaflet
 * with this SVG dropped the per-country popups, and with them the entry counts
 * and the links to each government's own catalogue — for EVERYONE, mouse users
 * included, not just for keyboard and screen-reader users. The flat fill says
 * "this government publishes a catalogue" and nothing more. A `<details>`
 * disclosure restores the rest without adding thirteen rows of text to a
 * finished design, and `<summary>` is focusable natively, so the keyboard path
 * needs no ARIA of our own.
 *
 * ⚠ What is still NOT reachable, stated plainly so nobody records it as done:
 * the geography itself. You cannot tab a country's shape, and hovering a
 * polygon reveals nothing. The counts are reachable; their position on the map
 * is not. PrimerMapInner's per-country tabindex/aria wiring on GeoJSON paths
 * is the implementation that had this, and it is orphaned.
 */

/* The topology itself, unwrapped from the snapshot's provenance envelope
 * (source, version, countryCount, sha256 — see scripts/fetch-world-atlas.mjs). */
const world = worldAtlas.topology;

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
    const hasFill = Boolean(govoss?.countries?.length && govoss?.geo?.features?.length);
    const hasOspos = Boolean(ospos?.points?.length);
    const hasCtfg = Boolean(ctfg?.projects?.length);

    /* The country fill's data as TEXT — see the accessibility note in the file
     * header. Built outside the projection block on purpose: it needs no
     * geometry, so it still renders if the atlas ever fails to decode.
     * Sorted by size because "who publishes the most" is the readable order;
     * `entries` is each country's own figure and they are NEVER summed. */
    const catalogueCountries = (govoss?.countries || [])
        .map((c) => ({
            ...c,
            name:
                govoss?.geo?.features?.find((f) => f.properties.code === c.code)?.properties.name ||
                c.code,
        }))
        .sort((a, b) => b.entries - a.entries);

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

            {catalogueCountries.length > 0 && (
                <details className="unnyc-start-story__catalogues" data-reveal="1">
                    <summary className="unnyc-start-story__catalogues-summary">
                        {mapSource?.cataloguesLabel || 'Catalogue counts, country by country'}
                        {/* Derived, never authored — the label in content/start.md
                            deliberately carries no number.
                            ⚠ The literal space matters and is not cosmetic: the span
                            is spaced visually by `margin-left`, but margin is not
                            text, so without this the accessible name concatenated to
                            "…country by country13 countries". Caught by reading
                            innerText in a browser, which is the only place it shows. */}
                        {' '}
                        <span className="unnyc-start-story__catalogues-count">
                            {catalogueCountries.length} countries
                        </span>
                    </summary>
                    {/* A real <ul>, so assistive tech announces how many countries
                        there are. ⚠ Its margin/padding rules are scoped with
                        `.unnyc-page` in world-map.css: `.unnyc-page ul { margin: 0 }`
                        is a (0,1,1) reset that beats a single-class rule in the same
                        layer — the trap CLAUDE.md counts six bugs from. */}
                    <ul className="unnyc-start-story__catalogue-list">
                        {catalogueCountries.map((c) => (
                            <li key={c.code} className="unnyc-start-story__catalogue-row">
                                <p className="unnyc-start-story__catalogue-country">
                                    <strong>{c.name}</strong>
                                    {' — '}
                                    {c.entries.toLocaleString()} projects
                                </p>
                                <p className="unnyc-start-story__catalogue-sources">
                                    {c.catalogues.map((cat, i) => (
                                        <span key={cat.site}>
                                            {i > 0 && ' · '}
                                            <a href={cat.site} target="_blank" rel="noopener noreferrer">
                                                {cat.label}
                                            </a>{' '}
                                            ({cat.entries.toLocaleString()})
                                        </span>
                                    ))}
                                </p>
                            </li>
                        ))}
                    </ul>
                </details>
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
