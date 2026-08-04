'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { concepts } from '@/data/unnyc-primer';

const BY_SLUG = Object.fromEntries(concepts.terms.map((t) => [t.slug, t]));

/**
 * GlossaryTerm — wraps a jargon reference (e.g. "OSPO") so a reader gets its
 * definition on hover/focus without leaving the page, and can click through
 * to the full entry on /start. `slug` must match a term in
 * data/unnyc-primer.js (concepts.terms).
 */
export default function GlossaryTerm({ slug, children }) {
    const [open, setOpen] = useState(false);
    const tooltipId = useId();
    const term = BY_SLUG[slug];

    if (!term) return children;

    return (
        <span
            className="unnyc-gloss"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            <Link
                href={`/start#${slug}`}
                className="unnyc-gloss__link"
                aria-describedby={open ? tooltipId : undefined}
            >
                {children}
            </Link>
            {open && (
                <span id={tooltipId} role="tooltip" className="unnyc-gloss__tip">
                    {term.def}
                </span>
            )}
        </span>
    );
}
