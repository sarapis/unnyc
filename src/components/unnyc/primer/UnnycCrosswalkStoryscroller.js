'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * UnnycCrosswalkStoryscroller — the storyscroller redesign of /crosswalk:
 * a hero, a sticky "Estimated Annual Rent" card beside the intro argument,
 * and the six reasons as a sticky icon-swapping sidebar (Lucide icons,
 * each animating once as its reason becomes active) beside numbered
 * article blocks. Sibling of the /principles storyscroller — same
 * palette, sidebar shape and reveal system, reimplemented against this
 * repo's own content and tokens rather than the prototype's inline
 * styles. See page.js for how the props here are shaped from
 * content/crosswalk.md.
 *
 * Same division as the other two storyscrollers: this component renders
 * the whole page (content read server-side, passed down as props) and
 * owns the scroll-driven motion as direct DOM mutation. React state is
 * reserved for the rail's active reason, since it drives a re-render of
 * the icon and the rail highlight.
 */
export default function UnnycCrosswalkStoryscroller({ hero, rentCard, intro, reasons, foot }) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(reasons[0]?.n ?? 1);
    const activeRef = useRef(active);
    activeRef.current = active;

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const EASE = 'cubic-bezier(0.22,1,0.36,1)';
        const pending = new Set();
        let io;
        let playing = null;
        let playToken = 0;

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

        const hdash = (el, t) => {
            if (!el) return;
            const L = +(el.dataset.len || (el.dataset.len = el.getTotalLength().toFixed(1)));
            el.setAttribute('stroke-dasharray', String(L));
            el.setAttribute('stroke-dashoffset', (L * (1 - t)).toFixed(1));
        };

        /* Per-reason icon diagrams, each driven by one 0..1 progress value —
           same technique as the homepage carousel's per-card SVGs, but on
           the icon's own 1.8s clock rather than scroll progress. */
        const hanim = (svg, p) => {
            const cl = (v) => Math.min(1, Math.max(0, v));
            const seg = (a, b) => cl((p - a) / (b - a));
            const q = (s) => svg.querySelector(s);
            const qa = (s) => svg.querySelectorAll(s);
            switch (svg.dataset.tanim) {
                case '1':
                    hdash(q('[data-d1="ring"]'), seg(0, 0.5));
                    hdash(q('[data-d1="s"]'), seg(0.4, 0.85));
                    hdash(q('[data-d1="bar"]'), seg(0.75, 1));
                    break;
                case '2': {
                    hdash(q('[data-d2="body"]'), seg(0, 0.45));
                    hdash(q('[data-d2="sh"]'), seg(0.35, 0.75));
                    const sw = q('[data-d2="swing"]');
                    if (sw) {
                        const o = seg(0.7, 1);
                        const e = 1 - Math.pow(1 - o, 3);
                        sw.style.transform = `rotate(${(-18 * Math.sin(Math.PI * e)).toFixed(1)}deg)`;
                    }
                    break;
                }
                case '3':
                    hdash(q('[data-d3="s"]'), seg(0, 0.6));
                    hdash(q('[data-d3="c"]'), seg(0.6, 0.95));
                    break;
                case '4':
                    qa('[data-d4="a"]').forEach((el, i) => hdash(el, seg(i * 0.2, 0.45 + i * 0.2)));
                    qa('[data-d4="b"]').forEach((el, i) => hdash(el, seg(0.6 + i * 0.12, 0.88 + i * 0.12)));
                    break;
                case '5': {
                    qa('[data-p5a]').forEach((el, i) => hdash(el, seg(i * 0.09, 0.3 + i * 0.09)));
                    const rot = q('[data-p5-rot]');
                    if (rot) {
                        const o5 = seg(0.6, 1);
                        const e = o5 * o5 * (3 - 2 * o5);
                        rot.style.transform = `rotate(${(120 * e).toFixed(1)}deg)`;
                    }
                    break;
                }
                case '6': {
                    qa('[data-d6="g"]').forEach((el, i) => hdash(el, seg(i * 0.18, 0.45 + i * 0.18)));
                    const dot = q('[data-d6="dot"]');
                    const ring = q('[data-d6="ring"]');
                    if (dot) dot.setAttribute('r', (1.2 * seg(0.78, 0.9)).toFixed(2));
                    if (ring) {
                        const t = seg(0.82, 1);
                        ring.setAttribute('r', (1.2 + 3.5 * t).toFixed(2));
                        ring.setAttribute('opacity', (0.9 * (1 - t)).toFixed(2));
                    }
                    break;
                }
                default:
                    break;
            }
        };

        const playTile = (n) => {
            const svg = root.querySelector(`[data-tanim="${n}"]`);
            if (!svg) return;
            const token = ++playToken;
            if (reduce) {
                hanim(svg, 1);
                return;
            }
            hanim(svg, 0);
            const dur = 1800;
            const t0 = performance.now();
            const tick = (now) => {
                if (token !== playToken) return;
                const p = Math.min(1, (now - t0) / dur);
                hanim(svg, p);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        /* Active reason = the last article whose top has passed the focus
           line (40% of viewport) — tracks in both directions. */
        const updateRail = () => {
            const arts = root.querySelectorAll('[data-spy]');
            if (!arts.length) return;
            const focus = window.innerHeight * 0.4;
            let cur = arts[0];
            arts.forEach((a) => {
                if (a.getBoundingClientRect().top <= focus) cur = a;
            });
            const n = Number(cur.dataset.n);
            root.querySelectorAll('[data-tanim]').forEach((svg) => {
                svg.style.opacity = Number(svg.dataset.tanim) === n ? '1' : '0';
            });
            if (n !== activeRef.current) setActive(n);
            if (n !== playing) {
                playing = n;
                playTile(n);
            }
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
        <div className="unnyc-cw-story" ref={rootRef}>
            <section className="unnyc-cw-story__hero">
                <div className="unnyc-container">
                    <div className="unnyc-cw-story__hero-inner">
                        <p className="unnyc-cw-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-cw-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-cw-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        <p
                            className="unnyc-cw-story__lede"
                            data-reveal="1"
                            data-delay="160"
                            dangerouslySetInnerHTML={{ __html: hero.ledeHtml }}
                        />
                    </div>
                </div>
            </section>

            <section className="unnyc-cw-story__bill">
                <div className="unnyc-container unnyc-cw-story__bill-grid">
                    {rentCard && <RentCard card={rentCard} />}
                    <div
                        className="unnyc-cw-story__intro"
                        data-reveal="1"
                        dangerouslySetInnerHTML={{ __html: intro }}
                    />
                </div>
            </section>

            <section className="unnyc-cw-story__reasons">
                <div className="unnyc-container">
                    <div className="unnyc-cw-story__detail">
                        <aside className="unnyc-cw-story__rail">
                            <div className="unnyc-cw-story__rail-icon-slot">
                                {reasons.map((r) => (
                                    <ReasonIconAnim key={r.n} n={r.n} />
                                ))}
                            </div>
                            <nav aria-label="The six reasons">
                                <ol className="unnyc-cw-story__rail-list">
                                    {reasons.map((r) => (
                                        <li key={r.n}>
                                            <a
                                                href={`#${r.id}`}
                                                className={
                                                    'unnyc-cw-story__rail-link' +
                                                    (r.n === active ? ' unnyc-cw-story__rail-link--active' : '')
                                                }
                                            >
                                                {r.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="unnyc-cw-story__articles">
                            {reasons.map((r) => (
                                <article key={r.n} id={r.id} data-spy="1" data-n={r.n} className="unnyc-cw-story__article">
                                    <div className="unnyc-cw-story__article-n-row" data-reveal="1">
                                        <span className="unnyc-cw-story__article-n">{String(r.n).padStart(2, '0')}</span>
                                        <span className="unnyc-cw-story__article-rule" />
                                    </div>
                                    <h2 className="unnyc-cw-story__article-title" data-reveal="1" data-delay="60">
                                        {r.title}
                                    </h2>
                                    <div
                                        className="unnyc-cw-story__article-prose"
                                        data-reveal="1"
                                        data-delay="120"
                                        dangerouslySetInnerHTML={{ __html: r.html }}
                                    />
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="unnyc-cw-story__foot">
                <div className="unnyc-container">
                    <div className="unnyc-cw-story__foot-ctas" data-reveal="1">
                        {foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function RentCard({ card }) {
    const amounts = card.vendors.map((v) => parseFloat(v.amount.replace(/[^0-9.]/g, '')) || 0);
    const max = Math.max(...amounts);
    // Matches the design's fixed per-vendor layout for exactly these three
    // vendors — Microsoft's three stacked full bars aren't a ratio of
    // anything; Axon/Geotab each get one bar at a design-set width. A
    // vendor beyond these three falls back to a single bar scaled against
    // the largest amount. Same table as the homepage storyscroller's.
    const barsByIndex = [[100, 100, 100], [79], [53]];
    return (
        <div className="unnyc-cw-story__rent" data-reveal="1" data-sticky="1">
            <p className="unnyc-cw-story__rent-title">{card.title}</p>
            <div className="unnyc-cw-story__rent-rows">
                {card.vendors.map((v, i) => {
                    const bars = barsByIndex[i] || [max ? (amounts[i] / max) * 100 : 0];
                    return (
                        <div key={v.name}>
                            <div className="unnyc-cw-story__rent-row">
                                <span>{v.name}</span>
                                <span>{v.amount}</span>
                            </div>
                            <div className="unnyc-cw-story__rent-bars">
                                {bars.map((pct, j) => (
                                    <div key={j} className="unnyc-cw-story__rent-bar-track">
                                        <div
                                            className="unnyc-cw-story__rent-bar"
                                            data-bar="1"
                                            data-delay={80 + (i * 3 + j) * 60}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <div className="unnyc-cw-story__rent-total">
                    <span>Total</span>
                    <span>{card.total}</span>
                </div>
            </div>
            {card.sourceUrl && (
                <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="unnyc-cw-story__rent-source"
                >
                    {card.sourceLabel}
                </a>
            )}
        </div>
    );
}

/** One reason's icon, hand-drawn (not <UnnycIcon>, which has no hook for
 * per-segment data-attributes) but the SAME Lucide paths UnnycIcon uses for
 * these six names, so the two stay visually identical. All six stack
 * absolutely in the rail's icon slot; only the active one is opaque. */
function ReasonIconAnim({ n }) {
    const common = {
        viewBox: '0 0 24 24',
        width: 56,
        height: 56,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.75,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        className: 'unnyc-cw-story__rail-icon',
        'data-tanim': n,
    };
    switch (n) {
        case 1:
            return (
                <svg {...common}>
                    <circle data-d1="ring" cx="12" cy="12" r="10" />
                    <path data-d1="s" d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path data-d1="bar" d="M12 18V6" />
                </svg>
            );
        case 2:
            return (
                <svg {...common}>
                    <rect data-d2="body" width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <g data-d2="swing" style={{ transformOrigin: '7px 11px' }}>
                        <path data-d2="sh" d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </g>
                </svg>
            );
        case 3:
            return (
                <svg {...common}>
                    <path
                        data-d3="s"
                        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    />
                    <path data-d3="c" d="m9 12 2 2 4-4" />
                </svg>
            );
        case 4:
            return (
                <svg {...common}>
                    <circle data-d4="a" cx="9" cy="7" r="4" />
                    <path data-d4="a" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <path data-d4="b" d="M16 3.128a4 4 0 0 1 0 7.744" />
                    <path data-d4="b" d="M22 21v-2a4 4 0 0 0-3-3.87" />
                </svg>
            );
        case 5:
            return (
                <svg {...common}>
                    <g data-p5-rot="1" style={{ transformOrigin: '12px 12px' }}>
                        <path data-p5a="1" d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                        <path data-p5a="1" d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                        <path data-p5a="1" d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                        <path data-p5a="1" d="m14 16-3 3 3 3" />
                        <path data-p5a="1" d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                        <path data-p5a="1" d="m13.378 9.633 4.096 1.098 1.097-4.096" />
                    </g>
                </svg>
            );
        case 6:
            return (
                <svg {...common}>
                    <circle data-d6="g" cx="12" cy="12" r="10" />
                    <path data-d6="g" d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path data-d6="g" d="M2 12h20" />
                    <circle data-d6="ring" cx="8.6" cy="8.4" r="0" stroke="var(--wg-accent-warm)" strokeWidth="0.6" opacity="0" />
                    <circle data-d6="dot" cx="8.6" cy="8.4" r="0" fill="var(--wg-accent-warm)" stroke="none" />
                </svg>
            );
        default:
            return null;
    }
}
