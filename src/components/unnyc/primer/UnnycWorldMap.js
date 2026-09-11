'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
 * THE PINS ARE INTERACTIVE (2026-09-11). Three of the four layers open a popup
 * on click, Enter or Space: the policy markers, the OSPO points, and the 13
 * shaded catalogue countries. ⚠ The CTFG dots are DELIBERATELY NOT
 * interactive — 62 dots at r=3 are the densest layer and the one where
 * overlapping 22px hit areas would fight each other at world zoom. Owner's
 * call; if they ever become clickable, solve the density first.
 *
 * ⚠ `role="img"` HAD TO GO, and that is the load-bearing part. It makes the
 * whole subtree presentational, so a focusable child inside one is a focus stop
 * with NO accessible name — which is exactly why an earlier version of this
 * file put all detail in text and said the shapes could not carry it. The SVG
 * is now `role="group"` with the same label, every decorative child is
 * explicitly `aria-hidden`, and only the interactive layers are exposed. Put
 * `role="img"` back and you must delete the pins with it.
 *
 * Each interactive element is a `<g>`/`<path>` with `role="button"`,
 * `tabIndex`, `aria-expanded` and an `aria-label` that says what the popup
 * will say — so the information is available without opening anything.
 * ⚠ Hit areas are a transparent `r=11`/`r=12` circle UNDER the visible dot,
 * because the dots themselves are 6.8-12px across and WCAG 2.5.8 wants 24px on
 * a non-inline target. `fill: transparent`, never `fill: none` — `none` is not
 * hit-testable.
 *
 * ⚠ TARGET SIZE: THE PINS DO NOT MEET WCAG 2.5.8 ON THEIR OWN, and pretending
 * otherwise would be the easy lie here. The hit circles are r=11/12 in SVG
 * user units, but the SVG is scaled to its container — measured 19-21px at a
 * 1440px viewport and roughly 7px on a 375px phone (the panel is ~279px wide
 * against a 920-unit viewBox). Enlarging them enough for 24px at phone scale
 * would make neighbouring European pins overlap into one another.
 * What carries this instead is 2.5.8's "Equivalent" exception — the same
 * function available through another control on the SAME page:
 *   - policy markers  -> `__marker-list`, 8 rows of real text. Covered.
 *   - country fill    -> the `__catalogues` disclosure, 13 rows. Covered.
 *   - OSPO points     -> ⚠ NOTHING ON THIS PAGE. Neither `/` nor `/start`
 *     renders an OSPO list; the credit line links to `/resources#ospos`, which
 *     is a DIFFERENT page and so does not satisfy the exception.
 * So the OSPO layer is the one real gap. Fix it by giving OSPOs a text list
 * beside the other two rather than by inflating the hit circles.
 *
 * THE TEXT LISTS STAY, and are not redundant. `__marker-list` (8 rows) and the
 * `__catalogues` disclosure (13 countries) remain the path that needs no
 * pointer and no JavaScript beyond hydration. Replacing Leaflet once dropped
 * the per-country popups and with them the counts and links FOR EVERY READER;
 * the lists are what fixed that, and deleting them because "the pins have it
 * now" would re-open the same hole for anyone the pins do not serve.
 *
 * ⚠ Still true: the popup is HTML positioned over the panel, not an SVG
 * `<foreignObject>` — it needs links, wrapping text and normal focus, and JSX
 * escapes third-party content for free where Leaflet's HTML strings needed a
 * hand-written `esc()`.
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

    /* The open popup, as {kind, id} — null when none. One at a time, because two
     * cards open at world zoom would overlap each other more often than not. */
    const [open, setOpen] = useState(null);
    const panelRef = useRef(null);
    const closePopup = useCallback(() => setOpen(null), []);

    /* Escape closes, and focus goes back to whatever opened it — a popup that
     * strands focus in a dismissed card is worse than no popup. */
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            e.stopPropagation();
            closePopup();
            const opener = panelRef.current?.querySelector(`[data-pin="${open.kind}:${open.id}"]`);
            if (opener) opener.focus();
        };
        /* Pointer-down rather than click: a click listener added during the
         * click that OPENED the popup fires on that same event and closes it
         * again immediately. */
        const onDown = (e) => {
            if (!panelRef.current) return;
            const inPopup = e.target.closest?.('.unnyc-start-story__popup');
            const onPin = e.target.closest?.('[data-pin]');
            if (!inPopup && !onPin) closePopup();
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('pointerdown', onDown);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('pointerdown', onDown);
        };
    }, [open, closePopup]);

    const isOpen = (kind, id) => open?.kind === kind && open?.id === id;
    const toggle = (kind, id) => setOpen((cur) => (cur?.kind === kind && cur?.id === id ? null : { kind, id }));
    /* SVG user units -> % of the viewBox, so the popup positions itself against
     * the panel however the SVG is scaled.
     *
     * ⚠ TWO CLAMPS, both for the same reason: `.unnyc-start-story__map-panel`
     * is `overflow: hidden` (it has to be — the panel has rounded corners), so
     * anything that escapes its box is CLIPPED, not merely ugly. A card opened
     * on a pin in the top half rendered 123px above the panel and was cut off.
     *   - vertically: pins above the midline get their card BELOW them.
     *   - horizontally: the card's centre is kept away from the edges, so a pin
     *     near the rim doesn't push half the card out of the panel. The card
     *     has no tail, and the open pin brightens and grows, so a few percent
     *     of drift costs nothing. */
    const pct = (x, y) => ({
        left: `${Math.min(80, Math.max(20, (x / W) * 100))}%`,
        top: `${(y / H) * 100}%`,
    });

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

        countries = all.map((f) => {
            const catalogue = catalogueByName.get(f.properties.name) || null;
            return {
                key: f.id ?? f.properties.name,
                name: f.properties.name,
                d: path(f),
                catalogue,
                /* Only the 13 shaded countries are interactive, so only they pay
                 * for a centroid — it positions the popup, nothing else. */
                centroid: catalogue ? path.centroid(f) : null,
            };
        });

        if (hasOspos) {
            /* ⚠ KEEP THE PAYLOAD, don't just project the coordinates. Until
             * 2026-09-11 this was `.map(([x, y]) => ({ x, y }))`, which threw
             * away the city, the country and the OSPOs themselves — so the dots
             * could be drawn but nothing could ever be said about them. Same
             * for the country centroids above. */
            ospoDots = ospos.points
                .map((p) => {
                    const xy = projection([p.lng, p.lat]);
                    return xy ? { ...p, x: xy[0], y: xy[1] } : null;
                })
                .filter(Boolean);
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

    /* One shape for all three interactive layers, so the card markup stays a
     * single component instead of three near-copies. Built here rather than in
     * the JSX because it needs the projected coordinates from above. */
    let popup = null;
    if (open?.kind === 'marker') {
        const m = markerDots[open.id];
        if (m) popup = { x: m.x, y: m.y, title: m.label, desc: m.desc };
    } else if (open?.kind === 'ospo') {
        const p = ospoDots[open.id];
        if (p)
            popup = {
                x: p.x,
                y: p.y,
                title: `${p.city}, ${p.country}`,
                meta: `${p.ospos.length} public sector open source program ${p.ospos.length === 1 ? 'office' : 'offices'}`,
                /* ⚠ Each entry keeps its OWN city, because points within 25 km
                 * are merged onto one dot (OSPO_MERGE_KM) — four French OSPOs
                 * are in Paris and the IGN's is in Saint-Mandé. Merging changes
                 * what is DRAWN, never what is CLAIMED. `(HQ)` marks a
                 * coordinate that is the parent organisation's headquarters
                 * rather than the body's own seat: "approximately here" and
                 * "here" are different claims. */
                links: p.ospos.map((o) => ({
                    /* May be absent — the markup renders plain text rather than
                     * an href="#" that goes nowhere. */
                    href: o.url || null,
                    label: o.name,
                    note: [o.city !== p.city ? o.city : null, o.locationBasis === 'hq' ? '(HQ)' : null]
                        .filter(Boolean)
                        .join(' ') || null,
                })),
            };
    } else if (open?.kind === 'country') {
        const c = countries.find((x) => x.catalogue?.code === open.id);
        if (c?.centroid)
            popup = {
                x: c.centroid[0],
                y: c.centroid[1],
                title: c.name,
                /* This country's own figure. ⚠ Never summed with the others —
                 * see CLAUDE.md; the totals disagree in both directions. */
                meta: `${c.catalogue.entries.toLocaleString()} open source projects`,
                links: c.catalogue.catalogues.map((cat) => ({
                    href: cat.site,
                    label: cat.label,
                    note: `(${cat.entries.toLocaleString()})`,
                })),
            };
    }

    return (
        <div className="unnyc-start-story__map-block">
            <div className="unnyc-start-story__map-panel" data-reveal="1" data-delay="120" ref={panelRef}>
                {/* ⚠ `role="img"` was REMOVED 2026-09-11 and that is the whole
                    reason the pins can be controls. A role="img" makes the
                    entire subtree presentational, so a focusable child inside
                    one is a focus stop with NO accessible name — which is why
                    the earlier version put all detail in text instead. The
                    label moved to `role="group"`, every decorative child is
                    explicitly aria-hidden, and only the three interactive
                    layers are exposed. If you ever put role="img" back, delete
                    the pins with it or they become unnamed tab stops. */}
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="unnyc-start-story__map-svg"
                    role="group"
                    aria-label="World map: countries with public code catalogues, and cities with public-sector open source program offices"
                >
                    {countries.map((c) =>
                        c.catalogue ? (
                            <path
                                key={c.key}
                                data-pin={`country:${c.catalogue.code}`}
                                className="unnyc-start-story__pin"
                                d={c.d}
                                role="button"
                                tabIndex={0}
                                aria-expanded={isOpen('country', c.catalogue.code)}
                                aria-label={`${c.name}: ${c.catalogue.entries.toLocaleString()} open source projects in ${c.catalogue.catalogues.length} public ${c.catalogue.catalogues.length === 1 ? 'catalogue' : 'catalogues'}`}
                                onClick={() => toggle('country', c.catalogue.code)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggle('country', c.catalogue.code);
                                    }
                                }}
                                style={{
                                    fill: 'var(--wg-accent)',
                                    fillOpacity: isOpen('country', c.catalogue.code) ? 0.62 : 0.34,
                                    stroke: 'var(--wg-surface)',
                                    strokeOpacity: 0.22,
                                    cursor: 'pointer',
                                }}
                                strokeWidth={0.6}
                            />
                        ) : (
                            <path
                                key={c.key}
                                d={c.d}
                                aria-hidden="true"
                                style={{
                                    fill: 'var(--wg-surface)',
                                    fillOpacity: 0.05,
                                    stroke: 'var(--wg-surface)',
                                    strokeOpacity: 0.22,
                                }}
                                strokeWidth={0.6}
                            />
                        ),
                    )}
                    {ctfgDots.map((p, i) => (
                        <circle
                            key={`ctfg-${i}`}
                            aria-hidden="true"
                            cx={p.x}
                            cy={p.y}
                            r={3}
                            style={{ fill: 'var(--wg-accent-strong)', stroke: 'var(--wg-surface)' }}
                            strokeWidth={1}
                            opacity={0.85}
                        />
                    ))}
                    {ospoDots.map((p, i) => (
                        <g
                            key={`ospo-${i}`}
                            data-pin={`ospo:${i}`}
                            className="unnyc-start-story__pin"
                            role="button"
                            tabIndex={0}
                            aria-expanded={isOpen('ospo', i)}
                            aria-label={`${p.city}, ${p.country}: ${p.ospos.length} public sector open source program ${p.ospos.length === 1 ? 'office' : 'offices'}`}
                            onClick={() => toggle('ospo', i)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggle('ospo', i);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* ⚠ The visible dot is 6.8px across. WCAG 2.5.8 asks for
                                24px on a non-inline target, so the HIT AREA is this
                                transparent circle, not the dot. `fill: transparent`
                                rather than `fill: none` — `none` is not hit-testable. */}
                            <circle cx={p.x} cy={p.y} r={11} fill="transparent" />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={isOpen('ospo', i) ? 5 : 3.4}
                                style={{ fill: 'var(--wg-accent-warm)', stroke: 'var(--wg-brand-deep)' }}
                                strokeOpacity={0.7}
                                strokeWidth={0.8}
                            />
                        </g>
                    ))}
                    {markerDots.map((m, i) => (
                        <g
                            key={m.label ?? i}
                            data-pin={`marker:${i}`}
                            className="unnyc-start-story__pin"
                            role="button"
                            tabIndex={0}
                            aria-expanded={isOpen('marker', i)}
                            aria-label={`${m.label}: ${m.desc}`}
                            onClick={() => toggle('marker', i)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggle('marker', i);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Hit area, not decoration — see the OSPO note above. */}
                            <circle cx={m.x} cy={m.y} r={12} fill="transparent" />
                            <circle
                                cx={m.x}
                                cy={m.y}
                                r={(m.type === 'city' ? 6 : 5) + (isOpen('marker', i) ? 2 : 0)}
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

                {/* ── Popups ──────────────────────────────────────────────────
                    HTML, not <foreignObject>: these need links, real text
                    wrapping and normal focus behaviour, and JSX escapes the
                    content for free. The old Leaflet popups built HTML strings
                    and needed a hand-written esc() for exactly that reason.

                    Positioned in PERCENT of the panel, derived from the
                    projected SVG coordinate, so the card tracks its pin however
                    the SVG is scaled — there is no second source of truth for
                    where a pin is.

                    ⚠ Styled ONCE even though this component renders on a light
                    page (/start) and a dark one (/): the map PANEL is the same
                    navy gradient on both, and the card sits on the panel. That
                    is what makes it safe here — it is not a general licence to
                    ignore the light/dark split in world-map.css. */}
                {popup && (
                    <div
                        className="unnyc-start-story__popup"
                        /* Below the pin in the top half, above it in the bottom
                           half — see the clamp note on `pct`. */
                        data-below={popup.y < H * 0.5 ? 'true' : 'false'}
                        style={pct(popup.x, popup.y)}
                        role="dialog"
                        aria-label={popup.title}
                    >
                        <button
                            type="button"
                            className="unnyc-start-story__popup-close"
                            onClick={() => {
                                const opener = panelRef.current?.querySelector(
                                    `[data-pin="${open.kind}:${open.id}"]`,
                                );
                                closePopup();
                                if (opener) opener.focus();
                            }}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <p className="unnyc-start-story__popup-title">{popup.title}</p>
                        {popup.meta && <p className="unnyc-start-story__popup-meta">{popup.meta}</p>}
                        {popup.desc && <p className="unnyc-start-story__popup-desc">{popup.desc}</p>}
                        {popup.links?.length > 0 && (
                            <ul className="unnyc-start-story__popup-list">
                                {popup.links.map((l) => (
                                    <li key={(l.href || '') + l.label}>
                                        {l.href ? (
                                            <a href={l.href} target="_blank" rel="noopener noreferrer">
                                                {l.label}
                                            </a>
                                        ) : (
                                            l.label
                                        )}
                                        {l.note ? <span> {l.note}</span> : null}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

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
