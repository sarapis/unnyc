'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * World map of governments advancing public-sector open source.
 * Same Leaflet + CARTO tiles + divIcon pattern as UnnycMapInner, at
 * world zoom. The NYC "ask" marker is visually distinct (crimson, larger).
 *
 * TWO LAYERS, deliberately unequal:
 *   1. the curated POLICY markers (content/start.md `mapMarkers`) — the section's
 *      argument: who has endorsed, and that NYC hasn't;
 *   2. an optional CTFG layer of government-built open source programs, as
 *      supporting evidence.
 * The CTFG dots are smaller and quieter so they can't swamp the argument — the
 * point of the map is still the policy story, the projects are the footnote.
 * Toggleable, and absent entirely if the snapshot is missing (see getCtfgProjects).
 */

const COLORS = {
    city: '#D4A843',   // cities leading — gold
    nation: '#4B92DB', // national programs — UN blue
    un: '#2A3D63',     // UN system — navy
    ask: '#C0453C',    // NYC, the ask — crimson
    ctfg: '#3F8F7B',   // government open source programs (CTFG) — teal, off the palette above
};

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

export default function PrimerMapInner({ markers = [], legend = [], projects = [], projectsLabel }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const projectLayerRef = useRef(null);
    const [showProjects, setShowProjects] = useState(true);

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

        // CTFG layer FIRST so the curated policy markers sit on top of it.
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

                {/* The CTFG layer is the one thing on this legend you can switch off, so it
                    is a real checkbox rather than a swatch. Absent when there's no snapshot. */}
                {projects.length > 0 && (
                    <label className="unnyc-map-legend-item unnyc-map-legend-item--toggle">
                        <input
                            type="checkbox"
                            checked={showProjects}
                            onChange={(e) => setShowProjects(e.target.checked)}
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
