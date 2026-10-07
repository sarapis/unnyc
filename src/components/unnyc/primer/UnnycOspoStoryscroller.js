'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * UnnycOspoStoryscroller — the /ospo-strategy layout: a hero, then a sticky
 * icon-crossfading sidebar beside four articles — the per-city Playbooks
 * (a fact card and an expandable catalogue of sources for each city OSPO),
 * the executive summary presented as an official memo, the longer policy
 * brief, and the supporting resources. Sibling of the /resources
 * storyscroller (whose reveal and rail effect this reuses unchanged) — same
 * palette, sidebar shape and reveal system, reimplemented against this page's
 * own content.
 *
 * ALL COPY COMES IN AS PROPS from content/ospo-strategy.md via page.js, and
 * every city's facts and sources from content/ospo-catalogue/<city>.json;
 * this file is layout only. The memo header and the recommendations are also
 * rendered by /ospo-strategy/document, the printable, from the same fields.
 *
 * ⚠ The catalogues are native <details>, and the reveal observer is NOT
 * attached inside them: a `data-reveal` node that starts inside a closed
 * <details> never intersects, so it would stay at opacity 0 when opened.
 *
 * ⚠ Scroll behaviour is unverifiable with the tools in this repo (the preview
 * pane delivers no scroll events — see docs/CONTINUATION-PROMPT.md); check the
 * rail and the reveals in a real browser.
 */
