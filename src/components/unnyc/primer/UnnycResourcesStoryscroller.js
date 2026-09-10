'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * UnnycResourcesStoryscroller — the storyscroller redesign of /resources
 * ("Related Resources"): a hero, then a sticky icon-crossfading sidebar
 * beside four articles — Primary Sources, People to Call, Find an OSPO, and
 * Open Data — and a foot CTA band. Sibling of the /start, /principles,
 * /crosswalk and /success storyscrollers — same palette, sidebar shape and
 * reveal system, reimplemented here against this page's own content. See
 * page.js for how the props here are shaped from content/resources.md and
 * datasetIndex().
 *
 * Same division as the others: this component renders the whole page
 * (content read server-side, passed down as props) and owns the
 * scroll-driven motion as direct DOM mutation. React state is reserved for
 * the rail's active section, since it drives a re-render of the nav
 * highlight (the icon crossfade itself is imperative, like the reveal
 * animation, since it runs on every scroll tick rather than once).
 */
export default function UnnycResourcesStoryscroller({
    hero,
    railItems,
    resourceGroups,
    contacts,
    ospoDirectory,
    openData,
    datasets,
    foot,
}) {
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
        <div className="unnyc-resources-story" ref={rootRef}>
            <section className="unnyc-resources-story__hero">
                <div className="unnyc-container">
                    <div className="unnyc-resources-story__hero-inner">
                        <p className="unnyc-resources-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-resources-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-resources-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        <p
                            className="unnyc-resources-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                    </div>
                </div>
            </section>

            <section className="unnyc-resources-story__main">
                <div className="unnyc-container">
                    <div className="unnyc-resources-story__detail">
                        <aside className="unnyc-resources-story__rail">
                            <div className="unnyc-resources-story__rail-icon-slot">
                                <RailIcon id="resources" />
                                <RailIcon id="contacts" />
                                <RailIcon id="ospos" />
                                <RailIcon id="open-data" />
                            </div>
                            <nav aria-label="Sections">
                                <ol className="unnyc-resources-story__rail-list">
                                    {railItems.map((r) => (
                                        <li key={r.id}>
                                            <a
                                                href={`#${r.id}`}
                                                className={
                                                    'unnyc-resources-story__rail-link' +
                                                    (r.id === active ? ' unnyc-resources-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.label}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-resources-story__articles">
                            {/* Primary Sources */}
                            <article id="resources" data-spy="resources" className="unnyc-resources-story__article">
                                <ArticleHead title={resourceGroups.title} ledeHtml={resourceGroups.lede} />
                                <div className="unnyc-resources-story__group-stack">
                                    {resourceGroups.groups.map((group) => (
                                        <div key={group.title}>
                                            <GroupLabel text={group.title} />
                                            <div className="unnyc-resources-story__cards">
                                                {group.links.map((link, i) => (
                                                    <CardLink
                                                        key={link.url}
                                                        href={link.url}
                                                        internal={link.internal}
                                                        delay={40 + (i % 2) * 80}
                                                        className="unnyc-resources-story__card"
                                                    >
                                                        <span className="unnyc-resources-story__card-title">
                                                            {link.text} <span>{link.internal ? '→' : '↗'}</span>
                                                        </span>
                                                        <span className="unnyc-resources-story__card-desc">{link.desc}</span>
                                                    </CardLink>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            {/* People to Call */}
                            <article id="contacts" data-spy="contacts" className="unnyc-resources-story__article">
                                <ArticleHead title={contacts.title} ledeHtml={contacts.lede} />
                                <div className="unnyc-resources-story__group-stack">
                                    {contacts.groups.map((group) => (
                                        <div key={group.title}>
                                            <GroupLabel text={group.title} />
                                            <div className="unnyc-resources-story__cards">
                                                {group.items.map((item, i) => (
                                                    <CardLink
                                                        key={item.url}
                                                        href={item.url}
                                                        internal={item.internal}
                                                        delay={40 + (i % 2) * 80}
                                                        className="unnyc-resources-story__card unnyc-resources-story__contact-card"
                                                    >
                                                        <span className="unnyc-resources-story__card-title">
                                                            {item.org} <span>{item.internal ? '→' : '↗'}</span>
                                                        </span>
                                                        <span className="unnyc-resources-story__contact-role">{item.role}</span>
                                                        <span className="unnyc-resources-story__contact-helps">
                                                            <span>How they can help</span>
                                                            {item.helps}
                                                        </span>
                                                    </CardLink>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {contacts.note && (
                                    <p className="unnyc-resources-story__note" data-reveal="1">
                                        {contacts.note}
                                    </p>
                                )}
                            </article>

                            {/* Find an OSPO */}
                            <article id="ospos" data-spy="ospos" className="unnyc-resources-story__article">
                                <ArticleHead title={ospoDirectory.title} ledeHtml={ospoDirectory.lede} tighter />
                                {ospoDirectory.intro && (
                                    <p className="unnyc-resources-story__ospo-intro" data-reveal="1">
                                        {ospoDirectory.intro}
                                    </p>
                                )}
                                {ospoDirectory.diagram && (
                                    <figure className="unnyc-resources-story__diagram" data-reveal="1">
                                        <div className="unnyc-resources-story__diagram-panel">
                                            <Image
                                                src={ospoDirectory.diagram.src}
                                                alt={ospoDirectory.diagram.alt}
                                                width={1800}
                                                height={803}
                                                sizes="(max-width: 900px) 100vw, 900px"
                                            />
                                        </div>
                                        <figcaption>
                                            <a href={ospoDirectory.diagram.creditHref} target="_blank" rel="noopener noreferrer">
                                                {ospoDirectory.diagram.creditText}
                                            </a>
                                        </figcaption>
                                    </figure>
                                )}
                                <div className="unnyc-resources-story__group-stack unnyc-resources-story__group-stack--tight">
                                    {ospoDirectory.groups.map((group) => (
                                        <div key={group.country}>
                                            <GroupLabel text={group.country} />
                                            <div className="unnyc-resources-story__cards">
                                                {group.items.map((item, i) => (
                                                    <div
                                                        key={item.url}
                                                        data-reveal="1"
                                                        data-delay={40 + (i % 2) * 80}
                                                        className="unnyc-resources-story__card unnyc-resources-story__ospo-card"
                                                    >
                                                        <a
                                                            href={item.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="unnyc-resources-story__ospo-name"
                                                        >
                                                            {item.name} <span>↗</span>
                                                        </a>
                                                        <span className="unnyc-resources-story__ospo-city">{item.city}</span>
                                                        <span className="unnyc-resources-story__ospo-desc">{item.description}</span>
                                                        <span className="unnyc-resources-story__ospo-links">
                                                            <a href={`mailto:${item.email}`}>{item.email}</a>
                                                            {item.flossPolicy && (
                                                                <a href={item.flossPolicy} target="_blank" rel="noopener noreferrer">
                                                                    Open source policy ↗
                                                                </a>
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="unnyc-resources-story__note" data-reveal="1">
                                    <span className="unnyc-resources-story__note-label">Source</span>
                                    <a href={ospoDirectory.sourceUrl} target="_blank" rel="noopener noreferrer">
                                        floss-pso.network
                                    </a>
                                </p>
                            </article>

                            {/* Open Data */}
                            <article id="open-data" data-spy="open-data" className="unnyc-resources-story__article">
                                <ArticleHead title={openData.title} ledeHtml={openData.lede} />
                                <div className="unnyc-resources-story__cards">
                                    {datasets.map((d, i) => {
                                        const ours = d.attribution.startsWith('UNNYC');
                                        return (
                                            <a
                                                key={d.slug}
                                                href={hrefFor(d.url)}
                                                data-reveal="1"
                                                data-delay={40 + (i % 2) * 80}
                                                className="unnyc-resources-story__card unnyc-resources-story__dataset-card"
                                            >
                                                <span className="unnyc-resources-story__card-title">{d.name}</span>
                                                <span className="unnyc-resources-story__card-desc">{d.description}</span>
                                                <span className="unnyc-resources-story__dataset-meta">
                                                    <strong>{d.count} records</strong> · {d.licence} ·{' '}
                                                    {ours ? 'compiled by this campaign' : `credit ${d.source}`}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                                {openData.note && (
                                    <p className="unnyc-resources-story__note unnyc-resources-story__note--wide" data-reveal="1">
                                        {openData.note}
                                    </p>
                                )}
                                <p className="unnyc-resources-story__data-links" data-reveal="1">
                                    <a href="/data/index.json">{openData.indexLabel}</a>
                                    {' · '}
                                    <a href="/llms.txt">{openData.llmsLabel}</a>
                                </p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="unnyc-resources-story__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p data-reveal="1">{foot.text}</p>
                    <div className="unnyc-resources-story__foot-links" data-reveal="1" data-delay="100">
                        {foot.links.map((l) => (
                            <Link key={l.href} href={l.href} className={`unnyc-resources-story__foot-btn unnyc-resources-story__foot-btn--${l.style}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

/** The dataset envelope's `url` is absolute (correctly — it must work from
 * anywhere data/*.json is fetched from); an on-page link wants root-relative
 * instead, so it follows whichever origin the reader is actually on rather
 * than always pointing at production. Same helper as the PrimerOpenData it
 * replaces. Falls back to the absolute URL if it's ever not parseable. */
function hrefFor(url) {
    try {
        return new URL(url).pathname;
    } catch {
        return url;
    }
}

function ArticleHead({ title, ledeHtml, tighter }) {
    return (
        <div className={'unnyc-resources-story__article-head' + (tighter ? ' unnyc-resources-story__article-head--tight' : '')}>
            <h2 data-reveal="1">{title}</h2>
            <p data-reveal="1" data-delay="60" dangerouslySetInnerHTML={{ __html: ledeHtml }} />
        </div>
    );
}

function GroupLabel({ text }) {
    return (
        <h3 className="unnyc-resources-story__group-label" data-reveal="1">
            <i aria-hidden="true" className="unnyc-resources-story__group-rule" />
            {text}
        </h3>
    );
}

/** Whole-card link: an internal path (`internal: true`) uses next/link and a
 * "→" arrow; anything else opens in a new tab with a "↗" arrow — the same
 * `internal` convention content/resources.md already uses for the primary
 * sources and contacts lists. */
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

/** The sidebar's four crossfading icons — Lucide-style paths from the design
 * handoff. `currentColor` (set via the wrapping class's `color`) carries the
 * shared blue stroke; each icon's one orange accent is set inline so it
 * stays correct regardless of `currentColor`. */
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
        className: 'unnyc-resources-story__rail-icon',
        'data-tico': id,
    };
    const accent = { stroke: 'var(--wg-accent-warm)' };
    switch (id) {
        case 'resources':
            return (
                <svg {...common}>
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    <path d="M9 7h6" style={accent} />
                    <path d="M9 11h4" style={accent} />
                </svg>
            );
        case 'contacts':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                    <path d="M15 3a6 6 0 0 1 6 6" style={accent} />
                    <path d="M15 7a2 2 0 0 1 2 2" style={accent} />
                </svg>
            );
        case 'ospos':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" style={accent} />
                </svg>
            );
        case 'open-data':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                    <path d="M3 12a9 3 0 0 0 18 0" style={accent} />
                </svg>
            );
        default:
            return null;
    }
}
