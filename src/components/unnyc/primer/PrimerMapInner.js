'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * World map of governments advancing public-sector open source.
 * Same Leaflet + CARTO tiles + divIcon pattern as UnnycMapInner, at
 * world zoom. The NYC "ask" marker is visually distinct (crimson, larger).
 *
 * THREE LAYERS, deliberately unequal, painted bottom to top:
 *   1. the GovOSS country FILL — how many public-sector open source entries each
 *      country's own catalogues list. Ground, not figure: a pale ramp under
 *      everything else;
 *   2. an optional CTFG layer of government-built open source programs, as
 *      supporting evidence;
 *   3. the curated POLICY markers (content/start.md `mapMarkers`) — the section's
 *      argument: who has endorsed, and that NYC hasn't.
 *
 * The order is the argument. Running a public code catalogue and endorsing the
 * Principles are DIFFERENT claims and they disagree — Italy has one of the largest
 * catalogues here and is not in the policy layer; Barcelona endorsed first and has
 * no catalogue in GovOSS at all. Keeping inventory as the ground and endorsement as
 * the figure is what makes that gap visible, which is the case for the ask. Invert
 * it and the page argues something else.
 *
 * Both data layers are toggleable and both are absent entirely if their snapshot is
 * missing (see getCtfgProjects / getGovossCatalogues).
 */

const COLORS = {
    city: '#D4A843',   // cities leading — gold
    nation: '#4B92DB', // national programs — UN blue
    un: '#2A3D63',     // UN system — navy
    ask: '#C0453C',    // NYC, the ask — crimson
    ctfg: '#3F8F7B',   // government open source programs (CTFG) — teal, off the palette above
};

/**
 * The country-fill ramp. Deliberately a pale wash of the SAME UN blue as the
 * `nation` markers rather than a new hue: the fill and those markers are about the
 * same governments, and a fifth colour would read as a fifth kind of claim.
 *
 * Opacity does the work instead of hue, so the markers on top keep their contrast —
 * every marker carries a white border, which survives any step of this ramp. The
 * top step stops at 0.42 for that reason; it looked better at 0.7 and buried the
 * gold city markers over France and Germany, which are exactly the ones the section
 * is arguing about.
 *
 * Four steps because four is what the data actually has. Counts run 2 → 676 and a
 * five-step ramp left a bucket empty, which reads as a missing category rather than
 * an absent one.
 */
const FILL_STEPS = [
    { min: 250, opacity: 0.42, label: '250+' },
    { min: 100, opacity: 0.30, label: '100–249' },
    { min: 50, opacity: 0.19, label: '50–99' },
    { min: 0, opacity: 0.10, label: '1–49' },
];
const fillFor = (n) => FILL_STEPS.find((s) => n >= s.min) || FILL_STEPS[FILL_STEPS.length - 1];

/**
 * Escape for interpolation into Leaflet popup HTML. The curated markers are
 * hand-authored in content/start.md, but the CTFG layer is THIRD-PARTY data — a
 * project name or description containing markup would otherwise be injected
 * straight into the popup.
 */
