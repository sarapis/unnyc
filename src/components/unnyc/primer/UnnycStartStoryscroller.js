'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

/** UnnycWorldMap fetches a world atlas and computes SVG paths client-side —
 * dynamically imported (ssr:false) for the same reason PrimerMovementNow
 * dynamically imports the Leaflet map it replaces: no browser globals / async
 * geometry work during server render. */
const UnnycWorldMap = dynamic(() => import('./UnnycWorldMap'), { ssr: false });

/**
 * UnnycStartStoryscroller — the storyscroller redesign of /start ("A Global
 * Movement"): a hero, then a sticky icon-crossfading sidebar beside three
 * articles — the vocabulary cards, the world map (UnnycWorldMap), and the
 * UN's timeline. Sibling of the /principles, /crosswalk and /success
 * storyscrollers — same palette, sidebar shape and reveal system,
 * reimplemented here against this page's own content. See page.js for how
 * the props here are shaped from content/start.md.
 *
 * Same division as the other three: this component renders the whole page
 * (content read server-side, passed down as props) and owns the
 * scroll-driven motion as direct DOM mutation. React state is reserved for
 * the rail's active section, since it drives a re-render of the nav
 * highlight (the icon crossfade itself is imperative, like the reveal/vrule
 * animation, since it runs on every scroll tick rather than once).
 */
