'use client';

import { useEffect } from 'react';

/**
 * Measures the global sticky .site-header and exposes its height as the
 * CSS var --pr-header-h on <html>. Consumed by section scroll-margin-top
 * (and the primer subnav's sticky top) so hash jumps land below the header
 * regardless of viewport. Renders nothing.
 */
export default function HeaderHeightVar() {
    useEffect(() => {
        const header = document.querySelector('.site-header');
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