const esc = (s) =>
    String(s ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

export default function PrimerMapInner({
    markers = [],
    legend = [],
    projects = [],
    projectsLabel,
    govoss = null,
    govossLabel,
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const projectLayerRef = useRef(null);
    const fillLayerRef = useRef(null);
    const [showProjects, setShowProjects] = useState(true);
    const [showFill, setShowFill] = useState(true);

    // The fill needs BOTH halves: counts to colour by, geometry to paint. They load
    // independently on purpose (getGovossCatalogues), so check both here rather than
    // trusting one to imply the other.
    const hasFill = Boolean(govoss?.countries?.length && govoss?.geo?.features?.length);

    // Build the CTFG layer once, then add/remove it as the toggle flips — cheaper
    // and less flickery than recreating 62 markers on every toggle.
    useEffect(() => {
        const map = mapRef.current;
        const layer = projectLayerRef.current;
        if (!map || !layer) return;
        if (showProjects) layer.addTo(map);
        else layer.remove();
    }, [showProjects]);

    useEffect(() => {
        const map = mapRef.current;
        const layer = fillLayerRef.current;
        if (!map || !layer) return;
        if (showFill) {
            layer.addTo(map);
            // Ordering against any FUTURE vector layer, not against the markers:
            // Leaflet's panes already guarantee the markers win (overlayPane 400 vs
            // markerPane 600, measured), so the fill can never cover a dot however
            // it is re-added. An earlier comment here claimed otherwise.
            layer.bringToBack();
        } else layer.remove();
    }, [showFill]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
            scrollWheelZoom: false,
            center: [30, -10],
            zoom: 2,
            minZoom: 2,
            worldCopyJump: true,
        });

        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
        }).addTo(map);

        // GovOSS country fill FIRST of all three, so it stays the ground.
        if (hasFill) {
            const byCode = new Map(govoss.countries.map((c) => [c.code, c]));
            const layer = L.geoJSON(govoss.geo, {
                style: (f) => {
                    const c = byCode.get(f.properties.code);
                    return {
                        // A country with no count should not be drawn at all rather
                        // than drawn empty — an unfilled outline reads as "zero
                        // entries", which is a claim the data does not make.
                        fillColor: COLORS.nation,
                        fillOpacity: c ? fillFor(c.entries).opacity : 0,
                        color: COLORS.nation,
                        weight: c ? 0.8 : 0,
                        opacity: c ? 0.45 : 0,
                    };
                },
                onEachFeature: (f, lyr) => {
                    const c = byCode.get(f.properties.code);
                    if (!c) return;
                    const name = f.properties.name;
                    const cats = c.catalogues
                        .map(
                            (k) =>
                                `<li><a href="${esc(k.site)}" target="_blank" rel="noopener noreferrer">${esc(
                                    k.label
                                )} ↗</a> — ${k.entries.toLocaleString()}</li>`
                        )
                        .join('');
                    lyr.bindPopup(
                        `<div class="unnyc-map-popup">
          <strong>${esc(name)}</strong>
          <p class="unnyc-map-popup__meta">${c.entries.toLocaleString()} open source ${
              c.entries === 1 ? 'project' : 'projects'
          } listed by ${c.catalogues.length === 1 ? 'its public catalogue' : 'its public catalogues'}</p>
          <ul class="unnyc-map-popup__list">${cats}</ul>
        </div>`
                    );
                    /**
                     * Leaflet makes MARKERS keyboard-navigable; GeoJSON paths are bare
                     * SVG and are not, so without this the whole fill layer is
                     * mouse-only and every country dialog is unreachable by keyboard.
                     * The CTFG dots beside it have been reachable all along, which is
                     * what makes the omission easy to miss.
                     *
                     * ⚠ Must run on 'add', NOT here. Inside onEachFeature the path has
                     * no DOM element yet — getElement() returns null and the whole
                     * block silently no-ops. It did exactly that on the first attempt
                     * and the build was green; only counting [tabindex] in the
                     * rendered page caught it. 'add' also re-fires when the layer is
                     * toggled back on, which is when Leaflet recreates the path.
                     */
                    lyr.on('add', () => {
                        const el = lyr.getElement && lyr.getElement();
                        if (!el || el.dataset.unnycKeyboard) return;
                        el.dataset.unnycKeyboard = '1';
                        el.setAttribute('tabindex', '0');
                        el.setAttribute('role', 'button');
                        el.setAttribute('aria-label', `${name}: ${c.entries} open source projects`);
                        el.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                lyr.openPopup();
                            }
                        });
                    });
                },
            });
            fillLayerRef.current = layer;
            if (showFill) layer.addTo(map);
        }

        // CTFG layer next, so the curated policy markers sit on top of both.
        if (projects.length) {
            const layer = L.layerGroup();
            projects.forEach((p) => {
                const icon = L.divIcon({
                    className: 'unnyc-map-marker',
                    html: `<span style="
          display:block;
          width:9px;
          height:9px;
          border-radius:50%;
          background:${COLORS.ctfg};
          border:1.5px solid #fff;
          opacity:0.85;
        "></span>`,
                    iconSize: [9, 9],
                    iconAnchor: [4.5, 4.5],
                });
                L.marker([p.lat, p.lng], { icon })
                    .bindPopup(
                        `<div class="unnyc-map-popup">
          <strong>${esc(p.name)}</strong>
          ${p.country ? `<p class="unnyc-map-popup__meta">${esc(p.country)}</p>` : ''}
          ${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
          <p><a href="${esc(p.profile)}" target="_blank" rel="noopener noreferrer">View on the Civic Tech Field Guide ↗</a></p>
        </div>`
                    )
                    .addTo(layer);
            });
            projectLayerRef.current = layer;
            if (showProjects) layer.addTo(map);
        }

        markers.forEach((m) => {
            const color = COLORS[m.type] || COLORS.nation;
            const isAsk = m.type === 'ask';
            const size = isAsk ? 20 : 14;

            const icon = L.divIcon({
                className: 'unnyc-map-marker',
                html: `<span style="
          display:block;
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          border:2px solid #fff;
          box-shadow:0 1px 4px rgba(0,0,0,0.35)${isAsk ? `, 0 0 0 6px rgba(192,69,60,0.25)` : ''};
        "></span>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });

            const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

            marker.bindPopup(
                `<div class="unnyc-map-popup">
          <strong>${m.label}</strong>
          ${m.desc ? `<p>${m.desc}</p>` : ''}
        </div>`
            );
        });

        return () => {
            map.remove();
            mapRef.current = null;
            projectLayerRef.current = null;
            fillLayerRef.current = null;
        };
    }, []);

    return (
        <div className="unnyc-map-wrapper">
            <div ref={containerRef} className="unnyc-map-container" style={{ height: 480 }} />

            <div className="unnyc-map-legend">
                {legend.map((item) => (
                    <div key={item.type} className="unnyc-map-legend-item">
                        <span
                            className="unnyc-map-legend-swatch"
                            style={{ backgroundColor: COLORS[item.type] || '#888' }}
                        />
                        <span className="unnyc-map-legend-label">{item.label}</span>
                    </div>
                ))}

                {/* The two DATA layers are switchable, so they are real checkboxes rather
                    than swatches; each is absent when its snapshot is missing. The fill
                    shows its ramp instead of one swatch — a single colour would imply one
                    value where the whole point is that the countries differ. */}
                {hasFill && (
                    <label className="unnyc-map-legend-item unnyc-map-legend-item--toggle">
                        <input
                            type="checkbox"
                            checked={showFill}
                            onChange={(e) => setShowFill(e.target.checked)}
                            style={{ accentColor: COLORS.nation }}
                        />
                        <span className="unnyc-map-legend-ramp" aria-hidden="true">
                            {[...FILL_STEPS].reverse().map((step) => (
                                <span
                                    key={step.min}
                                    className="unnyc-map-legend-swatch unnyc-map-legend-swatch--ramp"
                                    style={{ backgroundColor: COLORS.nation, opacity: step.opacity }}
                                />
                            ))}
                        </span>
                        <span className="unnyc-map-legend-label">
                            {govossLabel || 'Open source projects in national catalogues'} (
                            {govoss.countries.length} countries)
                        </span>
                    </label>
                )}

                {/* The CTFG layer is the one thing on this legend you can switch off, so it
                    is a real checkbox rather than a swatch. Absent when there's no snapshot. */}
                {projects.length > 0 && (
                    <label className="unnyc-map-legend-item unnyc-map-legend-item--toggle">
                        <input
                            type="checkbox"
                            checked={showProjects}
                            onChange={(e) => setShowProjects(e.target.checked)}
                            style={{ accentColor: COLORS.ctfg }}
                        />
                        <span
                            className="unnyc-map-legend-swatch"
                            style={{ backgroundColor: COLORS.ctfg }}
                        />
                        <span className="unnyc-map-legend-label">
                            {projectsLabel || 'Government open source programs'} ({projects.length})
                        </span>
                    </label>
                )}
            </div>
        </div>
    );
}
