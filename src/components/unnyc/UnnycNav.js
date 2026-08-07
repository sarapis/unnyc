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
const LINKS = [
    { href: '/start', label: 'The Global Movement' },
    { href: '/crosswalk', label: 'Open Source for NYC' },
    { href: '/success', label: 'What Success Looks Like' },
    { href: '/resources', label: 'Resources' },
];

const CTA = { href: '/campaign', label: 'Take Action' };

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
                <Link href="/" className="unnyc-nav__logo" aria-label="UNNYC home">
                    <span className="unnyc-nav__logo-un">UN</span>
                    <span className="unnyc-nav__logo-nyc">NYC</span>
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