export default function UnnycOspoStoryscroller({ hero, railItems, playbooks, memo, summary, brief, resources }) {
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
                            <a href="#summary" className="unnyc-ospo-story__hero-link">
                                Skip to the executive summary
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
                                <RailIcon id="playbooks" />
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
                            {/* Playbooks — one sub-section per city OSPO */}
                            <article id="playbooks" data-spy="playbooks" className="unnyc-ospo-story__article">
                                <ArticleHead title={playbooks.title} ledeHtml={playbooks.ledeHtml} />
                                {playbooks.directory && <PlaybookDirectory dir={playbooks.directory} />}
                                <div className="unnyc-ospo-story__pb-stack">
                                    {playbooks.cases.map((entry) => (
                                        <PlaybookCase key={entry.case.id} entry={entry} labels={playbooks} />
                                    ))}
                                </div>
                            </article>

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

/* ---------------------------------------------------------------------------
   Playbooks — the ranked directory from content/ospo-playbooks.json
   --------------------------------------------------------------------------- */

/** The shortlist above the city cards: the catalogue entries a city could
 * start building from, in the handoff's rank order. Each entry is its primary
 * link, one meta line (publisher · license · case), what it gives, its caveat,
 * and the other documents it bundles. Closes with the three documents no case
 * supplies — shown because the gap is the point. The handoff's
 * `transfers_to_nyc` recommendation ids are NOT rendered: the cross-case
 * themes doc they refer to isn't on the site. */
function PlaybookDirectory({ dir }) {
    const cardFor = (caseId) => (dir.caseIds?.includes(caseId) ? `#playbooks-${caseId}` : null);
    return (
        <section className="unnyc-ospo-story__dir" aria-labelledby="playbooks-directory">
            <h3 id="playbooks-directory" className="unnyc-ospo-story__dir-title" data-reveal="1">
                {dir.title}
            </h3>
            {dir.ledeHtml && (
                <p className="unnyc-ospo-story__dir-lede" data-reveal="1" data-delay="60" dangerouslySetInnerHTML={{ __html: dir.ledeHtml }} />
            )}
            <ol className="unnyc-ospo-story__dir-list">
                {dir.items.map((p, i) => {
                    const caseLabel = dir.caseLabels?.[p.case] || humanize(p.case);
                    const card = cardFor(p.case);
                    const bundled = (p.resources || []).filter((r) => r.url !== p.url);
                    return (
                        <li key={p.rank ?? p.title} className="unnyc-ospo-story__dir-item" data-reveal="1" data-delay={Math.min(i, 3) * 40}>
                            <span className="unnyc-ospo-story__dir-rank" aria-hidden="true">
                                {p.rank}
                            </span>
                            <div className="unnyc-ospo-story__dir-body">
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className="unnyc-ospo-story__dir-link">
                                    {p.title} <span aria-hidden="true" className="unnyc-ospo-story__dir-arrow">↗</span>
                                </a>
                                <p className="unnyc-ospo-story__dir-meta">
                                    {[p.publisher, p.license].filter(Boolean).join(' · ')}
                                    {' · '}
                                    {card ? (
                                        <a href={card} className="unnyc-ospo-story__dir-case">
                                            {caseLabel} <span aria-hidden="true">→</span>
                                        </a>
                                    ) : (
                                        <span className="unnyc-ospo-story__dir-case">{caseLabel}</span>
                                    )}
                                </p>
                                {p.what_it_gives && <p className="unnyc-ospo-story__dir-what">{p.what_it_gives}</p>}
                                {p.caveat && <p className="unnyc-ospo-story__dir-caveat">{p.caveat}</p>}
                                {bundled.length > 0 && (
                                    <p className="unnyc-ospo-story__dir-includes">
                                        <strong>{dir.includesLabel}:</strong>{' '}
                                        {bundled.map((r, j) => (
                                            <span key={r.id || r.url}>
                                                {j > 0 && ', '}
                                                <a href={r.url} target="_blank" rel="noopener noreferrer">
                                                    {r.title}
                                                </a>
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
            {dir.missing?.length > 0 && (
                <div className="unnyc-ospo-story__dir-missing" data-reveal="1">
                    <h4>{dir.missingLabel}</h4>
                    <ul>
                        {dir.missing.map((m) => (
                            <li key={m}>{m}</li>
                        ))}
                    </ul>
                    {dir.missingNote && <p>{dir.missingNote}</p>}
                </div>
            )}
        </section>
    );
}

/* ---------------------------------------------------------------------------
   Playbooks — one city OSPO from content/ospo-catalogue/<city>.json
   --------------------------------------------------------------------------- */

/** A city's fact card and its expandable catalogue. Every value is read from
 * the JSON `case` record; the count of sources is derived from `resources`,
 * never typed. Null or missing facts render as "not published" rather than
 * being skipped, because the gaps are part of the record (the handoff README
 * says so explicitly). */
function PlaybookCase({ entry, labels }) {
    const { case: c, resources } = entry;
    const id = `playbooks-${c.id}`;
    const f = labels.facts;

    /* Whatever the record has: Munich planned 4 at launch and 2 permanent and
       publishes no current figure; Paris has one named officer and no plan.
       Only when NOTHING is known does it say "Not published". */
    const headcount = (() => {
        const parts = [];
        if (c.headcount?.planned_at_launch != null) parts.push(`${c.headcount.planned_at_launch} at launch`);
        if (c.headcount?.planned_permanent != null) parts.push(`${c.headcount.planned_permanent} permanent`);
        if (c.headcount?.current != null) parts.push(`${c.headcount.current} today`);
        else if (parts.length) parts.push(`today: ${labels.notPublishedLabel.toLowerCase()}`);
        return parts.length ? parts.join(' · ') : labels.notPublishedLabel;
    })();

    /* The handoff keys budgets by currency (startup_eur / sponsorship_eur_per_year
       for the European cities, startup_usd / annual_usd for CMS). */
    const budget = (() => {
        const b = c.budget || {};
        const parts = [];
        if (b.startup_eur != null) parts.push(`${fmtMoney(b.startup_eur, 'EUR')} start-up`);
        if (b.startup_usd != null) parts.push(`${fmtMoney(b.startup_usd, 'USD')} start-up`);
        if (b.sponsorship_eur_per_year != null) parts.push(`${fmtMoney(b.sponsorship_eur_per_year, 'EUR')} a year for sponsorship`);
        if (b.annual_eur != null) parts.push(`${fmtMoney(b.annual_eur, 'EUR')} a year`);
        if (b.annual_usd != null) parts.push(`${fmtMoney(b.annual_usd, 'USD')} a year`);
        return parts.length ? parts.join(' · ') : labels.notPublishedLabel;
    })();

    return (
        <section id={id} className="unnyc-ospo-story__pb" data-reveal="1">
            {/* The same photo the city's case study on /success uses, as the
                card's header — passed in from content/success.md by page.js, so
                the two pages can't drift. No title on it (owner call). */}
            {entry.banner?.src && (
                <div className="unnyc-ospo-story__pb-banner">
                    <Image
                        src={entry.banner.src}
                        alt={entry.banner.alt || ''}
                        fill
                        sizes="(max-width: 900px) 100vw, 900px"
                        className="unnyc-ospo-story__pb-banner-img"
                    />
                </div>
            )}

            <div className="unnyc-ospo-story__pb-main">
            {/* The title IS the link to the office's own site — the arrow says
                so — rather than a separate "office website" line. */}
            <h3 className="unnyc-ospo-story__pb-title">
                {c.contact?.website ? (
                    <a href={c.contact.website} target="_blank" rel="noopener noreferrer">
                        {c.name} <span aria-hidden="true" className="unnyc-ospo-story__pb-title-arrow">↗</span>
                    </a>
                ) : (
                    c.name
                )}
            </h3>

            <dl className="unnyc-ospo-story__pb-facts">
                <div>
                    <dt>{f.founded}</dt>
                    <dd>{fmtDate(c.founded)}{c.status ? ` · ${humanize(c.status)}` : ''}</dd>
                </div>
                <div>
                    <dt>{f.placement}</dt>
                    <dd>{c.placement || labels.notPublishedLabel}</dd>
                </div>
                <div>
                    <dt>{f.headcount}</dt>
                    <dd>{headcount}</dd>
                </div>
                <div>
                    <dt>{f.budget}</dt>
                    <dd>{budget}</dd>
                </div>
                <div>
                    <dt>{f.procurement}</dt>
                    <dd>{PROCUREMENT_ROLE[c.role_in_procurement] || humanize(c.role_in_procurement) || labels.notPublishedLabel}</dd>
                </div>
                {c.authorizing_act && (
                    <div className="unnyc-ospo-story__pb-fact--wide">
                        <dt>{f.authorizingAct}</dt>
                        <dd>
                            <a href={c.authorizing_act.url} target="_blank" rel="noopener noreferrer">
                                {c.authorizing_act.title} <span aria-hidden="true">↗</span>
                            </a>
                            {c.authorizing_act.body || c.authorizing_act.date ? (
                                <span className="unnyc-ospo-story__pb-fact-note">
                                    {[c.authorizing_act.body, fmtDate(c.authorizing_act.date)].filter(Boolean).join(', ')}
                                </span>
                            ) : null}
                        </dd>
                    </div>
                )}
            </dl>

            {c.analysis_brief?.url && (
                <p className="unnyc-ospo-story__pb-read">
                    <Link href={c.analysis_brief.url} className="unnyc-ospo-story__pb-link">
                        {labels.caseStudyLabel} <span aria-hidden="true">→</span>
                    </Link>
                </p>
            )}
            </div>

            <details className="unnyc-ospo-story__pb-catalogue">
                <summary>
                    <span className="unnyc-ospo-story__pb-catalogue-label">
                        {labels.catalogueLabel}
                        <span className="unnyc-ospo-story__pb-count">
                            {resources.length} {labels.countLabel}
                        </span>
                    </span>
                </summary>
                <ol className="unnyc-ospo-story__pb-list">
                    {resources.map((r) => (
                        <CatalogueEntry key={r.id} r={r} labels={labels} />
                    ))}
                </ol>
            </details>
        </section>
    );
}

function CatalogueEntry({ r, labels }) {
    const kind = GLYPH_KIND[r.type] || 'page';
    return (
        <li className="unnyc-ospo-story__entry">
            {/* The document image with its kind named under it — the one place
                the glyph is explained, per entry rather than in a legend. */}
            <div className="unnyc-ospo-story__entry-doc">
                <DocGlyph type={r.type} image={r.image} />
                <span className="unnyc-ospo-story__entry-kind">{labels.kinds?.[kind] || humanize(kind)}</span>
            </div>
            <div className="unnyc-ospo-story__entry-body">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="unnyc-ospo-story__entry-title">
                    {r.title} <span aria-hidden="true">↗</span>
                </a>
                <p className="unnyc-ospo-story__entry-meta">
                    {[r.publisher, fmtDate(r.date), r.language ? r.language.toUpperCase() : null].filter(Boolean).join(' · ')}
                </p>
                {r.what_it_is_for && <p className="unnyc-ospo-story__entry-what">{r.what_it_is_for}</p>}
                {r.use_for_ospo_construction && (
                    <p className="unnyc-ospo-story__entry-use">
                        <strong>{labels.useLabel}:</strong> {r.use_for_ospo_construction}
                    </p>
                )}
            </div>
        </li>
    );
}

/** The entry's "document image": a real image when the JSON supplies one,
 * otherwise a typed glyph — a sheet of paper carrying a mark for the kind of
 * source (council paper, official page, press, analysis, interview or talk,
 * code). Hand-drawn in the site's style; no third-party asset, nothing to
 * license. The `type` → glyph mapping is deliberately coarse. */
function DocGlyph({ type, image }) {
    if (image) {
        return (
            <span className="unnyc-ospo-story__glyph unnyc-ospo-story__glyph--image">
                <img src={image} alt="" loading="lazy" />
            </span>
        );
    }
    const kind = GLYPH_KIND[type] || 'page';
    const accent = { stroke: 'var(--wg-accent-warm)' };
    return (
        <span className={`unnyc-ospo-story__glyph unnyc-ospo-story__glyph--${kind}`} aria-hidden="true">
            <svg viewBox="0 0 44 56" width="44" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h22l10 10v40H6z" />
                <path d="M28 3v10h10" />
                {kind === 'council' && (
                    <>
                        <circle cx="16" cy="25" r="5" style={accent} />
                        <path d="M26 23h10M26 28h10M12 37h24M12 43h18" />
                    </>
                )}
                {kind === 'page' && (
                    <>
                        <path d="M11 20h22v22H11z" />
                        <path d="M11 25h22" />
                        <path d="M14 22.5h1.5M17 22.5h1.5" style={accent} />
                        <path d="M15 31h14M15 36h9" />
                    </>
                )}
                {kind === 'press' && (
                    <>
                        <path d="M11 21h22" style={accent} strokeWidth="2.5" />
                        <path d="M11 27h10v10H11zM24 27h9M24 32h9M24 37h9M11 42h22" />
                    </>
                )}
                {kind === 'analysis' && (
                    <>
                        <path d="M13 44V32M20 44V26M27 44V36M34 44V22" />
                        <path d="M13 29l7-4 7 7 7-11" style={accent} />
                    </>
                )}
                {kind === 'voice' && (
                    <>
                        <rect x="18" y="20" width="8" height="14" rx="4" style={accent} />
                        <path d="M14 30a8 8 0 0 0 16 0M22 38v5M18 43h8" />
                    </>
                )}
                {kind === 'code' && (
                    <>
                        <path d="M17 24l-6 7 6 7M27 24l6 7-6 7" />
                        <path d="M24 22l-4 18" style={accent} />
                    </>
                )}
                {kind === 'doc' && (
                    <>
                        <path d="M12 22h20" style={accent} />
                        <path d="M12 28h20M12 34h20M12 40h13" />
                    </>
                )}
                {kind === 'policy' && (
                    <>
                        <path d="M12 22h20M12 28h20M12 34h12" />
                        <circle cx="30" cy="40" r="4.5" style={accent} />
                        <path d="M27.5 44l-1.5 6 4-2.5 4 2.5-1.5-6" style={accent} />
                    </>
                )}
                {kind === 'tool' && (
                    <>
                        <circle cx="22" cy="33" r="5" style={accent} />
                        <path d="M22 24v3M22 39v3M13 33h3M28 33h3M15.6 26.6l2.2 2.2M26.2 37.2l2.2 2.2M15.6 39.4l2.2-2.2M26.2 28.8l2.2-2.2" style={accent} />
                    </>
                )}
            </svg>
        </span>
    );
}

/** JSON `type` → glyph kind. Coarse on purpose; the kinds are the words a
 * reader needs ("is this a law, a website, an article?"), not a taxonomy.
 * Munich's types first, then the ones Paris's file added, then CMS's (the
 * federal case brought laws, charters, process guides and tools). Anything
 * unlisted falls back to 'page'. */
const GLYPH_KIND = {
    founding_decision: 'council',
    policy_decision: 'council',
    budget_decision: 'council',
    council_paper: 'council',
    council_answer: 'council',
    political_motion: 'council',
    statute: 'policy',
    federal_policy: 'policy',
    policy: 'policy',
    policy_pointer: 'policy',
    framework: 'policy',
    charter: 'policy',
    charter_text: 'policy',
    founding_strategy: 'policy',
    legal_act: 'policy',
    regulatory_finding: 'policy',
    official_page: 'page',
    reference: 'page',
    directory: 'page',
    press: 'press',
    advocacy: 'press',
    announcement: 'press',
    official_release: 'press',
    commentary: 'press',
    recap: 'press',
    article: 'press',
    critique: 'press',
    analysis: 'analysis',
    case_study: 'analysis',
    academic: 'analysis',
    profile: 'analysis',
    report: 'analysis',
    interview: 'voice',
    talk: 'voice',
    presentation: 'voice',
    code: 'code',
    tool: 'tool',
    dashboard: 'tool',
    document: 'doc',
    guide: 'doc',
    process: 'doc',
};

const PROCUREMENT_ROLE = {
    advisory: 'Advisory — consulted, does not decide',
    none: 'None',
    review_required: 'Review required',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** ISO date, partial date (YYYY or YYYY-MM) or "n.d." as a reader would write
 * it. Not `toLocaleDateString`: these are catalogue dates that must render
 * identically on the server and in the browser, whatever the viewer's locale. */
function fmtDate(d) {
    if (!d || d === 'n.d.') return d || '';
    const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(d);
    if (!m) return d;
    const [, y, mo, day] = m;
    if (!mo) return y;
    const month = MONTHS[Number(mo) - 1] ?? mo;
    return day ? `${month} ${Number(day)}, ${y}` : `${month} ${y}`;
}

/** A whole-unit amount with its currency sign — en-US grouping on purpose so
 * server and client render the same string regardless of the viewer's locale. */
function fmtMoney(n, currency) {
    const sign = currency === 'USD' ? '$' : '€';
    return sign + Number(n).toLocaleString('en-US');
}

function humanize(s) {
    return s ? String(s).replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '';
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

/** The sidebar's four crossfading icons — Lucide-style paths, like the other
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
        case 'playbooks':
            return (
                <svg {...common}>
                    <path d="M12 2 2 7l10 5 10-5-10-5z" />
                    <path d="M2 12l10 5 10-5" style={accent} />
                    <path d="M2 17l10 5 10-5" />
                </svg>
            );
        case 'summary':
            return (
                <svg {...common} style={{ opacity: 0 }}>
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
