'use client';

import dynamic from 'next/dynamic';
import { endorsers } from '@/data/unnyc-primer';

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

export default function PrimerMovementNow() {
    return (
        <section id="going-open-source" className="unnyc-section unnyc-section--alt unnyc-section--map">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">The World is Going Open Source</h2>
                    <p className="unnyc-section__desc">
                        In November 2025, <strong>Barcelona</strong> became the first city in the
                        world to formally endorse the UN Open Source Principles. New York hosts
                        the movement every June but hasn&rsquo;t joined it yet. Following
                        Barcelona&rsquo;s lead would make New York the first city in the Americas
                        to do the same.
                    </p>
                </header>

                <PrimerMapInner />

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
