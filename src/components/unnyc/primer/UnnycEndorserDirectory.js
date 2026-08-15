'use client';

import { useMemo, useState } from 'react';

/**
 * UnnycEndorserDirectory — the organizations that have endorsed the UN Open
 * Source Principles, filterable by sector.
 *
 * Replaced PrimerEndorsers at the bottom of /principles on 2026-08-14. That
 * component listed 17 hand-maintained organizations from
 * content/principles.md's frontmatter; this one reads the 152-organization
 * snapshot in content/un-endorsers.json. See getUnEndorsers() for the
 * provenance caveats — the names are a transcription, and there are
 * deliberately NO LOGOS.
 *
 * CLIENT component because the filter is interactive, so it takes its data as a
 * prop from the server page rather than calling getUnEndorsers() itself —
 * that helper reads the filesystem and would break the build if imported here.
 *
 * Takes `organizations` (the array), NOT the whole snapshot document. Passing
 * the document serialized its metadata into the RSC payload too — the
 * provenance note, the `excluded` list and the `corrections` array, which
 * records that #143 was mistranscribed as "RTÉ". Internal editorial notes do
 * not belong in the page source, and none of it is rendered.
 *
 * Copy (heading, lede, the "All" label, the note) comes from
 * content/principles.md, per the copy-in-markdown rule. Nothing user-facing is
 * written in this file.
 *
 * Counts are DERIVED from the data, never authored, so a refreshed snapshot
 * cannot leave the page claiming a number it no longer shows.
 */
export default function UnnycEndorserDirectory({ organizations, copy }) {
    const orgs = organizations;
    const [active, setActive] = useState(null); // null = all sectors

    // Sector order is by size, descending — the filter reads as a breakdown of
    // who has endorsed, which is the point the section is making.
    const sectors = useMemo(() => {
        if (!orgs) return [];
        const counts = new Map();
        for (const o of orgs) counts.set(o.sector, (counts.get(o.sector) || 0) + 1);
        return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }, [orgs]);

    const shown = useMemo(
        () => (!orgs ? [] : active ? orgs.filter((o) => o.sector === active) : orgs),
        [orgs, active]
    );

    // Fail-soft: a missing or empty snapshot costs the directory, not the page.
    if (!orgs?.length) return null;

    return (
        <section id="endorsers" className="unnyc-section unnyc-section--alt">
            <div className="unnyc-container">
                <h2 className="unnyc-pr-mn__subhead">{copy?.title}</h2>
                {copy?.lede && <p className="unnyc-pr-mn__lede">{copy.lede}</p>}

                <div
                    className="unnyc-endorsers__filters"
                    role="group"
                    aria-label={copy?.filterLabel}
                >
                    <button
                        type="button"
                        onClick={() => setActive(null)}
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
                            onClick={() => setActive(sector === active ? null : sector)}
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

                {/* aria-live so filtering announces the new count to a screen
                    reader — the visible change is the list re-rendering, which
                    is otherwise silent. */}
                <p className="unnyc-endorsers__status" aria-live="polite">
                    {shown.length} {shown.length === 1 ? copy?.unitOne : copy?.unitMany}
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

                {copy?.note && <p className="unnyc-endorsers__note">{copy.note}</p>}
            </div>
        </section>
    );
}
