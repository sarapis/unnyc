'use client';

import { useEffect } from 'react';

/**
 * Measures the sticky site header and exposes its height as the CSS var
 * --pr-header-h on <html>. Consumed by section scroll-margin-top and by the
 * section subnav's sticky offset, so hash jumps land below the header
 * regardless of viewport. Renders nothing.
 *
 * ⚠ It looked for `.site-header` until 2026-08-06 — the class used by the
 * MARKETING site's navbar, which this standalone site does not have. The query
 * found nothing, the effect returned early, and --pr-header-h was never set on
 * any of the six pages that mount this. Every hash jump silently used the
 * 130px fallback against a header that is really ~68px, overshooting each
 * target by roughly 134px. `.unnyc-nav` is this site's header; `.site-header`
 * is kept as a fallback only so the component stays portable.
 */
export default function HeaderHeightVar() {
    useEffect(() => {
        const header = document.querySelector('.unnyc-nav, .site-header');
        const root = document.documentElement;
        if (!header) return undefined;
        const setVar = () => {
            root.style.setProperty('--pr-header-h', `${Math.round(header.getBoundingClientRect().height)}px`);
        };
        setVar();
        const ro = new ResizeObserver(setVar);
        ro.observe(header);
        // Web fonts (DM Serif Display / Inter) load after first paint and
        // reflow the navbar taller; re-measure once they settle so hash-jump
        // offsets are correct even for an early click.
        if (document.fonts?.ready) document.fonts.ready.then(setVar).catch(() => { });
        return () => {
            ro.disconnect();
            root.style.removeProperty('--pr-header-h');
        };
    }, []);

    return null;
}
