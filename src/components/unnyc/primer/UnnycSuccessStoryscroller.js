'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * UnnycSuccessStoryscroller — the storyscroller redesign of /success ("A
 * Roadmap for NYC to Follow"): a hero with a dashed "New York City — Next"
 * card standing in for a case study NYC hasn't written yet, Barcelona /
 * Munich / Paris as full narrative cases beside a sticky icon-crossfading
 * rail, and a "Recent Successes" focus carousel (arrows, dots, autoplay,
 * wrap-around). Sibling of the other storyscrollers — same palette,
 * sidebar shape and reveal system. See page.js for how the props here are
 * shaped from content/success.md.
 *
 * Same division as the other three: this component renders the whole page
 * (content read server-side, passed down as props) and owns the
 * scroll-driven motion as direct DOM mutation. React state is reserved for
 * the rail's active section and the carousel's focused index, since both
 * drive a re-render (the rail highlight/icon, the dots).
 */
export default function UnnycSuccessStoryscroller({ hero, railItems, cases, caseGrid }) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(cases[0]?.id);
    const activeRef = useRef(active);
    activeRef.current = active;

    const casesById = useMemo(() => Object.fromEntries(cases.map((c) => [c.id, c])), [cases]);
    const casesKicker = railItems.find((r) => r.id === 'cases')?.label ?? 'Recent Successes';

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
            if (el.hasAttribute('data-bar')) el.style.transform = 'scaleX(1)';
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
            const nodes = root.querySelectorAll('[data-reveal],[data-bar]');
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
                if (el.hasAttribute('data-bar')) {
                    el.style.transition = `transform 1.1s ${EASE} ${d}ms`;
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

        /* Active section = the last of the three case articles whose top has
           passed the focus line (40% of viewport) — "Recent Successes" has no
           article of its own, so it's reachable only via the rail's own link,
           never through scroll-spy, matching the source design. */
        const updateRail = () => {
            const arts = root.querySelectorAll('[data-spy]');
            if (!arts.length) return;
            const focus = window.innerHeight * 0.4;
            let cur = arts[0];
            arts.forEach((a) => {
                if (a.getBoundingClientRect().top <= focus) cur = a;
            });
            const id = cur.id;
            root.querySelectorAll('[data-tico]').forEach((el) => {
                el.style.opacity = el.dataset.tico === id ? '1' : '0';
            });
            if (id !== activeRef.current) setActive(id);
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
        <div className="unnyc-success-story" ref={rootRef}>
            <section className="unnyc-success-story__hero">
                <div className="unnyc-container unnyc-success-story__hero-grid">
                    <div className="unnyc-success-story__hero-copy">
                        <p className="unnyc-success-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-success-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-success-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        <p
                            className="unnyc-success-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                    </div>

                    <Link
                        href="/campaign"
                        className="unnyc-success-story__nyc-card"
                        data-reveal="1"
                        data-delay="240"
                    >
                        <span className="unnyc-success-story__nyc-rule-track" aria-hidden="true" />
                        <span
                            className="unnyc-success-story__nyc-rule"
                            data-bar="1"
                            data-delay="300"
                            aria-hidden="true"
                        />
                        <span className="unnyc-success-story__nyc-circle" aria-hidden="true">
                            ?
                        </span>
                        <span className="unnyc-success-story__nyc-label">{hero.nycLabel}</span>
                        <span className="unnyc-success-story__nyc-sublabel">{hero.nycSublabel}</span>
                    </Link>
                </div>
            </section>

            <section className="unnyc-success-story__cities">
                <div className="unnyc-container">
                    <div className="unnyc-success-story__detail">
                        <aside className="unnyc-success-story__rail">
                            <div className="unnyc-success-story__rail-icon-slot">
                                {railItems.map((r) => (
                                    <RailIcon
                                        key={r.id}
                                        id={r.id}
                                        src={casesById[r.id]?.bannerSrc}
                                        defaultActive={r.id === cases[0]?.id}
                                    />
                                ))}
                            </div>
                            <nav aria-label="Sections">
                                <ol className="unnyc-success-story__rail-list">
                                    {railItems.map((r) => (
                                        <li key={r.id}>
                                            <a
                                                href={`#${r.id}`}
                                                className={
                                                    'unnyc-success-story__rail-link' +
                                                    (r.id === active ? ' unnyc-success-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.label}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-success-story__articles">
                            {cases.map((c) => (
                                <article key={c.id} id={c.id} data-spy="1" className="unnyc-success-story__case">
                                    <div className="unnyc-success-story__case-banner" data-reveal="1">
                                        {c.bannerSrc && (
                                            <Image
                                                src={c.bannerSrc}
                                                alt={c.bannerAlt || ''}
                                                fill
                                                sizes="(max-width: 900px) 100vw, 900px"
                                                priority={c.priority}
                                                className="unnyc-success-story__case-banner-img"
                                            />
                                        )}
                                        <div className="unnyc-success-story__case-banner-scrim" aria-hidden="true" />
                                        <h2 className="unnyc-success-story__case-banner-title">{c.title}</h2>
                                    </div>

                                    <div
                                        className="unnyc-success-story__case-prose"
                                        data-reveal="1"
                                        data-delay="80"
                                        dangerouslySetInnerHTML={{ __html: c.beforeHtml }}
                                    />

                                    {c.stats?.length > 0 && (
                                        <div className="unnyc-success-story__stats">
                                            {c.stats.map((s, j) => (
                                                <div
                                                    key={s.label}
                                                    className="unnyc-success-story__stat"
                                                    data-reveal="1"
                                                    data-delay={60 + j * 100}
                                                >
                                                    <span className="unnyc-success-story__stat-number">{s.number}</span>
                                                    <span
                                                        className="unnyc-success-story__stat-rule"
                                                        data-bar="1"
                                                        data-delay={200 + j * 100}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="unnyc-success-story__stat-label">{s.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {c.afterHtml && (
                                        <div
                                            className="unnyc-success-story__case-prose"
                                            data-reveal="1"
                                            dangerouslySetInnerHTML={{ __html: c.afterHtml }}
                                        />
                                    )}

                                    {c.sourcesHtml && (
                                        <p className="unnyc-success-story__sources" data-reveal="1">
                                            <span className="unnyc-success-story__sources-label">Sources</span>
                                            <span dangerouslySetInnerHTML={{ __html: c.sourcesHtml }} />
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="cases" className="unnyc-success-story__recent">
                <div className="unnyc-container">
                    <div className="unnyc-success-story__recent-intro">
                        <p className="unnyc-success-story__kicker unnyc-success-story__kicker--alt" data-reveal="1">
                            {casesKicker}
                        </p>
                        <h2 className="unnyc-success-story__recent-title" data-reveal="1" data-delay="60">
                            {caseGrid.title}
                        </h2>
                        <p className="unnyc-success-story__recent-lede" data-reveal="1" data-delay="120">
                            {caseGrid.lede}
                        </p>
                    </div>

                    <CaseCarousel items={caseGrid.items} />
                </div>
            </section>
        </div>
    );
}

/** One rail entry's icon: the three cities crossfade their own photo,
 * "Recent Successes" gets a hand-drawn globe (no photo of its own). All
 * four stack absolutely in the rail's icon slot; only the active one is
 * opaque. `defaultActive` only sets the FIRST paint, before the scroll-spy
 * effect above attaches — it's a fixed value (first case's id), not the
 * live `active` state, so it never changes across renders and can't fight
 * the effect's own `el.style.opacity` writes on `[data-tico]` afterward
 * (same division as UnnycCrosswalkStoryscroller's ReasonIconAnim, which
 * carries no active-driven prop at all). */
function RailIcon({ id, src, defaultActive }) {
    if (id === 'cases') {
        return (
            <svg
                data-tico={id}
                className="unnyc-success-story__rail-icon unnyc-success-story__rail-icon--globe"
                viewBox="0 0 24 24"
                width="56"
                height="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ opacity: defaultActive ? 1 : 0 }}
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
            </svg>
        );
    }
    if (!src) return null;
    return (
        <span
            data-tico={id}
            className="unnyc-success-story__rail-icon"
            style={{ opacity: defaultActive ? 1 : 0 }}
        >
            <Image src={src} alt="" fill sizes="56px" className="unnyc-success-story__rail-icon-img" />
        </span>
    );
}

/** The "Recent Successes" focus carousel: a triple-duplicated card list
 * (so there's always a neighbour to snap past on either side), one card
 * centred and in focus at a time, arrows/dots to step it directly, and a
 * 5s autoplay that pauses on hover/focus and stops off-screen or under
 * reduced motion. Stepping past either end slides onto an outer copy, then
 * silently re-centers on the matching card in the middle copy 640ms later
 * — the same wrap-then-jump the source design uses, so the loop never
 * shows a seam. */
function CaseCarousel({ items }) {
    const N = items.length;
    const tripled = useMemo(
        () =>
            [...items, ...items, ...items].map((c, i) => ({
                ...c,
                key: `${c.place}-${i}`,
                hidden: i < N || i >= 2 * N,
            })),
        [items, N],
    );

    const [cidx, setCidx] = useState(0);
    const cidxRef = useRef(0);
    cidxRef.current = cidx;
    const cbusyRef = useRef(false);
    const cjumpRef = useRef(false);
    const cpausedRef = useRef(false);
    const cwaitRef = useRef(0);
    const wrapTimerRef = useRef(null);
    const trackRef = useRef(null);
    const viewportRef = useRef(null);
    const cardsRef = useRef([]);

    const stepCase = useCallback(
        (dir) => {
            if (cbusyRef.current) return;
            const next = cidxRef.current + dir;
            cwaitRef.current = 0;
            if (next < 0 || next >= N) {
                cbusyRef.current = true;
                clearTimeout(wrapTimerRef.current);
                setCidx(next);
                wrapTimerRef.current = setTimeout(() => {
                    cjumpRef.current = true;
                    cbusyRef.current = false;
                    setCidx(((next % N) + N) % N);
                }, 640);
                return;
            }
            setCidx(next);
        },
        [N],
    );

    const goCase = useCallback((i) => {
        if (cbusyRef.current) return;
        cwaitRef.current = 0;
        setCidx(i);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        const vp = viewportRef.current;
        const cards = cardsRef.current;
        if (!track || !vp || cards.length < 3 * N) return;
        const i = Math.max(0, Math.min(cards.length - 1, N + cidx));
        const c = cards[i];
        if (!c) return;
        const x = c.offsetLeft + c.offsetWidth / 2 - vp.clientWidth / 2;
        if (cjumpRef.current) {
            cjumpRef.current = false;
            track.style.transition = 'none';
            track.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`;
            void track.offsetWidth; // flush so the no-transition jump is committed before re-enabling
            track.style.transition = '';
        } else {
            track.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`;
        }
        cards.forEach((el, k) => {
            if (!el) return;
            const d = Math.min(2, Math.abs(k - i));
            el.style.transform = d === 0 ? 'scale(1)' : 'scale(0.94)';
            el.style.opacity = d === 0 ? '1' : d === 1 ? '0.55' : '0.3';
            el.style.borderColor = d === 0 ? 'var(--wg-accent-warm-light)' : 'var(--wg-warm-gray)';
            el.style.boxShadow = d === 0 ? 'var(--wg-shadow-lg)' : 'none';
        });
    }, [cidx, N]);

    useEffect(() => {
        let raf = requestAnimationFrame(tick);
        let last = performance.now();
        function tick(now) {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(0.1, (now - last) / 1000);
            last = now;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const vp = viewportRef.current;
            const rect = vp?.getBoundingClientRect();
            const onScreen = rect && rect.bottom > 0 && rect.top < window.innerHeight;
            if (cpausedRef.current || reduce || !onScreen || cbusyRef.current) return;
            cwaitRef.current += dt;
            if (cwaitRef.current >= 5) {
                cwaitRef.current = 0;
                stepCase(1);
            }
        }
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(wrapTimerRef.current);
        };
    }, [stepCase]);

    const pause = () => {
        cpausedRef.current = true;
    };
    const resume = () => {
        cpausedRef.current = false;
        cwaitRef.current = 0;
    };
    const activeDot = ((cidx % N) + N) % N;

    return (
        <div
            className="unnyc-success-story__carousel"
            data-reveal="1"
            data-delay="160"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocus={pause}
            onBlur={resume}
        >
            <button
                type="button"
                className="unnyc-success-story__carousel-arrow unnyc-success-story__carousel-arrow--prev"
                onClick={() => stepCase(-1)}
                aria-label="Previous case study"
            >
                ←
            </button>
            <button
                type="button"
                className="unnyc-success-story__carousel-arrow unnyc-success-story__carousel-arrow--next"
                onClick={() => stepCase(1)}
                aria-label="Next case study"
            >
                →
            </button>

            <div className="unnyc-success-story__carousel-viewport" ref={viewportRef}>
                <div className="unnyc-success-story__carousel-track" ref={trackRef}>
                    {tripled.map((c, i) => (
                        <CaseCard
                            key={c.key}
                            item={c}
                            hidden={c.hidden}
                            cardRef={(el) => {
                                cardsRef.current[i] = el;
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="unnyc-success-story__carousel-dots">
                {items.map((c, i) => (
                    <button
                        key={c.place}
                        type="button"
                        className={
                            'unnyc-success-story__carousel-dot' +
                            (i === activeDot ? ' unnyc-success-story__carousel-dot--active' : '')
                        }
                        onClick={() => goCase(i)}
                        aria-label={`Show ${c.place}`}
                    />
                ))}
            </div>
        </div>
    );
}

function CaseCard({ item, hidden, cardRef }) {
    const { place, image, logo, headline, body, lesson, link } = item;
    return (
        <article ref={cardRef} aria-hidden={hidden ? 'true' : undefined} className="unnyc-success-story__carousel-card">
            <div
                className={
                    'unnyc-success-story__carousel-card-media' +
                    (logo ? ' unnyc-success-story__carousel-card-media--logo' : '')
                }
            >
                <Image src={image} alt="" fill sizes="340px" className="unnyc-success-story__carousel-card-img" />
                {!logo && <div className="unnyc-success-story__carousel-card-scrim" aria-hidden="true" />}
                <span className="unnyc-success-story__carousel-card-place">{place}</span>
            </div>
            <div className="unnyc-success-story__carousel-card-body">
                <h3 className="unnyc-success-story__carousel-card-headline">{headline}</h3>
                <p className="unnyc-success-story__carousel-card-text">{body}</p>
                <p className="unnyc-success-story__carousel-card-lesson">
                    <span className="unnyc-success-story__carousel-card-lesson-label">Lesson for NYC</span>
                    {lesson}
                </p>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={hidden ? -1 : undefined}
                    className="unnyc-success-story__carousel-card-link"
                >
                    Learn more →
                </a>
            </div>
        </article>
    );
}
