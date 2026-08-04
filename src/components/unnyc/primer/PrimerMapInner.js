'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { primerMapMarkers, primerMapLegend } from '@/data/unnyc-primer';

/**
 * World map of governments advancing public-sector open source.
 * Same Leaflet + CARTO tiles + divIcon pattern as UnnycMapInner, at
 * world zoom. The NYC "ask" marker is visually distinct (crimson, larger).
 */

const COLORS = {
    city: '#D4A843',   // cities leading — gold
    nation: '#4B92DB', // national programs — UN blue
    un: '#2A3D63',     // UN system — navy
    ask: '#C0453C',    // NYC, the ask — crimson
};

export default function PrimerMapInner() {
    const containerRef = useRef(null);
    const mapRef = useRef(null);

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

        primerMapMarkers.forEach((m) => {
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
        };
    }, []);

    return (
        <div className="unnyc-map-wrapper">
            <div ref={containerRef} className="unnyc-map-container" style={{ height: 480 }} />

            <div className="unnyc-map-legend">
                {primerMapLegend.map((item) => (
                    <div key={item.type} className="unnyc-map-legend-item">
                        <span
                            className="unnyc-map-legend-swatch"
                            style={{ backgroundColor: COLORS[item.type] || '#888' }}
                        />
                        <span className="unnyc-map-legend-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
