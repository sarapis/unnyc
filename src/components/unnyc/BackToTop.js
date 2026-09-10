'use client';

import { useEffect, useState } from 'react';

/** Show once the reader has scrolled past a full viewport height — short
 *  enough to be useful on a long storyscroller, tall enough that it doesn't
 *  pop in on an ordinary short page. */
const SHOW_AFTER_VIEWPORTS = 1;

/**
 * BackToTop — a floating "return to top" button, mounted once in
 * layout.js so it's available on every route without each page
 * remembering to include it (same pattern as ScrollReveal/UpdatesBar).
 *
 * Hidden rather than unmounted while inactive, so it never steals a
 * keyboard tab-stop before it's visible (`tabIndex={-1}` + `aria-hidden`
 * track the same `visible` state as the CSS).
 */
export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // No rAF throttle: this is a single cheap comparison, and React
        // already bails out of re-rendering when `visible` doesn't change —
        // unlike the storyscrollers' reveal/rail systems, there's no
        // per-tick style-writing here worth gating.
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORTS);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            className={'unnyc-back-to-top' + (visible ? ' unnyc-back-to-top--visible' : '')}
            onClick={scrollToTop}
            aria-label="Back to top"
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
        >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
            </svg>
        </button>
    );
}
