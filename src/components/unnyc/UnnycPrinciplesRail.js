'use client';

import { useEffect, useState } from 'react';

/**
 * UnnycPrinciplesRail — a sticky side rail listing the eight principles,
 * alongside /principles' per-principle detail sections.
 *
 * WHY A RAIL AND NOT A SUBNAV BAR. UnnycSectionNav's doc comment rules this
 * page out of a horizontal bar, and that reasoning still holds: eight items
 * across the top is too dense to scan, and the labels do not fit — the longest
 * ("Foster inclusive participation and community building") is a third of the
 * bar on its own, so a bar can only truncate or invent short labels. A ninth
 * wording variant is exactly what content/principles.md's header warns against.
 *
 * Vertical space removes that constraint. The rail carries `titleCanonical`
 * verbatim, wrapping to two lines where it needs to, so no new copy exists.
 * And it does the one job the grid at the top cannot: the grid scrolls away
 * after the first screen, and these are eight long sections, so there is
 * otherwise nothing telling you where you are in the read.
 *
 * ⚠ IT IS NOT FREE SPACE. The detail sections are a FLOAT layout — the prose
 * is `float: left; width: 56%` and each section's "The Gap" panel is
 * `float: right; width: 40%`, and all eight sections have one. The rail
 * therefore does not fill an empty gutter; principles.css narrows the float
 * container (padding-right) to make room, which takes the prose from 645px to
 * ~515px. That is a deliberate trade, not a free win: ~515px at --wg-fs-lg is
 * closer to a comfortable measure than 645px was, but it IS a layout change to
 * all eight sections. If the rail is ever removed, remove that padding too or
 * the sections keep a 256px hole.
 *
 * Below 1200px the rail is display:none and the padding is not applied, so the
 * sections render exactly as they did before. The grid of eight jump links at
 * the top of the page is the fallback, and it is a complete one.
 *
 * Scroll-spy, anchors and smooth scrolling are the same approach as
 * UnnycSectionNav — real `<a href="#id">` so it works with JS disabled, and an
 * IntersectionObserver band pinned just under the header.
 *
 * @param {{items: {id: string, label: string, n: number}[], ariaLabel?: string,
 *          title?: string}} props
 */
/* eslint-disable react-hooks/exhaustive-deps -- the observer is keyed on `ids`
   (a stable string) rather than `items` (a fresh array each render). */
export default function UnnycPrinciplesRail({ items = [], ariaLabel, title }) {
    const [active, setActive] = useState(null);
    const ids = items.map((i) => i.id).join(',');

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

    if (!items.length) return null;

    const jump = (e, id) => {
        const target = document.getElementById(id);
        if (!target) return; // let the browser handle a stale anchor
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
        if (window.history?.replaceState) {
            window.history.replaceState(null, '', `#${id}`);
        }
    };

    return (
        <div className="unnyc-principles__rail" aria-hidden="false">
            <nav className="unnyc-principles__rail-inner" aria-label={ariaLabel}>
                {title && <p className="unnyc-principles__rail-title">{title}</p>}
                <ul className="unnyc-principles__rail-list">
                    {items.map((i) => (
                        <li key={i.id}>
                            <a
                                href={`#${i.id}`}
                                className={
                                    'unnyc-principles__rail-link' +
                                    (active === i.id ? ' unnyc-principles__rail-link--active' : '')
                                }
                                aria-current={active === i.id ? 'true' : undefined}
                                onClick={(e) => jump(e, i.id)}
                            >
                                <span className="unnyc-principles__rail-n">{i.n}</span>
                                <span>{i.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
