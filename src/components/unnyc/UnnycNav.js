"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * UnnycNav — the standalone site's header.
 *
 * Replaces the CMS-driven WeGovNYC marketing navbar this site used before it
 * was split out: the links are static (no /global CMS call), there is no theme
 * switcher, and the five campaign paths are the whole nav. Collapses to a
 * hamburger drawer below 820px.
 */
// Reads as the funnel: what the movement is, what it asks for, why NYC, who has
// already done it, where to go next.
const LINKS = [
    { href: '/start', label: 'A Global Movement' },
    { href: '/principles', label: 'UN Principles' },
    { href: '/crosswalk', label: 'Open Source for NYC' },
    { href: '/success', label: 'Case Studies' },
    { href: '/resources', label: 'Resources' },
];

// Points at the signing form itself, not the /campaign hub (2026-08-14) — the
// header CTA is the one place a reader has already decided to act, so it skips
// the landing page. /campaign is still linked from the page bodies.
const CTA = { href: '/campaign/sign', label: 'Take Action' };

export default function UnnycNav() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the drawer on navigation.
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    // Escape closes it.
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <header className="unnyc-nav">
            <div className="unnyc-nav__inner">
                <Link href="/" className="unnyc-nav__logo" aria-label="UN+NYC open source home">
                    {/* Two-line lockup: the mark, then "open source" tracked out
                        beneath it. The mark's three spans have to be wrapped so
                        the tagline can take its own line. */}
                    <span className="unnyc-nav__logo-mark">
                        <span className="unnyc-nav__logo-un">UN</span>
                        <span className="unnyc-nav__logo-mid">+</span>
                        <span className="unnyc-nav__logo-nyc">NYC</span>
                    </span>
                    <span className="unnyc-nav__logo-tag">open source</span>
                </Link>

                <button
                    type="button"
                    className={`unnyc-nav__toggle${menuOpen ? ' unnyc-nav__toggle--open' : ''}`}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="unnyc-nav-menu"
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    <span className="unnyc-nav__bar" />
                    <span className="unnyc-nav__bar" />
                    <span className="unnyc-nav__bar" />
                </button>

                <div
                    id="unnyc-nav-menu"
                    className={`unnyc-nav__menu${menuOpen ? ' unnyc-nav__menu--open' : ''}`}
                >
                    <ul className="unnyc-nav__links">
                        {LINKS.map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    className={`unnyc-nav__link${isActive(l.href) ? ' unnyc-nav__link--active' : ''}`}
                                    aria-current={isActive(l.href) ? 'page' : undefined}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={CTA.href}
                        className="unnyc-btn unnyc-btn--primary unnyc-nav__cta"
                        onClick={() => setMenuOpen(false)}
                    >
                        {CTA.label}
                    </Link>
                </div>
            </div>
        </header>
    );
}
