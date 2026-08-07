"use client";
import { useEffect, useRef, useState } from 'react';

/**
 * UnnycSectionNav — a per-page submenu of the current page's sections.
 *
 * Sticks directly under the site header and jumps to a section on click, with
 * the active section highlighted as you scroll (a scroll-spy). Pages pass their
 * own `items`; a page with fewer than two sections should not render it at all.
 *
 * Progressive enhancement: the items are real `<a href="#id">` anchors, so they
 * work with JS disabled and are keyboard-navigable for free. The click handler
 * only adds smooth scrolling and a clean URL update.
 *
 * Offsets depend on `--pr-header-h` (set by HeaderHeightVar) — which was broken
 * until 2026-08-06, see that component. The fallback here is 68px, this site's
 * real header height, rather than the 130px the marketing site used.
 *
 * @param {{items: {id: string, label: string}[], ariaLabel?: string}} props
 */
export default function UnnycSectionNav({ items = [], ariaLabel = 'Sections on this page' }) {
    const [active, setActive] = useState(null);
    const listRef = useRef(null);

    // Pages build `items` inline (e.g. /crosswalk maps its principles), so the
    // array is a new reference on every render. Keying the observer effect on
    // the ids instead means it is built once, not torn down and rebuilt each
    // time React re-renders.
    const ids = items.map((i) => i.id).join(',');

    // Scroll-spy. rootMargin pins the "active" line just under the sticky
    // headers, so a section counts as current once its top passes them rather
    // than when it merely enters the viewport from below.
    useEffect(() => {
        if (!ids) return undefined;
        const nodes = ids
            .split(',')
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        if (!nodes.length) return undefined;

        const headerH = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--pr-header-h'),
            10,
        ) || 68;

        const io = new IntersectionObserver(
            (entries) => {
                // Prefer the topmost section currently intersecting the band.
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length) setActive(visible[0].target.id);
            },
            { rootMargin: `-${headerH + 90}px 0px -55% 0px`, threshold: 0 },
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, [ids]);

    // Keep the active chip in view when the bar overflows horizontally
    // (/crosswalk has eight). Scrolls the bar only, never the page.
    useEffect(() => {
        if (!active || !listRef.current) return;
        const chip = listRef.current.querySelector(`[data-id="${active}"]`);
        if (chip?.scrollIntoView) {
            chip.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
    }, [active]);

    if (items.length < 2) return null;

    const jump = (e, id) => {
        const target = document.getElementById(id);
        if (!target) return; // let the browser handle a stale anchor
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
        // Update the URL without a second (instant) jump.
        if (window.history?.replaceState) {
            window.history.replaceState(null, '', `#${id}`);
        }
    };

    return (
        <nav className="unnyc-subnav" aria-label={ariaLabel}>
            <div className="unnyc-container">
                <ul className="unnyc-subnav__list" ref={listRef}>
                    {items.map((i) => (
                        <li key={i.id}>
                            <a
                                href={`#${i.id}`}
                                data-id={i.id}
                                className={`unnyc-subnav__link${active === i.id ? ' unnyc-subnav__link--active' : ''}`}
                                aria-current={active === i.id ? 'true' : undefined}
                                onClick={(e) => jump(e, i.id)}
                            >
                                {i.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
