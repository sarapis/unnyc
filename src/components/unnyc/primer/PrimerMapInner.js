'use client';

import { useEffect, useRef } from 'react';
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
    ospo: '#7A4FA3',   // public sector OSPOs — violet, the one hue not already spoken for
    ctfg: '#3F8F7B',   // government open source programs (CTFG) — teal, off the palette above
};
// `un` (navy) and `ask` (crimson) were retired on 2026-08-17 with their markers: the
// map is now catalogues, cities, OSPOs and CTFG programs. NYC carried the crimson
// "the ask" marker, so nothing is drawn on New York by the policy layer any more —
// the ask is made by the surrounding copy instead. Note the UNDP's OSPO still puts a
// violet pin on New York, which is correct and is not that marker returning.

/**
 * The country fill is ONE flat tone, not a ramp (2026-08-17, owner decision).
 *
 * It was a four-step choropleth. A single-colour key over a graded map would have
 * made the legend disagree with the map, so the grading went with it: the fill now
 * says "this government publishes a catalogue", and how many projects is in the
 * popup. That is a real loss of information at a glance, and a deliberate one --
 * the layer is ground for the markers above it, not the subject.
 *
 * 0.28 sits where the old ramp's middle steps did. It has to stay low enough that a
 * gold city marker over France or Germany keeps its contrast; 0.7 was tried on the
 * ramp's top step and buried them.
 */
const FILL_OPACITY = 0.28;

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
    ospos = null,
    ospoLabel,
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const projectLayerRef = useRef(null);
    const fillLayerRef = useRef(null);
    const ospoLayerRef = useRef(null);
    const hasOspos = Boolean(ospos?.points?.length);

    // The fill needs BOTH halves: counts to colour by, geometry to paint. They load
    // independently on purpose (getGovossCatalogues), so check both here rather than
    // trusting one to imply the other.
    const hasFill = Boolean(govoss?.countries?.length && govoss?.geo?.features?.length);

    // No layer toggles (2026-08-17, owner decision). Every layer is simply on, so the
    // three useState/useEffect pairs that added and removed them are gone, and with
    // them the reason bringToBack() was called on re-add. The legend is a key again
    // rather than a control panel.

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
                        fillOpacity: c ? FILL_OPACITY : 0,
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
            layer.addTo(map);
            layer.bringToBack();
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
            layer.addTo(map);
        }

        // OSPO layer: above the fill and the CTFG dots, below the policy markers.
        if (hasOspos) {
            const layer = L.layerGroup();
            ospos.points.forEach((pt) => {
                const icon = L.divIcon({
                    className: 'unnyc-map-marker',
                    html: `<span style="
          display:block;
          width:11px;
          height:11px;
          border-radius:2px;
          background:${COLORS.ospo};
          border:1.5px solid #fff;
          box-shadow:0 1px 3px rgba(0,0,0,0.3);
        "></span>`,
                    iconSize: [11, 11],
                    iconAnchor: [5.5, 5.5],
                });
                // A square, where every other layer is round. One city can hold five
                // OSPOs and one policy marker at the same pixel; shape separates them
                // when colour alone would not, including for a red-green reader.
                const list = pt.ospos
                    .map((o) => {
                        // The REAL city, even where the pin was merged into a nearby
                        // one — merging changes what is drawn, never what is claimed.
                        const where = o.city && o.city !== pt.city ? ` — ${esc(o.city)}` : '';
                        const approx = o.locationBasis === 'hq' ? ' (HQ)' : '';
                        return `<li><a href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${esc(
                            o.name
                        )} ↗</a>${where}${approx}</li>`;
                    })
                    .join('');
                L.marker([pt.lat, pt.lng], { icon })
                    .bindPopup(
                        `<div class="unnyc-map-popup">
          <strong>${esc(pt.city)}</strong>
          <p class="unnyc-map-popup__meta">${pt.ospos.length} public sector ${
              pt.ospos.length === 1 ? 'OSPO' : 'OSPOs'
          }</p>
          <ul class="unnyc-map-popup__list">${list}</ul>
        </div>`
                    )
                    .addTo(layer);
            });
            ospoLayerRef.current = layer;
            layer.addTo(map);
        }

        markers.forEach((m) => {
            const color = COLORS[m.type] || COLORS.nation;
            const size = 14;

            const icon = L.divIcon({
                className: 'unnyc-map-marker',
                html: `<span style="
          display:block;
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          border:2px solid #fff;
          box-shadow:0 1px 4px rgba(0,0,0,0.35);
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
            ospoLayerRef.current = null;
        };
    }, []);

    return (
        <div className="unnyc-map-wrapper">
            <div ref={containerRef} className="unnyc-map-container" style={{ height: 480 }} />

            <div className="unnyc-map-legend">
                {/* A KEY, not a control panel: no checkboxes, no counts, one line per
                    row. Counts live in each popup, where a reader who wants a number is
                    already asking for one. Rows are ordered as the map is painted,
                    ground first. Layers absent from the page are absent from the key —
                    a swatch for a layer that failed to load is worse than no swatch. */}
                {hasFill && (
                    <div className="unnyc-map-legend-item">
                        <span
                            className="unnyc-map-legend-swatch unnyc-map-legend-swatch--area"
                            style={{ backgroundColor: COLORS.nation, opacity: FILL_OPACITY + 0.25 }}
                        />
                        <span className="unnyc-map-legend-label">
                            {govossLabel || 'National open source catalogs'}
                        </span>
                    </div>
                )}

                {legend.map((item) => (
                    <div key={item.type} className="unnyc-map-legend-item">
                        <span
                            className={
                                'unnyc-map-legend-swatch' +
                                (item.type === 'ospo' ? ' unnyc-map-legend-swatch--square' : '')
                            }
                            style={{ backgroundColor: COLORS[item.type] || '#888' }}
                        />
                        <span className="unnyc-map-legend-label">{item.label}</span>
                    </div>
                ))}

                {projects.length > 0 && (
                    <div className="unnyc-map-legend-item">
                        <span
                            className="unnyc-map-legend-swatch"
                            style={{ backgroundColor: COLORS.ctfg }}
                        />
                        <span className="unnyc-map-legend-label">
                            {projectsLabel || 'Government open source programs'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
