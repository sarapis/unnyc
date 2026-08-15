'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/** Cards per page. The page count is derived from this, so changing it needs
 *  no content edit — the copy in content/principles.md states no totals. */
const PAGE_SIZE = 16;

/** How many numbered buttons to show before windowing with ellipses. */
const WINDOW = 7;

/**
 * UnnycEndorserDirectory — the organizations that have endorsed the UN Open
 * Source Principles, filterable by sector and paginated.
 *
 * Replaced PrimerEndorsers at the bottom of /principles on 2026-08-14. That
 * component listed 17 hand-maintained organizations from
 * content/principles.md's frontmatter; this one reads the 150-organization
 * snapshot in content/un-endorsers.json. See getUnEndorsers() for the
 * provenance caveats — the names are a transcription, and there are
 * deliberately NO LOGOS.
 *
 * CLIENT component because the filter and pagination are interactive, so it
 * takes its data as a prop from the server page rather than calling
 * getUnEndorsers() itself — that helper reads the filesystem and would break
 * the build if imported here.
 *
 * Takes `organizations` (the array), NOT the whole snapshot document. Passing
 * the document serialized its metadata into the RSC payload too — the
 * provenance note, the `excluded` list and the `corrections` array, which
 * records that #143 was mistranscribed as "RTÉ". Internal editorial notes do
 * not belong in the page source, and none of it is rendered.
 *
 * Copy comes from content/principles.md, per the copy-in-markdown rule.
 * Nothing user-facing is written in this file.
 *
 * Counts are DERIVED from the data, never authored, so a refreshed snapshot
 * cannot leave the page claiming a number it no longer shows.
 */
export default function UnnycEndorserDirectory({ organizations, copy }) {
    const orgs = organizations;
    const [active, setActive] = useState(null); // null = all sectors
    const [page, setPage] = useState(1);
    const headingRef = useRef(null);
    // Distinguishes a user page/filter change from the first render, so the
    // page does not scroll itself on load.
    const interacted = useRef(false);

    // Sector order is by size, descending — the filter reads as a breakdown of
    // who has endorsed, which is the point the section is making.
    const sectors = useMemo(() => {
        if (!orgs) return [];
        const counts = new Map();
        for (const o of orgs) counts.set(o.sector, (counts.get(o.sector) || 0) + 1);
        return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }, [orgs]);

    const filtered = useMemo(
        () => (!orgs ? [] : active ? orgs.filter((o) => o.sector === active) : orgs),
        [orgs, active]
    );

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    // Clamp rather than trust state: switching from Companies p5 to Government
    // (one page) would otherwise render an empty page.
    const current = Math.min(page, pageCount);
    const start = (current - 1) * PAGE_SIZE;
    const shown = filtered.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        if (!interacted.current) return;
        headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, [current, active]);

    const go = (p) => {
        interacted.current = true;
        setPage(Math.min(Math.max(1, p), pageCount));
    };
    const pick = (sector) => {
        interacted.current = true;
        setActive(sector);
        setPage(1); // a new filter always starts at its first page
    };

    // Windowed page numbers: 1 … 4 5 [6] 7 8 … 10, so the control stays a
    // fixed width whether there are 2 pages or 20.
    const pages = useMemo(() => {
        if (pageCount <= WINDOW) return Array.from({ length: pageCount }, (_, i) => i + 1);
        const half = Math.floor((WINDOW - 2) / 2);
        let from = Math.max(2, current - half);
        let to = Math.min(pageCount - 1, from + (WINDOW - 3));
        from = Math.max(2, to - (WINDOW - 3));
        const out = [1];
        if (from > 2) out.push('…');
        for (let i = from; i <= to; i++) out.push(i);
        if (to < pageCount - 1) out.push('…');
        out.push(pageCount);
        return out;
    }, [pageCount, current]);

    // Fail-soft: a missing or empty snapshot costs the directory, not the page.
    if (!orgs?.length) return null;

    return (
        <section id="endorsers" className="unnyc-section unnyc-section--alt">
            <div className="unnyc-container">
                <h2 className="unnyc-pr-mn__subhead" ref={headingRef} tabIndex={-1}>
                    {copy?.title}
                </h2>
                {copy?.lede && <p className="unnyc-pr-mn__lede">{copy.lede}</p>}

                <div
                    className="unnyc-endorsers__filters"
                    role="group"
                    aria-label={copy?.filterLabel}
                >
                    <button
                        type="button"
                        onClick={() => pick(null)}
                        aria-pressed={active === null}
                        className={
                            'unnyc-endorsers__chip' +
                            (active === null ? ' unnyc-endorsers__chip--active' : '')
                        }
                    >
                        {copy?.allLabel} <span className="unnyc-endorsers__count">{orgs.length}</span>
                    </button>

                    {sectors.map(([sector, n]) => (
                        <button
                            key={sector}
                            type="button"
                            onClick={() => pick(sector === active ? null : sector)}
                            aria-pressed={sector === active}
                            className={
                                'unnyc-endorsers__chip' +
                                (sector === active ? ' unnyc-endorsers__chip--active' : '')
                            }
                        >
                            {sector} <span className="unnyc-endorsers__count">{n}</span>
                        </button>
                    ))}
                </div>

                {/* aria-live so filtering and paging announce the new range to a
                    screen reader — the visible change is the list re-rendering,
                    which is otherwise silent. */}
                <p className="unnyc-endorsers__status" aria-live="polite">
                    {copy?.showingLabel} {start + 1}–{start + shown.length} {copy?.ofLabel}{' '}
                    {filtered.length} {filtered.length === 1 ? copy?.unitOne : copy?.unitMany}
                    {active ? ` — ${active}` : ''}
                </p>

                <ul className="unnyc-endorsers__grid">
                    {shown.map((o) => (
                        <li key={o.n} className="unnyc-endorsers__org">
                            <span className="unnyc-endorsers__name">{o.organization}</span>
                            <span className="unnyc-endorsers__sector">{o.sector}</span>
                        </li>
                    ))}
                </ul>

                {/* One page needs no control. Rendering a disabled pair would be
                    two dead tap targets on every sector that fits on a page. */}
                {pageCount > 1 && (
                    <nav className="unnyc-endorsers__pagination" aria-label={copy?.paginationLabel}>
                        <button
                            type="button"
                            className="unnyc-endorsers__page unnyc-endorsers__page--step"
                            onClick={() => go(current - 1)}
                            disabled={current === 1}
                        >
                            ← {copy?.prevLabel}
                        </button>

                        <span className="unnyc-endorsers__pages">
                            {pages.map((p, i) =>
                                p === '…' ? (
                                    <span key={`gap-${i}`} className="unnyc-endorsers__gap" aria-hidden="true">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => go(p)}
                                        aria-label={`${copy?.pageLabel} ${p}`}
                                        aria-current={p === current ? 'page' : undefined}
                                        className={
                                            'unnyc-endorsers__page' +
                                            (p === current ? ' unnyc-endorsers__page--active' : '')
                                        }
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        </span>

                        <button
                            type="button"
                            className="unnyc-endorsers__page unnyc-endorsers__page--step"
                            onClick={() => go(current + 1)}
                            disabled={current === pageCount}
                        >
                            {copy?.nextLabel} →
                        </button>
                    </nav>
                )}

                {copy?.note && <p className="unnyc-endorsers__note">{copy.note}</p>}
            </div>
        </section>
    );
}