export default function UnnycStartStoryscroller({ hero, railItems, concepts, movementNow, movement }) {
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
            if (el.hasAttribute('data-reveal')) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
            if (el.hasAttribute('data-vrule')) el.style.transform = 'scaleY(1)';
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
            const nodes = root.querySelectorAll('[data-reveal],[data-vrule]');
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
                if (el.hasAttribute('data-reveal')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(22px)';
                    el.style.transition = `opacity 0.85s ${EASE} ${d}ms, transform 0.85s ${EASE} ${d}ms`;
                }
                if (el.hasAttribute('data-vrule')) {
                    el.style.transition = `transform 2.4s ${EASE} ${d}ms`;
                }
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
        // Re-run for content that mounts late — the map's marker list arrives
        // after its own async atlas fetch, same reason every other
        // storyscroller re-runs setup() on a delay.
        const t1 = setTimeout(() => {
            setup();
            updateRail();
        }, 400);
        const t2 = setTimeout(() => {
            setup();
            updateRail();
        }, 1400);
        const t3 = setTimeout(() => {
            setup();
            updateRail();
        }, 3000);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScroll);
            window.removeEventListener('resize', onScroll);
            io?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="unnyc-start-story" ref={rootRef}>
            <section className="unnyc-start-story__hero">
                <div className="unnyc-container">
                    <div className="unnyc-start-story__hero-inner">
                        <p className="unnyc-start-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-start-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-start-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        {hero.basicsLinkHtml && (
                            <p
                                className="unnyc-start-story__basics-link"
                                data-reveal="1"
                                data-delay="130"
                                dangerouslySetInnerHTML={{ __html: hero.basicsLinkHtml }}
                            />
                        )}
                        <p
                            className="unnyc-start-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                    </div>
                </div>
            </section>

            <section className="unnyc-start-story__movement">
                <div className="unnyc-container">
                    <div className="unnyc-start-story__detail">
                        <aside className="unnyc-start-story__rail">
                            <div className="unnyc-start-story__rail-icon-slot">
                                <RailIcon id="concepts" />
                                <RailIcon id="going-open-source" />
                                <RailIcon id="movement" />
                            </div>
                            <nav aria-label="Sections">
                                <ol className="unnyc-start-story__rail-list">
                                    {railItems.map((r) => (
                                        <li key={r.id}>
                                            <a
                                                href={`#${r.id}`}
                                                className={
                                                    'unnyc-start-story__rail-link' +
                                                    (r.id === active ? ' unnyc-start-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.label}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-start-story__articles">
                            <article id="concepts" data-spy="concepts" className="unnyc-start-story__article">
                                <div className="unnyc-start-story__article-head">
                                    <h2 data-reveal="1" data-delay="60">
                                        {concepts.title}
                                    </h2>
                                    <p
                                        data-reveal="1"
                                        data-delay="120"
                                        dangerouslySetInnerHTML={{ __html: concepts.ledeHtml }}
                                    />
                                </div>
                                <div className="unnyc-start-story__terms">
                                    {concepts.terms.map((t) => (
                                        <a
                                            key={t.slug}
                                            id={t.slug}
                                            href={t.link?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-reveal="1"
                                            data-delay={t.delay}
                                            className="unnyc-start-story__term-card"
                                        >
                                            <h3>{t.term}</h3>
                                            <p className="unnyc-start-story__term-def">{t.def}</p>
                                            <p className="unnyc-start-story__term-nyc">
                                                <span>Why NYC should care</span>
                                                {t.nyc}
                                            </p>
                                            <span className="unnyc-start-story__term-more">
                                                Learn more · {t.link?.label} ↗
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </article>

                            <article
                                id="going-open-source"
                                data-spy="going-open-source"
                                className="unnyc-start-story__article"
                            >
                                <div className="unnyc-start-story__article-head">
                                    <h2 data-reveal="1" data-delay="60">
                                        {movementNow.title}
                                    </h2>
                                    <p
                                        data-reveal="1"
                                        data-delay="120"
                                        dangerouslySetInnerHTML={{ __html: movementNow.ledeHtml }}
                                    />
                                </div>
                                <UnnycWorldMap
                                    markers={movementNow.mapMarkers}
                                    legend={movementNow.mapLegend}
                                    mapSource={movementNow.mapSource}
                                    govoss={movementNow.govoss}
                                    ospos={movementNow.ospos}
                                    ctfg={movementNow.ctfg}
                                />
                            </article>

                            <article id="movement" data-spy="movement" className="unnyc-start-story__article">
                                <div className="unnyc-start-story__article-head unnyc-start-story__article-head--tl">
                                    <h2 data-reveal="1" data-delay="60">
                                        {movement.title}
                                    </h2>
                                </div>
                                <ol className="unnyc-start-story__timeline">
                                    <span className="unnyc-start-story__tl-stem" aria-hidden="true" />
                                    <span
                                        className="unnyc-start-story__tl-stem unnyc-start-story__tl-stem--fill"
                                        data-vrule="1"
                                        data-delay="200"
                                        aria-hidden="true"
                                    />
                                    {movement.timeline.map((e) => {
                                        const CardTag = e.url ? 'a' : 'div';
                                        const cardProps = e.url
                                            ? { href: e.url, target: '_blank', rel: 'noopener noreferrer' }
                                            : {};
                                        return (
                                            <li
                                                key={e.year + e.title}
                                                data-reveal="1"
                                                data-delay={e.delay}
                                                className="unnyc-start-story__tl-item"
                                            >
                                                <span className="unnyc-start-story__tl-year">{e.year}</span>
                                                <span className="unnyc-start-story__tl-dot" aria-hidden="true" />
                                                <CardTag className="unnyc-start-story__tl-card" {...cardProps}>
                                                    <h3>{e.title}</h3>
                                                    <p>{e.desc}</p>
                                                    {e.url && <span className="unnyc-start-story__tl-source">Source ↗</span>}
                                                </CardTag>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/** The sidebar's three crossfading icons, hand-drawn (not <UnnycIcon>, which
 * has no hook for the `data-tico` attribute the rail's crossfade needs) but
 * the SAME Lucide paths UnnycIcon uses for 'book-open', plus a globe and a
 * history/clock, matching the design handoff exactly. All three stack
 * absolutely in the rail's icon slot; only the active one is opaque —
 * `currentColor` (set via the wrapping class's `color`) carries the shared
 * navy stroke, and each icon's one orange accent is set inline so it stays
 * correct regardless of `currentColor`. */
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
        className: 'unnyc-start-story__rail-icon',
        'data-tico': id,
    };
    const accent = { stroke: 'var(--wg-accent-warm)' };
    switch (id) {
        case 'concepts':
            return (
                <svg {...common}>
                    <path d="M12 7v14" />
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    <path d="M6 8h3" style={accent} />
                    <path d="M6 12h3" style={accent} />
                </svg>
            );
        case 'going-open-source':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                    <circle cx="9" cy="8" r="1.6" style={{ fill: 'var(--wg-accent-warm)' }} stroke="none" />
                </svg>
            );
        case 'movement':
            return (
                <svg {...common} style={{ opacity: 0 }}>
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l4 2" style={accent} />
                </svg>
            );
        default:
            return null;
    }
}
