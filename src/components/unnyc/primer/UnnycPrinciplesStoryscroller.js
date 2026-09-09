'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import UnnycIcon from '@/components/unnyc/UnnycIcon';

const PAGE_SIZE = 16;
/** How many numbered pagination buttons to show before windowing with ellipses. */
const WINDOW = 7;

/**
 * UnnycPrinciplesStoryscroller — the storyscroller redesign of /principles:
 * a hero, the eight principles as two vertical "stems" that grow with the
 * read (Software: open-by-default lead + 3; Community: contribute-back lead
 * + 3), a sticky icon-swapping sidebar, the endorser directory, and foot
 * CTAs. Reimplements a Claude Design handoff (see the design_handoff_unnyc_
 * storyscrollers README from the PR that introduced this) against this
 * repo's own content and tokens rather than the prototype's inline styles.
 *
 * Renders the WHOLE main content of the page as one client component,
 * matching how the prototype's single DCLogic instance owned all of this
 * page's state (active principle, endorser filter/page) and all of its
 * scroll-driven motion (reveal, draw-in, the latching trunk growth, branch
 * gating). Content — principle prose, endorser copy, the endorsing
 * organizations themselves — is still read server-side in page.js and
 * passed down as props, same reason UnnycEndorserDirectory and UpdatesBar
 * are client components that take their data as props: getContent() and
 * getUnEndorsers() read the filesystem and cannot run in the browser.
 *
 * MOTION STAYS IMPERATIVE DOM, same as ScrollReveal.js site-wide: reveal/
 * draw/trunk state is real-time scroll math (a trunk's fill height, an
 * underline that only appears once its stem is lit), not react-friendly
 * derived state, so it is cheaper and clearer as direct style mutation than
 * as a render-triggering state update. React state is reserved for what
 * actually needs a re-render: the active principle (drives the rail
 * highlight and the swapped icon) and the endorser filter/page.
 *
 * RESPONSIVE LAYOUT IS CSS, NOT JS — unlike the prototype's own layout()
 * method. Every breakpoint it handled (rail visibility, the detail grid's
 * column count, the tree's indent, the two-column grids) is a plain media
 * query in principles.css instead, which is how the rest of this site
 * already handles breakpoints. The only genuinely scroll-driven JS left is
 * the stem/underline pixel alignment (layoutStems, re-run on resize and
 * once web fonts settle) and the reveal/draw/trunk motion itself.
 */
