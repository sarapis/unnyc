'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * UnnycOspoStoryscroller — the /ospo-strategy layout: a hero, then a sticky
 * icon-crossfading sidebar beside three articles — the executive summary
 * presented as an official memo, the longer policy brief, and the supporting
 * resources. Sibling of the /resources storyscroller (whose reveal and rail
 * effect this reuses unchanged) — same palette, sidebar shape and reveal
 * system, reimplemented against this page's own content.
 *
 * ALL COPY COMES IN AS PROPS from content/ospo-strategy.md via page.js; this
 * file is layout only. The memo header and the recommendations are also
 * rendered by /ospo-strategy/document, the printable, from the same fields.
 *
 * ⚠ Scroll behaviour is unverifiable with the tools in this repo (the preview
 * pane delivers no scroll events — see docs/CONTINUATION-PROMPT.md); check the
 * rail and the reveals in a real browser.
 */
export default function UnnycOspoStoryscroller({ hero, railItems, memo, summary, brief, resources }) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(railItems[0]?.id);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const EASE = 'cubic-bezier(0.22,1,0.36,1)';
        const pending = new Set();
        let io;

        const play = (el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
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

        const setup = () => {
            const nodes = root.querySelectorAll('[data-reveal]');
            if (!io) {
                io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => {
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
                const d = Number(el.dataset.delay || 0);
                el.style.opacity = '0';
                el.style.transform = 'translateY(22px)';
                el.style.transition = `opacity 0.85s ${EASE} ${d}ms, transform 0.85s ${EASE} ${d}ms`;
                if (reduce) {
                    play(el);
                    return;
                }
                pending.add(el);
                io.observe(el);
            });
            sweep();
        };

        /* Active section = last article whose top has passed the focus line
           (40% of viewport) — same technique as every other storyscroller's
           rail. Also crossfades the sidebar's stacked icons in place. */
        const updateRail = () => {
            const arts = root.querySelectorAll('[data-spy]');
            if (!arts.length) return;
            const focus = window.innerHeight * 0.4;
            let cur = arts[0];
            arts.forEach((a) => {
                if (a.getBoundingClientRect().top <= focus) cur = a;
            });
            const id = cur.dataset.spy;
            root.querySelectorAll('[data-tico]').forEach((el) => {
                el.style.opacity = el.dataset.tico === id ? '1' : '0';
            });
            setActive((prev) => (prev === id ? prev : id));
        };

        let raf1 = requestAnimationFrame(() => {
            raf1 = requestAnimationFrame(() => {
                setup();
                updateRail();
            });
        });

        let scrollRaf = 0;
        const onScroll = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = 0;
                sweep();
                updateRail();
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onScroll);
        window.addEventListener('resize', onScroll);
        const t1 = setTimeout(() => {
            setup();
            updateRail();
        }, 400);
        const t2 = setTimeout(() => {
            setup();
            updateRail();
        }, 1400);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScroll);
            window.removeEventListener('resize', onScroll);
            io?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="unnyc-ospo-story" ref={rootRef}>
            <section className="unnyc-ospo-story__hero">
                <div className="unnyc-container">
                    <div className="unnyc-ospo-story__hero-inner">
                        <p className="unnyc-ospo-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-ospo-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-ospo-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        <p
                            className="unnyc-ospo-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                        <div className="unnyc-ospo-story__hero-actions" data-reveal="1" data-delay="230">
                            <Link href={hero.documentCta.href} className="unnyc-ospo-story__btn unnyc-ospo-story__btn--ghost">
                                {hero.documentCta.label} <span aria-hidden="true">→</span>
                            </Link>
                            <a href="#brief" className="unnyc-ospo-story__hero-link">
                                Skip to the policy brief
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="unnyc-ospo-story__main">
                <div className="unnyc-container">
                    <div className="unnyc-ospo-story__detail">
                        <aside className="unnyc-ospo-story__rail">
                            <div className="unnyc-ospo-story__rail-icon-slot">
                                <RailIcon id="summary" />
                                <RailIcon id="brief" />
                                <RailIcon id="resources" />
                            </div>
                            <nav aria-label="Sections">
                                <ol className="unnyc-ospo-story__rail-list">
                                    {railItems.map((r) => (
                                        <li key={r.id}>
                                            <a
                                                href={`#${r.id}`}
                                                className={
                                                    'unnyc-ospo-story__rail-link' +
                                                    (r.id === active ? ' unnyc-ospo-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.label}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-ospo-story__articles">
                            {/* Executive Summary — the memo */}
                            <article id="summary" data-spy="summary" className="unnyc-ospo-story__article">
                                <ArticleHead title={summary.title} ledeHtml={summary.ledeHtml} />

                                <div className="unnyc-ospo-story__memo">
                                    <header className="unnyc-ospo-story__memo-head" data-reveal="1">
                                        <p className="unnyc-ospo-story__memo-kicker">{memo.kicker}</p>
                                        <dl className="unnyc-ospo-story__memo-meta">
                                            {memo.addressed.map((row) => (
                                                <div key={row.label} className="unnyc-ospo-story__memo-row">
                                                    <dt>{row.label}</dt>
                                                    <dd>{row.value}</dd>
                                                </div>
                                            ))}
                                            <div className="unnyc-ospo-story__memo-row">
                                                <dt>Date</dt>
                                                <dd>{memo.date}</dd>
                                            </div>
                                        </dl>
                                    </header>

                                    <div className="unnyc-ospo-story__memo-body">
                                        <div
                                            className="unnyc-ospo-story__prose unnyc-ospo-story__prose--lead"
                                            data-reveal="1"
                                            dangerouslySetInnerHTML={{ __html: summary.introHtml }}
                                        />
                                        {summary.blocks.map((b, i) => (
                                            <section
                                                key={b.label}
                                                className="unnyc-ospo-story__memo-block"
                                                data-reveal="1"
                                                data-delay={Math.min(i, 2) * 40}
                                            >
                                                <h3>{b.label}</h3>
                                                <div className="unnyc-ospo-story__prose" dangerouslySetInnerHTML={{ __html: b.html }} />
                                            </section>
                                        ))}

                                        <section className="unnyc-ospo-story__recs" data-reveal="1">
                                            <h3>{summary.recommendationsTitle}</h3>
                                            <ol className="unnyc-ospo-story__recs-list">
                                                {summary.recommendations.map((r, i) => (
                                                    <li key={r.title} data-reveal="1" data-delay={i * 60}>
                                                        <strong>{r.title}</strong>
                                                        <p>{r.desc}</p>
                                                    </li>
                                                ))}
                                            </ol>
                                        </section>
                                    </div>

                                    <footer className="unnyc-ospo-story__memo-foot" data-reveal="1">
                                        <Link href={summary.documentCta.href} className="unnyc-ospo-story__btn unnyc-ospo-story__btn--ghost">
                                            {summary.documentCta.label} <span aria-hidden="true">→</span>
                                        </Link>
                                        <Link href={summary.signCta.href} className="unnyc-ospo-story__btn unnyc-ospo-story__btn--primary">
                                            {summary.signCta.label} <span aria-hidden="true">→</span>
                                        </Link>
                                    </footer>
                                </div>
                            </article>

                            {/* Policy Brief */}
                            <article id="brief" data-spy="brief" className="unnyc-ospo-story__article">
                                <ArticleHead title={brief.title} ledeHtml={brief.ledeHtml} />

                                <nav className="unnyc-ospo-story__toc" aria-label="In this brief" data-reveal="1">
                                    {brief.blocks.map((b) => (
                                        <a key={b.label} href={`#brief-${slug(b.label)}`} className="unnyc-ospo-story__toc-link">
                                            {b.label}
                                        </a>
                                    ))}
                                </nav>

                                <div
                                    className="unnyc-ospo-story__prose unnyc-ospo-story__prose--lead unnyc-ospo-story__brief-intro"
                                    data-reveal="1"
                                    dangerouslySetInnerHTML={{ __html: brief.introHtml }}
                                />
                                {brief.blocks.map((b) => (
                                    <section
                                        key={b.label}
                                        id={`brief-${slug(b.label)}`}
                                        className="unnyc-ospo-story__brief-block"
                                        data-reveal="1"
                                    >
                                        <h3>{b.label}</h3>
                                        <div className="unnyc-ospo-story__prose" dangerouslySetInnerHTML={{ __html: b.html }} />
                                    </section>
                                ))}
                            </article>

                            {/* Supporting Resources */}
                            <article id="resources" data-spy="resources" className="unnyc-ospo-story__article">
                                <ArticleHead title={resources.title} ledeHtml={resources.ledeHtml} />
                                <div className="unnyc-ospo-story__group-stack">
                                    {resources.groups.map((g) => (
                                        <div key={g.title} className="unnyc-ospo-story__group">
                                            <GroupLabel text={g.title} />
                                            <div className="unnyc-ospo-story__grid">
                                                {g.links.map((l, i) => (
                                                    <CardLink
                                                        key={l.url}
                                                        href={l.url}
                                                        internal={l.internal}
                                                        delay={(i % 3) * 60}
                                                        className="unnyc-ospo-story__card"
                                                    >
                                                        <span className="unnyc-ospo-story__card-title">
                                                            {l.text}
                                                            <span aria-hidden="true" className="unnyc-ospo-story__card-arrow">
                                                                {l.internal ? '→' : '↗'}
                                                            </span>
                                                        </span>
                                                        <span className="unnyc-ospo-story__card-desc">{l.desc}</span>
                                                    </CardLink>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/** A `### Label` as an id fragment, for the brief's in-page table of contents. */
function slug(label) {
    return label
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function ArticleHead({ title, ledeHtml }) {
    return (
        <div className="unnyc-ospo-story__article-head">
            <h2 data-reveal="1">{title}</h2>
            <p data-reveal="1" data-delay="60" dangerouslySetInnerHTML={{ __html: ledeHtml }} />
        </div>
    );
}

function GroupLabel({ text }) {
    return (
        <h3 className="unnyc-ospo-story__group-label" data-reveal="1">
            <i aria-hidden="true" className="unnyc-ospo-story__group-rule" />
            {text}
        </h3>
    );
}

/** Whole-card link: an internal path (`internal: true`) uses next/link; anything
 * else opens in a new tab — the same `internal` convention content/resources.md
 * uses. */
function CardLink({ href, internal, delay, className, children }) {
    const props = { className, 'data-reveal': '1', 'data-delay': delay };
    if (internal) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
}

/** The sidebar's three crossfading icons — Lucide-style paths, like the other
 * storyscrollers'. `currentColor` carries the shared blue stroke; each icon's
 * one orange accent is set inline. Only the first starts visible; the scroll-spy
 * effect writes the rest via `data-tico`. */
function RailIcon({ id }) {
    const common = {
        viewBox: '0 0 24 24',
        width: 56,
        height: 56,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        className: 'unnyc-ospo-story__rail-icon',
        'data-tico': id,
    };
    const accent = { stroke: 'var(--wg-accent-warm)' };
    switch (id) {
        case 'summary':
            return (
                <svg {...common}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" style={accent} />
                    <path d="M8 17h5" style={accent} />
                </svg>
            );
        case 'brief':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    <path d="M6 8h3" style={accent} />
                    <path d="M15 8h3" style={accent} />
                </svg>
            );
        case 'resources':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" style={accent} />
                </svg>
            );
        default:
            return null;
    }
}
