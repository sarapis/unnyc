"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollReveal — mounted once in layout.js. Adds `.unnyc-reveal` (see
 * unnyc.css for the CSS half) to a curated list of card/grid-item selectors,
 * then fades each in via IntersectionObserver as it scrolls into view.
 *
 * Deliberately card/grid-item level, not headings or paragraphs — the goal is
 * a subtle "site feels alive" cue on repeated elements, not an obstacle
 * course between a reader and the prose.
 *
 * The class is added HERE, in JS, rather than hardcoded on the elements in
 * JSX — so if JS is disabled or this component errors, elements just never
 * get `.unnyc-reveal` and render normally visible. Nothing gets stuck at
 * opacity: 0. Respects prefers-reduced-motion by skipping entirely.
 */
const SELECTORS = [
    '.unnyc-pr-path',
    '.unnyc-pr-concept',
    '.unnyc-start-principle',
    '.unnyc-pr-timeline__item',
    '.unnyc-pr-endorsers__org',
    '.unnyc-pr-mn__barcelona',
    '.unnyc-pr-case',
    '.unnyc-success__stat',
    '.unnyc-pr-resources__group',
    '.unnyc-pr-contact',
    '.unnyc-pr-ospo__card',
    '.unnyc-guide__block',
    '.unnyc-cmp-wall__org',
    '.unnyc-policy__card',
    '.unnyc-pr-cw__part--gap',
].join(',');

/** Siblings sharing a parent stagger by this much, capped so a long list
 * (e.g. the endorsers grid) doesn't leave the last item waiting seconds. */
const STAGGER_MS = 60;
const STAGGER_CAP_MS = 300;

export default function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const elements = document.querySelectorAll(SELECTORS);
        if (!elements.length) return undefined;

        const siblingIndex = new Map();
        elements.forEach((el) => {
            el.classList.add('unnyc-reveal');
            const i = siblingIndex.get(el.parentElement) ?? 0;
            siblingIndex.set(el.parentElement, i + 1);
            el.style.setProperty('--reveal-delay', `${Math.min(i * STAGGER_MS, STAGGER_CAP_MS)}ms`);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('unnyc-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
        );

        // Layout right after a route change (hero height, image loading, font
        // swap) isn't final yet — observing immediately let the FIRST
        // intersection callback fire against a not-yet-settled layout, which
        // read below-the-fold cards as already on-screen and marked them
        // visible immediately, permanently, with no fade. Two rAFs is the
        // standard way to wait for a real, painted layout before watching.
        let raf1 = requestAnimationFrame(() => {
            raf1 = requestAnimationFrame(() => {
                elements.forEach((el) => observer.observe(el));
            });
        });

        return () => {
            cancelAnimationFrame(raf1);
            observer.disconnect();
        };
    }, [pathname]);

    return null;
}