export default function UnnycPrinciplesStoryscroller({ hero, groups, endorsers, foot }) {
    const rootRef = useRef(null);
    const iconRef = useRef(null);
    const swappingRef = useRef(false);
    const activeRef = useRef(null);

    const rail = useMemo(
        () =>
            groups.flatMap((g) => [
                { slug: g.lead.slug, title: g.lead.title, icon: g.lead.icon, lead: true },
                ...g.items.map((it) => ({ slug: it.slug, title: it.title, icon: it.icon, lead: false })),
            ]),
        [groups],
    );
    const [active, setActive] = useState(rail[0]?.slug ?? null);
    activeRef.current = active;
    const activeItem = rail.find((r) => r.slug === active) || rail[0];

    /* ---------------------------------------------------------------------
       Endorser directory: sector filter + pagination. Same shape as
       UnnycEndorserDirectory (this page doesn't reuse that component — its
       single-column section doesn't fit this design's sticky-aside/directory
       split — but the filtering/pagination logic is deliberately identical).
       --------------------------------------------------------------------- */
    const orgs = endorsers?.organizations ?? [];
    const [sector, setSector] = useState(null); // null = all sectors
    const [page, setPage] = useState(1);
    const dirRef = useRef(null);
    const interacted = useRef(false);

    const sectors = useMemo(() => {
        const counts = new Map();
        for (const o of orgs) counts.set(o.sector, (counts.get(o.sector) || 0) + 1);
        return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }, [orgs]);

    const filtered = useMemo(
        () => (sector ? orgs.filter((o) => o.sector === sector) : orgs),
        [orgs, sector],
    );
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const start = (current - 1) * PAGE_SIZE;
    const shown = filtered.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        if (!interacted.current) return;
        dirRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, [current, sector]);

    const pick = (s) => {
        interacted.current = true;
        setSector(s);
        setPage(1);
    };
    const go = (p) => {
        interacted.current = true;
        setPage(Math.min(Math.max(1, p), pageCount));
    };

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

    /* ---------------------------------------------------------------------
       Scroll-driven motion: reveal-in, draw-in, the latching trunk growth,
       and branch gating. Runs once on mount; the tree's own content never
       changes after the server render, so nothing here depends on React
       state (the icon swap it triggers goes through a ref, not a closed-over
       state value — see activeRef above).
       --------------------------------------------------------------------- */
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const EASE = 'cubic-bezier(0.22,1,0.36,1)';
        const pending = new Set();
        const trunkMax = {};
        let io;
        let focusId = null;

        const play = (el) => {
            if (el.hasAttribute('data-reveal')) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
            if (el.hasAttribute('data-draw')) el.style.strokeDashoffset = '0';
        };

        const sweep = () => {
            pending.forEach((el) => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    play(el);
                    io?.unobserve(el);
                    pending.delete(el);
                }
            });
        };

        const swapIcon = (slug) => {
            const ic = iconRef.current;
            if (ic && !reduce) {
                swappingRef.current = true;
                ic.style.opacity = '0';
                ic.style.transform = 'translateY(8px)';
                setTimeout(() => {
                    setActive(slug);
                    swappingRef.current = false;
                    requestAnimationFrame(() => {
                        ic.style.opacity = '1';
                        ic.style.transform = 'none';
                    });
                }, 180);
            } else {
                setActive(slug);
            }
        };

        /* A branch (and its lead node) lights only once the orange trunk has
           grown down to its junction — the top edge of its SVG for a child
           stem, the node's own centre for a lead. Once lit it stays lit. The
           rail follows the reader's focus line forward through both groups
           in document order, so it can only move on to principle N once it
           has passed through everything before it. */
        const gateBranches = (group, trunkY, focusY) => {
            group.querySelectorAll('[data-branch]').forEach((svg) => {
                const b = svg.getBoundingClientRect();
                const lead = svg.dataset.lead === '1';
                const junction = lead ? b.top + 30 : b.top;
                const article = svg.closest('[data-spy]');
                if (focusY >= junction) focusId = article.id;
                // a lead node lights when the reader reaches it (its own trunk
                // grows from it); a child stem waits for the orange trunk
                if (lead ? focusY < junction : trunkY < junction) return;
                if (svg.dataset.lit) return;
                svg.dataset.lit = '1';
                svg.querySelectorAll('[data-reveal],[data-draw]').forEach(play);
                const ul = article.querySelector('[data-uline]');
                if (ul) ul.style.transform = 'scaleX(1)';
            });
        };

        /* The trunk grows with the read: its visible height tracks how far
           the viewport's focus line (45% down) has travelled down the tree
           container. Latching — it only ever grows, so scrolling back up
           leaves what has already been read lit. */
        const trunk = () => {
            focusId = null;
            const focus = window.innerHeight * 0.45;
            root.querySelectorAll('[data-group]').forEach((g) => {
                const line = g.querySelector('[data-trunk]');
                if (!line) return;
                const r = line.getBoundingClientRect();
                const top = r.top;
                const h = line.offsetHeight || 1;
                const now = Math.min(1, Math.max(0, (focus - top) / h));
                const p = Math.max(now, trunkMax[g.dataset.group] || 0);
                trunkMax[g.dataset.group] = p;
                line.style.transform = `scaleY(${p.toFixed(4)})`;
                gateBranches(g, p > 0 ? top + p * h : -Infinity, focus);
            });
            // No junction has reached the focus line (scrolled above the
            // first principle) — falls back to the first rail item rather
            // than freezing on whatever was last active.
            const id = focusId || rail[0]?.slug;
            if (id && id !== activeRef.current && !swappingRef.current) swapIcon(id);
        };

        const setup = () => {
            const nodes = root.querySelectorAll('[data-reveal],[data-draw]');
            if (!io) {
                io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => {
                            // Also plays anything already scrolled PAST — a jumped-over
                            // element (anchor jump, scrollbar drag) never intersects.
                            if (!e.isIntersecting && e.boundingClientRect.top >= 0) return;
                            play(e.target);
                            pending.delete(e.target);
                            io.unobserve(e.target);
                        });
                    },
                    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
                );
            }
            nodes.forEach((el) => {
                if (el.dataset.wired) return;
                el.dataset.wired = '1';
                // Branch graphics are gated on the trunk reaching them (see
                // trunk()/gateBranches()), not on plain visibility.
                const gated = !!el.closest('[data-branch]');
                const d = Number(el.dataset.delay || 0);
                if (el.hasAttribute('data-reveal')) {
                    el.style.opacity = '0';
                    const svgish = el.namespaceURI === 'http://www.w3.org/2000/svg';
                    el.style.transform = svgish ? 'none' : 'translateY(22px)';
                    el.style.transition = `opacity 0.85s ${EASE} ${d}ms, transform 0.85s ${EASE} ${d}ms`;
                }
                if (el.hasAttribute('data-draw')) {
                    const len = el.getTotalLength ? el.getTotalLength() : 0;
                    const dur = Number(el.dataset.dur || 1100);
                    el.style.strokeDasharray = String(len);
                    el.style.strokeDashoffset = String(len);
                    el.style.transition = `stroke-dashoffset ${dur}ms ${el.dataset.ease || EASE} ${d}ms`;
                }
                if (reduce) {
                    play(el);
                    return;
                }
                if (gated) return;
                pending.add(el);
                io.observe(el);
            });
            sweep();
            trunk();
        };

        /* Every stem's horizontal run lands on its heading's underline (8px
           under the text), so stem and underline read as one line; the lead
           node and trunk start from that same height. Measures the heading
           precisely (offsetTop/Height round to whole px and the clamp() type
           sizes are fractional) and cancels out the reveal row's translateY,
           so the maths holds whether or not the row has played yet. */
        const layoutStems = () => {
            root.querySelectorAll('[data-spy]').forEach((art) => {
                const h = art.querySelector('h2, h3');
                const svg = art.querySelector('[data-branch]');
                if (!h || !svg) return;
                const ar = art.getBoundingClientRect();
                const hr = h.getBoundingClientRect();
                let ty = 0;
                let el = h;
                while (el && el !== art) {
                    const m = getComputedStyle(el).transform;
                    if (m && m !== 'none') {
                        const p = m.match(/matrix\(([^)]+)\)/);
                        if (p) ty += parseFloat(p[1].split(',')[5]) || 0;
                    }
                    el = el.parentElement;
                }
                const hTopExact = hr.top - ty - ar.top;
                const u = Math.round(hTopExact + hr.height) + 7;
                const ul = h.querySelector('[data-uline]');
                if (ul) {
                    ul.style.bottom = 'auto';
                    ul.style.top = `${(u - 1 - hTopExact).toFixed(2)}px`;
                }
                const lead = svg.dataset.lead === '1';
                svg.style.top = `${u - (lead ? 30 : 90)}px`;
                if (lead) {
                    art.parentElement.querySelectorAll(':scope > [data-trunkline]').forEach((l) => {
                        l.style.top = `${u.toFixed(1)}px`;
                    });
                }
            });
        };

        let raf1 = requestAnimationFrame(() => {
            raf1 = requestAnimationFrame(() => {
                layoutStems();
                setup();
            });
        });

        let scrollRaf = 0;
        const onScroll = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = 0;
                sweep();
                trunk();
            });
        };
        const onResize = () => {
            layoutStems();
            sweep();
            trunk();
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onScroll);
        window.addEventListener('resize', onResize);
        const t1 = setTimeout(() => {
            layoutStems();
            setup();
        }, 400);
        const t2 = setTimeout(() => {
            layoutStems();
            setup();
        }, 1400);
        document.fonts?.ready?.then(layoutStems).catch(() => {});

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScroll);
            window.removeEventListener('resize', onResize);
            io?.disconnect();
        };
        // Runs once — `groups`/`rail` are stable for the life of this page (no
        // client-side content changes), so re-running this on every render
        // would only re-wire already-wired nodes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="unnyc-pr-story" ref={rootRef}>
            <section className="unnyc-pr-story__hero">
                <div className="unnyc-container unnyc-pr-story__hero-grid">
                    <div>
                        <p className="unnyc-pr-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-pr-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-pr-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        <p
                            className="unnyc-pr-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                    </div>
                    <div className="unnyc-pr-story__hero-image" data-reveal="1" data-delay="200">
                        <img src="/images/home/SDGs01.png" alt="The UN Sustainable Development Goals" />
                    </div>
                </div>
            </section>

            <section className="unnyc-pr-story__eight">
                <div className="unnyc-container">
                    <div className="unnyc-pr-story__detail" data-detail="1">
                        <aside className="unnyc-pr-story__rail" data-rail="1">
                            <div className="unnyc-pr-story__rail-icon-slot">
                                <span
                                    ref={iconRef}
                                    className={
                                        'unnyc-pr-story__rail-icon' +
                                        (activeItem?.lead ? ' unnyc-pr-story__rail-icon--lead' : '')
                                    }
                                >
                                    {activeItem && <UnnycIcon name={activeItem.icon} size={56} />}
                                </span>
                            </div>
                            <nav aria-label="The eight principles">
                                <ol className="unnyc-pr-story__rail-list">
                                    {rail.map((r) => (
                                        <li
                                            key={r.slug}
                                            className={r.lead ? undefined : 'unnyc-pr-story__rail-item--indent'}
                                        >
                                            <a
                                                href={`#${r.slug}`}
                                                className={
                                                    'unnyc-pr-story__rail-link' +
                                                    (r.lead ? ' unnyc-pr-story__rail-link--lead' : '') +
                                                    (r.slug === active ? ' unnyc-pr-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-pr-story__tree" data-tree="1">
                            <div className="unnyc-pr-story__groups">
                                {groups.map((g) => (
                                    <div key={g.id} className="unnyc-pr-story__group" data-group={g.id}>
                                        <div className="unnyc-pr-story__trunkline" data-trunkline="1" />
                                        <div
                                            className="unnyc-pr-story__trunkline unnyc-pr-story__trunkline--fill"
                                            data-trunkline="1"
                                            data-trunk="1"
                                        />
                                        <PrincipleArticle item={g.lead} />
                                        {g.items.map((it) => (
                                            <PrincipleArticle key={it.slug} item={it} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {orgs.length > 0 && (
                <section
                    id="endorsing-organizations"
                    className="unnyc-pr-story__endorsers"
                    ref={dirRef}
                >
                    <div className="unnyc-container unnyc-pr-story__endorsers-grid">
                        <div className="unnyc-pr-story__endorsers-aside">
                            <h2 className="unnyc-pr-story__endorsers-title" data-reveal="1">
                                {endorsers.copy?.title}
                            </h2>
                            {endorsers.copy?.ctaHref && (
                                <Link
                                    href={endorsers.copy.ctaHref}
                                    className="unnyc-btn unnyc-btn--primary"
                                    data-reveal="1"
                                    data-delay="100"
                                >
                                    {endorsers.copy.ctaLabel}
                                </Link>
                            )}
                        </div>
                        <div className="unnyc-pr-story__directory">
                            <div
                                className="unnyc-pr-story__chips"
                                role="group"
                                aria-label={endorsers.copy?.filterLabel}
                                data-reveal="1"
                            >
                                <button
                                    type="button"
                                    onClick={() => pick(null)}
                                    aria-pressed={sector === null}
                                    className={
                                        'unnyc-pr-story__chip' +
                                        (sector === null ? ' unnyc-pr-story__chip--active' : '')
                                    }
                                >
                                    {endorsers.copy?.allLabel}{' '}
                                    <span className="unnyc-pr-story__chip-count">{orgs.length}</span>
                                </button>
                                {sectors.map(([s, n]) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => pick(s === sector ? null : s)}
                                        aria-pressed={s === sector}
                                        className={
                                            'unnyc-pr-story__chip' +
                                            (s === sector ? ' unnyc-pr-story__chip--active' : '')
                                        }
                                    >
                                        {s} <span className="unnyc-pr-story__chip-count">{n}</span>
                                    </button>
                                ))}
                            </div>

                            <p className="unnyc-pr-story__status" aria-live="polite" data-reveal="1" data-delay="60">
                                {endorsers.copy?.showingLabel} {start + 1}–{start + shown.length}{' '}
                                {endorsers.copy?.ofLabel} {filtered.length}{' '}
                                {filtered.length === 1 ? endorsers.copy?.unitOne : endorsers.copy?.unitMany}
                            </p>

                            <ul className="unnyc-pr-story__grid" data-reveal="1" data-delay="100">
                                {shown.map((o) => (
                                    <li key={o.n} className="unnyc-pr-story__org">
                                        <span className="unnyc-pr-story__org-name">{o.organization}</span>
                                        <span className="unnyc-pr-story__org-sector">{o.sector}</span>
                                    </li>
                                ))}
                            </ul>

                            {pageCount > 1 && (
                                <nav
                                    className="unnyc-pr-story__pagination"
                                    aria-label={endorsers.copy?.paginationLabel}
                                >
                                    <button
                                        type="button"
                                        className="unnyc-pr-story__page unnyc-pr-story__page--step"
                                        onClick={() => go(current - 1)}
                                        disabled={current === 1}
                                    >
                                        {endorsers.copy?.prevLabel}
                                    </button>
                                    <span className="unnyc-pr-story__pages">
                                        {pages.map((p, i) =>
                                            p === '…' ? (
                                                <span
                                                    key={`gap-${i}`}
                                                    className="unnyc-pr-story__page-ellipsis"
                                                    aria-hidden="true"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => go(p)}
                                                    aria-label={`${endorsers.copy?.pageLabel} ${p}`}
                                                    aria-current={p === current ? 'page' : undefined}
                                                    className={
                                                        'unnyc-pr-story__page' +
                                                        (p === current ? ' unnyc-pr-story__page--active' : '')
                                                    }
                                                >
                                                    {p}
                                                </button>
                                            ),
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        className="unnyc-pr-story__page unnyc-pr-story__page--step"
                                        onClick={() => go(current + 1)}
                                        disabled={current === pageCount}
                                    >
                                        {endorsers.copy?.nextLabel}
                                    </button>
                                </nav>
                            )}

                            {(endorsers.copy?.note || endorsers.copy?.sourceUrl) && (
                                <p className="unnyc-pr-story__note">
                                    {endorsers.copy?.note}
                                    {endorsers.copy?.sourceUrl && (
                                        <>
                                            {endorsers.copy?.note ? ' ' : null}
                                            <a href={endorsers.copy.sourceUrl} target="_blank" rel="noopener noreferrer">
                                                {endorsers.copy.sourceLabel || endorsers.copy.sourceUrl} ↗
                                            </a>
                                        </>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <section className="unnyc-pr-story__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p className="unnyc-pr-story__foot-lede" data-reveal="1">
                        {foot.text}
                    </p>
                    <div className="unnyc-pr-story__foot-ctas" data-reveal="1" data-delay="100">
                        {foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                    <p className="unnyc-pr-story__foot-doc" data-reveal="1" data-delay="180">
                        <Link href="/principles/document">View as a printable one-pager ↗</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

/** One principle's stem: the lead of a group (a full node + horizontal run,
 * larger heading, DM Serif byline) or one of its three children (a curved
 * branch off the trunk, smaller heading, sans byline). Both share the same
 * prose/gap two-column body. */
function PrincipleArticle({ item }) {
    const HeadingTag = item.lead ? 'h2' : 'h3';
    return (
        <article
            id={item.slug}
            data-spy="1"
            className={'unnyc-pr-story__article' + (item.lead ? ' unnyc-pr-story__article--lead' : '')}
        >
            {item.lead ? (
                <svg
                    data-branch="1"
                    data-lead="1"
                    className="unnyc-pr-story__branch unnyc-pr-story__branch--lead"
                    width="96"
                    height="60"
                    viewBox="0 0 96 60"
                    aria-hidden="true"
                >
                    <circle
                        cx="28"
                        cy="30"
                        r="13"
                        fill="var(--wg-surface-warm)"
                        stroke="var(--wg-accent-warm)"
                        strokeWidth="2"
                    />
                    <circle data-reveal="1" data-delay="200" cx="28" cy="30" r="6" fill="var(--wg-accent-warm)" />
                    <path
                        data-draw="1"
                        data-delay="240"
                        data-dur="420"
                        data-ease="linear"
                        d="M41 30 H 96"
                        fill="none"
                        stroke="var(--wg-accent-warm)"
                        strokeWidth="2"
                    />
                </svg>
            ) : (
                <svg data-branch="1" className="unnyc-pr-story__branch" width="96" height="120" viewBox="0 0 96 120" aria-hidden="true">
                    <path
                        data-draw="1"
                        data-delay="0"
                        data-dur="650"
                        data-ease="linear"
                        d="M28 0 C 28 70 40 90 62 90 H 96"
                        fill="none"
                        stroke="var(--wg-accent)"
                        strokeWidth="2"
                    />
                    <circle data-reveal="1" data-delay="520" cx="62" cy="90" r="4.5" fill="var(--wg-accent)" />
                </svg>
            )}

            {item.lead && (
                <p className="unnyc-pr-story__group-kicker" data-reveal="1">
                    {item.groupLabel}
                </p>
            )}

            <div
                className={'unnyc-pr-story__heading-row' + (item.lead ? ' unnyc-pr-story__heading-row--lead' : '')}
                data-reveal="1"
                data-delay={item.lead ? 60 : undefined}
            >
                <HeadingTag className="unnyc-pr-story__title">
                    {item.title}
                    <span
                        data-uline="1"
                        className={'unnyc-pr-story__uline' + (item.lead ? ' unnyc-pr-story__uline--warm' : '')}
                    />
                </HeadingTag>
            </div>

            <p
                className={item.lead ? 'unnyc-pr-story__byline unnyc-pr-story__byline--lead' : 'unnyc-pr-story__byline'}
                data-reveal="1"
                data-delay={item.lead ? 100 : 60}
            >
                {item.byline}
            </p>

            <div className="unnyc-pr-story__cw">
                <div
                    className="unnyc-pr-story__prose"
                    data-reveal="1"
                    data-delay={item.lead ? 140 : 120}
                    dangerouslySetInnerHTML={{ __html: item.html }}
                />
                {item.gap && (
                    <div className="unnyc-pr-story__gap" data-reveal="1" data-delay={item.lead ? 220 : 200}>
                        <p className="unnyc-pr-story__gap-label">{item.gap.label}</p>
                        <div dangerouslySetInnerHTML={{ __html: item.gap.html }} />
                    </div>
                )}
            </div>
        </article>
    );
}
