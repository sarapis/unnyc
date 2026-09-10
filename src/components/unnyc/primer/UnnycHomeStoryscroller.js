'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * UnnycHomeStoryscroller — the storyscroller redesign of the homepage: a
 * dark, photo-backed narrative (Manhattan map hero, global-movement stats,
 * the UN principles as two horizontal branch diagrams, a pinned horizontal
 * carousel of six reasons, a case-study timeline, the open letter, an
 * audience chooser). Reimplements a Claude Design handoff against this
 * repo's own content/tokens — see page.js for how the props here are
 * shaped from content/home.md, content/crosswalk.md, content/success.md
 * and content/sign.md.
 *
 * Same division as UnnycPrinciplesStoryscroller: this component renders the
 * WHOLE page (content is read server-side and passed down as props) and
 * owns all the scroll-driven motion as direct DOM mutation — reveal-in,
 * draw-in, rule/bar fills, count-up numbers, and the pinned horizontal
 * carousel's scroll-bound translate + per-card SVG progress. React state is
 * reserved for the audience chooser, the only thing that actually needs a
 * re-render.
 *
 * THE WORLD MAP IS A PLACEHOLDER. The prototype fetched a full world
 * basemap from a CDN at runtime (D3 + topojson); this site does not do
 * runtime network fetches for content that has to render reliably, and
 * there is no local full-world outline asset in this repo — only 13
 * individual country polygons (content/govoss-countries.geo.json), not a
 * world to place them against. Left as a clearly-labelled placeholder
 * pending a real local basemap asset, per direct instruction.
 */
export default function UnnycHomeStoryscroller({
    hero,
    movement,
    principles,
    nyc,
    cases,
    openLetter,
    takeAction,
}) {
    const rootRef = useRef(null);
    const trackRef = useRef(null);

    const [audience, setAudience] = useState(takeAction.audiences[0]?.id);
    const activeAudience = takeAction.audiences.find((a) => a.id === audience) || takeAction.audiences[0];

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
            if (el.hasAttribute('data-draw')) el.style.strokeDashoffset = '0';
            if (el.hasAttribute('data-rule') || el.hasAttribute('data-bar')) el.style.transform = 'scaleX(1)';
            if (el.hasAttribute('data-count')) {
                const target = Number(el.dataset.count);
                const fmt = (n) => n.toLocaleString('en-US');
                if (reduce) {
                    el.textContent = fmt(target);
                    return;
                }
                const dur = 1400;
                const t0 = performance.now();
                const d = Number(el.dataset.delay || 0);
                el.textContent = '0';
                const tick = (now) => {
                    const p = Math.max(0, Math.min(1, (now - t0 - d) / dur));
                    const e = 1 - Math.pow(1 - p, 3);
                    el.textContent = fmt(Math.round(target * e));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
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
            const nodes = root.querySelectorAll('[data-reveal],[data-draw],[data-rule],[data-bar],[data-count]');
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
                    const svgish = el.namespaceURI === 'http://www.w3.org/2000/svg';
                    el.style.transform = svgish ? 'none' : 'translateY(26px)';
                    el.style.transition = `opacity 0.85s ${EASE} ${d}ms, transform 0.85s ${EASE} ${d}ms`;
                }
                if (el.hasAttribute('data-draw')) {
                    const len = el.getTotalLength ? el.getTotalLength() : 0;
                    const dur = Number(el.dataset.dur || 1100);
                    el.style.strokeDasharray = String(len);
                    el.style.strokeDashoffset = String(len);
                    el.style.transition = `stroke-dashoffset ${dur}ms ${EASE} ${d}ms`;
                }
                if (el.hasAttribute('data-rule') || el.hasAttribute('data-bar')) {
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

        /* Scroll-bound horizontal carousel: the six reason cards translate
           across while the section is pinned, so vertical scroll reads as
           sideways motion. Travel is measured against the PINNED element's
           own height, not the viewport — a sticky child taller than the
           viewport unsticks early. */
        let hlastY;
        let hdir = 1;
        const cardProgress = new Map();

        const hdash = (el, t) => {
            if (!el) return;
            const L = +(el.dataset.len || (el.dataset.len = el.getTotalLength().toFixed(1)));
            el.setAttribute('stroke-dasharray', String(L));
            el.setAttribute('stroke-dashoffset', (L * (1 - t)).toFixed(1));
        };

        /* Per-card diagrams. Each reads one progress value 0..1 so it stays
           in step with scroll rather than running on its own clock. */
        const hanim = (svg, p) => {
            const cl = (v) => Math.min(1, Math.max(0, v));
            const seg = (a, b) => cl((p - a) / (b - a));
            const q = (s) => svg.querySelector(s);
            const qa = (s) => svg.querySelectorAll(s);
            switch (svg.dataset.anim) {
                case '1': {
                    const bills = qa('[data-c1b]');
                    bills.forEach((g, i) => {
                        const t = cl((p - i * 0.17) / 0.34);
                        const e = 1 - Math.pow(1 - t, 3);
                        const dx = +(g.dataset.x || 0);
                        const rot = +(g.dataset.r || 0);
                        g.style.transform = `translate(${(dx * (1 - e)).toFixed(1)}px, ${(-150 * (1 - e)).toFixed(1)}px) rotate(${(rot * (1 - e)).toFixed(2)}deg)`;
                        g.style.transformOrigin = '150px 96px';
                        g.style.opacity = cl(t * 3).toFixed(2);
                    });
                    break;
                }
                case '2': {
                    hdash(q('[data-p2="body"]'), seg(0, 0.3));
                    qa('[data-p2="hole"]').forEach((h, i) => hdash(h, seg(0.2 + i * 0.08, 0.42 + i * 0.08)));
                    const sh = q('[data-p2="sh"]');
                    if (sh) {
                        const o = seg(0.45, 0.95);
                        const e = 1 - Math.pow(1 - o, 3);
                        sh.style.transform = `rotate(${(-52 * e).toFixed(1)}deg)`;
                        hdash(sh, seg(0.1, 0.42));
                    }
                    break;
                }
                case '3': {
                    hdash(q('[data-p3="s"]'), seg(0, 0.5));
                    const scan = q('[data-p3="scan"]');
                    const sc = seg(0.2, 0.72);
                    if (scan) {
                        scan.style.transform = `translateY(${(sc * 116).toFixed(1)}px)`;
                        scan.setAttribute('opacity', (Math.sin(Math.PI * sc) * 0.9).toFixed(2));
                    }
                    hdash(q('[data-p3="c"]'), seg(0.66, 0.92));
                    break;
                }
                case '4': {
                    qa('[data-p4="base"]').forEach((b, i) => hdash(b, seg(i * 0.1, 0.24 + i * 0.1)));
                    const lid = q('[data-p4="lid"]');
                    if (lid) {
                        const o4 = seg(0.24, 0.85);
                        const e4 = 1 - Math.pow(1 - o4, 3);
                        lid.style.transform = `perspective(520px) rotateX(${(-88 * (1 - e4)).toFixed(1)}deg)`;
                    }
                    qa('[data-p4f]').forEach((el, i) => hdash(el, seg(0.74 + i * 0.09, 0.94 + i * 0.09)));
                    break;
                }
                case '5': {
                    qa('[data-p5a]').forEach((el, i) => hdash(el, seg(0.05 + i * 0.16, 0.34 + i * 0.16)));
                    const rot = q('[data-p5="rot"]');
                    if (rot) {
                        const o5 = seg(0.4, 1);
                        const e = o5 * o5 * (3 - 2 * o5);
                        rot.style.transform = `rotate(${(240 * e).toFixed(1)}deg)`;
                    }
                    break;
                }
                case '6': {
                    qa('[data-p6a]').forEach((a, i) => hdash(a, seg(0.12 + i * 0.1, 0.5 + i * 0.1)));
                    qa('[data-p6d]').forEach((d, i) => d.setAttribute('opacity', seg(0.4 + i * 0.1, 0.56 + i * 0.1).toFixed(2)));
                    qa('[data-p6r]').forEach((r, i) => {
                        const t = seg(0.35 + i * 0.18, 0.85 + i * 0.18);
                        r.setAttribute('r', (t * 46).toFixed(1));
                        r.setAttribute('opacity', (0.6 * (1 - t)).toFixed(2));
                    });
                    break;
                }
                default:
                    break;
            }
        };

        const hcarousel = () => {
            const sec = root.querySelector('[data-hcarousel]');
            const track = trackRef.current;
            if (!sec || !track) return;
            const stick = sec.querySelector('[data-hstick]') || sec.firstElementChild;
            const total = sec.offsetHeight - (stick ? stick.offsetHeight : window.innerHeight);
            if (total <= 0) return;
            const cards = track.querySelectorAll('[data-hcard]');
            const cardW = cards.length ? cards[0].offsetWidth : 340;
            const side = Math.max(24, (window.innerWidth - cardW) / 2);
            if (track.dataset.side !== String(side)) {
                track.dataset.side = String(side);
                track.style.paddingLeft = `${side}px`;
                track.style.paddingRight = `${side}px`;
            }
            const y = window.scrollY || window.pageYOffset;
            if (hlastY !== undefined && y !== hlastY) hdir = y > hlastY ? 1 : -1;
            hlastY = y;
            const raw = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / total));
            const p = Math.min(1, Math.max(0, (raw - 0.07) / 0.86));
            const last = cards[cards.length - 1];
            const max = last ? Math.max(0, last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2) : 0;
            track.style.transform = `translate3d(${-(p * max).toFixed(1)}px, 0, 0)`;
            const bar = root.querySelector('[data-hprogress]');
            if (bar) bar.style.width = `${(raw * 100).toFixed(2)}%`;
            const mid = window.innerWidth / 2;
            cards.forEach((c, i) => {
                const r = c.getBoundingClientRect();
                const d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / (cardW * 1.25));
                c.style.transform = `scale(${(1.1 - 0.18 * d).toFixed(3)})`;
                c.style.opacity = (1 - 0.45 * d).toFixed(3);
                c.style.borderColor = d < 0.35 ? 'var(--card-focus-border)' : 'var(--card-border)';
                const svg = c.querySelector('[data-anim]');
                if (svg) {
                    const entry = Math.min(1, Math.max(0, raw / 0.07));
                    const now = Math.min(entry, Math.min(1, Math.max(0, (1 - d - 0.38) / 0.62)));
                    const t = hdir < 0 ? now : Math.max(cardProgress.get(i) || 0, now);
                    cardProgress.set(i, t);
                    hanim(svg, t);
                }
            });
        };

        let raf1 = requestAnimationFrame(() => {
            raf1 = requestAnimationFrame(() => {
                setup();
                hcarousel();
            });
        });

        let scrollRaf = 0;
        const onScroll = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = 0;
                sweep();
                hcarousel();
            });
        };
        const onResize = () => {
            sweep();
            hcarousel();
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onScroll);
        window.addEventListener('resize', onResize);
        const t1 = setTimeout(() => {
            setup();
            hcarousel();
        }, 400);
        const t2 = setTimeout(() => {
            setup();
            hcarousel();
        }, 1400);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScroll);
            window.removeEventListener('resize', onResize);
            io?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="unnyc-home-story" ref={rootRef}>
            <section className="unnyc-home-story__hero">
                <div className="unnyc-home-story__hero-screen">
                    <div className="unnyc-container">
                        <div className="unnyc-home-story__hero-inner">
                        <p className="unnyc-home-story__kicker" data-reveal="1">
                            {hero.kicker}
                            <i aria-hidden="true" className="unnyc-home-story__kicker-rule" />
                        </p>
                        <h1
                            className="unnyc-home-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.h1Html }}
                        />
                        <div className="unnyc-home-story__map" data-reveal="1" data-delay="150">
                            <ManhattanMap />
                        </div>
                        <div className="unnyc-home-story__scroll-cue">
                            Scroll <span>↓</span>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="unnyc-home-story__hero-screen">
                    <div className="unnyc-container">
                        <div className="unnyc-home-story__hero-inner">
                        <h2 className="unnyc-home-story__h2" data-reveal="1" data-delay="210">
                            {hero.h2Lines.map((line, i) => (
                                <span key={i}>{line}</span>
                            ))}
                        </h2>
                        <div data-reveal="1" data-delay="340" className="unnyc-home-story__hero-cta">
                            <Link href={hero.cta.href} className="unnyc-btn unnyc-btn--primary">
                                {hero.cta.label}
                            </Link>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="unnyc-home-story__section">
                <div className="unnyc-container">
                    <div className="unnyc-home-story__cols">
                        <div>
                            <p className="unnyc-home-story__eyebrow" data-reveal="1">
                                {movement.kicker}
                            </p>
                            <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                                {movement.headline}
                            </h2>
                            <p className="unnyc-home-story__lede" data-reveal="1" data-delay="140">
                                {movement.lede}
                            </p>
                            <Link
                                href={movement.href}
                                className="unnyc-btn unnyc-btn--primary"
                                data-reveal="1"
                                data-delay="220"
                            >
                                {movement.linkLabel} <span>→</span>
                            </Link>
                        </div>
                        <div className="unnyc-home-story__stats">
                            {movement.stats.map((s, i) => (
                                <Stat key={s.label} value={s.value} label={s.label} delay={i * 140} />
                            ))}
                        </div>
                    </div>
                    <div className="unnyc-home-story__map-placeholder" data-reveal="1" data-delay="120">
                        <p>World map — coming soon</p>
                        <span>A country-by-country view of public code catalogues and OSPOs.</span>
                    </div>
                </div>
            </section>

            <section className="unnyc-home-story__section">
                <div className="unnyc-container">
                    <div className="unnyc-home-story__cols unnyc-home-story__cols--reverse">
                        <div data-reveal="1" data-delay="60" className="unnyc-home-story__sdg">
                            <img src="/images/home/SDGs01.png" alt="The UN Sustainable Development Goals" />
                            <Link href="/principles#endorsing-organizations" className="unnyc-home-story__sdg-stat">
                                <Stat value={principles.stats?.[0]?.value} label={`${principles.stats?.[0]?.label} →`} />
                            </Link>
                        </div>
                        <div>
                            <p className="unnyc-home-story__eyebrow" data-reveal="1">
                                {principles.kicker}
                            </p>
                            <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                                {principles.headline}
                            </h2>
                            <p className="unnyc-home-story__lede" data-reveal="1" data-delay="140">
                                {principles.lede}
                            </p>
                            <Link
                                href={principles.href}
                                className="unnyc-btn unnyc-btn--primary"
                                data-reveal="1"
                                data-delay="200"
                            >
                                {principles.linkLabel} <span>→</span>
                            </Link>
                        </div>
                    </div>
                    {principles.groups.map((g, i) => (
                        <BranchDiagram key={g.label} group={g} num={i === 0 ? '01' : '02'} />
                    ))}
                </div>
            </section>

            <section className="unnyc-home-story__section unnyc-home-story__section--nyc">
                <div className="unnyc-container">
                    <div className="unnyc-home-story__cols">
                        <div>
                            <p className="unnyc-home-story__eyebrow" data-reveal="1">
                                {nyc.kicker}
                            </p>
                            <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                                {nyc.headline}
                            </h2>
                            <p className="unnyc-home-story__lede" data-reveal="1" data-delay="140">
                                {nyc.lede}
                            </p>
                            <Link
                                href={nyc.href}
                                className="unnyc-btn unnyc-btn--primary"
                                data-reveal="1"
                                data-delay="200"
                            >
                                {nyc.linkLabel} <span>→</span>
                            </Link>
                        </div>
                        {nyc.rentCard && <RentCard card={nyc.rentCard} />}
                    </div>
                </div>
                <HorizontalCarousel reasons={nyc.reasons} trackRef={trackRef} />
            </section>

            <section className="unnyc-home-story__section">
                <div className="unnyc-container">
                    <p className="unnyc-home-story__eyebrow" data-reveal="1">
                        {cases.kicker}
                    </p>
                    <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                        {cases.headline}
                    </h2>
                    <p className="unnyc-home-story__lede unnyc-home-story__lede--wide" data-reveal="1" data-delay="140">
                        {cases.lede}
                    </p>
                    <div className="unnyc-home-story__timeline">
                        <div className="unnyc-home-story__timeline-track" />
                        <div
                            className="unnyc-home-story__timeline-track unnyc-home-story__timeline-track--fill"
                            data-rule="1"
                            data-delay="60"
                        />
                        <div className="unnyc-home-story__timeline-cols">
                            {cases.items.map((c, i) => (
                                <div key={c.id} className="unnyc-home-story__case" data-reveal="1" data-delay={240 + i * 160}>
                                    <img src={c.image} alt={c.alt} />
                                    <p className="unnyc-home-story__case-name">{c.name}</p>
                                    <p className="unnyc-home-story__case-sub">{c.subtitle}</p>
                                </div>
                            ))}
                            <div className="unnyc-home-story__case" data-reveal="1" data-delay={240 + cases.items.length * 160}>
                                <div className="unnyc-home-story__case-next">?</div>
                                <p className="unnyc-home-story__case-name">New York City</p>
                                <p className="unnyc-home-story__case-sub unnyc-home-story__case-sub--next">Next</p>
                            </div>
                        </div>
                    </div>
                    <Link href={cases.href} className="unnyc-btn unnyc-btn--primary" data-reveal="1" data-delay="120">
                        {cases.linkLabel} <span>→</span>
                    </Link>
                </div>
            </section>

            <section className="unnyc-home-story__section">
                <div className="unnyc-container unnyc-home-story__letter">
                    <div>
                        <p className="unnyc-home-story__eyebrow" data-reveal="1">
                            {openLetter.kicker}
                        </p>
                        <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                            {openLetter.headline}
                        </h2>
                        <div
                            className="unnyc-home-story__ask"
                            data-reveal="1"
                            data-delay="140"
                            dangerouslySetInnerHTML={{ __html: openLetter.askHtml }}
                        />
                    </div>
                    <div className="unnyc-home-story__signature" data-reveal="1" data-delay="160">
                        <p className="unnyc-home-story__signature-kicker">Respectfully</p>
                        <p className="unnyc-home-story__signature-from">{openLetter.signatureLabel}</p>
                        <SignatureMark />
                        {openLetter.signatureCount != null && (
                            <div className="unnyc-home-story__signature-count">
                                <Stat value={openLetter.signatureCount} label={openLetter.signatureCountLabel} inline />
                            </div>
                        )}
                        <Link href={openLetter.ctaHref} className="unnyc-btn unnyc-btn--primary">
                            {openLetter.ctaLabel}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="unnyc-home-story__section">
                <div className="unnyc-container unnyc-home-story__take-action">
                    <p className="unnyc-home-story__eyebrow" data-reveal="1">
                        Take Action
                    </p>
                    <h2 className="unnyc-home-story__h3" data-reveal="1" data-delay="80">
                        {takeAction.title}
                    </h2>
                    <div className="unnyc-home-story__audiences" data-reveal="1" data-delay="140">
                        {takeAction.audiences.map((a) => (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => setAudience(a.id)}
                                className={
                                    'unnyc-home-story__audience' +
                                    (a.id === audience ? ' unnyc-home-story__audience--active' : '')
                                }
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                    <div className="unnyc-home-story__actions">
                        {activeAudience?.actions.map((act) => (
                            <Link key={act.href} href={act.href} className="unnyc-home-story__action">
                                <span className="unnyc-home-story__action-kicker">{act.kicker}</span>
                                <span className="unnyc-home-story__action-title">{act.title}</span>
                                <span className="unnyc-home-story__action-desc">{act.desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ value, label, delay = 0, inline }) {
    if (value == null) return null;
    return (
        <div className={inline ? 'unnyc-home-story__stat unnyc-home-story__stat--inline' : 'unnyc-home-story__stat'}>
            <div className="unnyc-home-story__stat-row">
                <span className="unnyc-home-story__stat-value" data-reveal="1" data-count={value} data-delay={delay}>
                    {value}
                </span>
            </div>
            {!inline && <div className="unnyc-home-story__stat-rule" data-rule="1" data-delay={delay + 40} />}
            <p className="unnyc-home-story__stat-label">{label}</p>
        </div>
    );
}

/** The six reasons, pinned and scrolled through sideways. Card SVGs are
 * decorative art (falling bills / padlock / shield-scan / treasure chest /
 * compass / network) — geometry is fixed, driven purely by scroll progress
 * via the `hanim()` switch in the effect above; only the title text is
 * data. */
function HorizontalCarousel({ reasons, trackRef }) {
    return (
        <div className="unnyc-home-story__hcarousel" data-hcarousel="1">
            <div className="unnyc-home-story__hstick" data-hstick="1">
                <div className="unnyc-home-story__htrack" data-htrack="1" ref={trackRef}>
                    {reasons.map((title, i) => (
                        <div key={title} className="unnyc-home-story__hcard" data-hcard="1">
                            <div className="unnyc-home-story__hcard-art">
                                <ReasonSvg index={i + 1} />
                            </div>
                            <div>
                                <span className="unnyc-home-story__hcard-n">{String(i + 1).padStart(2, '0')}</span>
                                <span className="unnyc-home-story__hcard-title">{title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="unnyc-home-story__hprogress-wrap">
                <div className="unnyc-home-story__hprogress-track">
                    <div className="unnyc-home-story__hprogress" data-hprogress="1" />
                </div>
            </div>
        </div>
    );
}

/** Per-vendor bar counts/widths, by position — matches the design's fixed
 * layout for exactly these three vendors (Microsoft's three stacked full
 * bars aren't a ratio of anything; Axon/Geotab each get one bar at a
 * design-set width). A vendor beyond these three falls back to a single
 * bar scaled against the largest amount, so the card degrades sensibly
 * rather than breaking if the list ever changes. */
const RENT_BARS = [[100, 100, 100], [79], [53]];

function RentCard({ card }) {
    const amounts = card.vendors.map((v) => parseFloat(v.amount.replace(/[^0-9.]/g, '')) || 0);
    const max = Math.max(...amounts);
    return (
        <div className="unnyc-home-story__rent" data-reveal="1">
            <p className="unnyc-home-story__rent-title">{card.title}</p>
            <div className="unnyc-home-story__rent-rows">
                {card.vendors.map((v, i) => {
                    const bars = RENT_BARS[i] || [max ? (amounts[i] / max) * 100 : 0];
                    return (
                        <div key={v.name}>
                            <div className="unnyc-home-story__rent-row">
                                <span>{v.name}</span>
                                <span>{v.amount}</span>
                            </div>
                            <div className="unnyc-home-story__rent-bars">
                                {bars.map((pct, j) => (
                                    <div key={j} className="unnyc-home-story__rent-bar-track">
                                        <div
                                            className="unnyc-home-story__rent-bar"
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
                <div className="unnyc-home-story__rent-total">
                    <span>Total</span>
                    <span>{card.total}</span>
                </div>
            </div>
            {card.sourceUrl && (
                <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer" className="unnyc-home-story__rent-source">
                    {card.sourceLabel}
                </a>
            )}
        </div>
    );
}

/** One horizontal branch diagram (Software Principles / Community
 * Principles): a lead principle with a trunk running to three children.
 * Curve geometry is fixed decorative layout (same shape both groups share,
 * per the design) — only the numbers/titles are data. */
function BranchDiagram({ group }) {
    const children = group.items;
    const ys = [48, 122, 196];
    return (
        <div className="unnyc-home-story__branch">
            <div className="unnyc-home-story__branch-head" data-reveal="1">
                <h3>{group.label}</h3>
                <span />
            </div>
            <svg viewBox="0 0 900 250" className="unnyc-home-story__branch-svg" aria-label={group.label}>
                <text data-reveal="1" x="0" y="86" className="unnyc-home-story__branch-n">
                    {String(group.lead.n).padStart(2, '0')}
                </text>
                <text data-reveal="1" data-delay="60" x="0" y="122" className="unnyc-home-story__branch-title">
                    {group.lead.title}.
                </text>
                <path
                    data-draw="1"
                    data-delay="120"
                    data-dur="700"
                    d="M0 186 H 392"
                    className="unnyc-home-story__branch-trunk"
                />
                <path
                    data-draw="1"
                    data-delay="820"
                    data-dur="450"
                    d="M392 186 C 432 186 434 122 468 122"
                    className="unnyc-home-story__branch-trunk"
                />
                {children.map((c, i) => (
                    <g key={c.n}>
                        <path
                            data-draw="1"
                            data-delay={1270}
                            data-dur="620"
                            d={`M468 122 C 500 122 500 ${ys[i]} 516 ${ys[i]}`}
                            className="unnyc-home-story__branch-link"
                        />
                        <circle data-reveal="1" data-delay="1890" cx="521" cy={ys[i]} r="4.5" className="unnyc-home-story__branch-dot" />
                        <text data-reveal="1" data-delay="1970" x="536" y={ys[i] - 6} className="unnyc-home-story__branch-cn">
                            {String(c.n).padStart(2, '0')}
                        </text>
                        <text data-reveal="1" data-delay="1970" x="568" y={ys[i]} className="unnyc-home-story__branch-ctitle">
                            {c.title}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

/** Simplified street map with UN Headquarters and NYC City Hall marked —
 * decorative art, verbatim geometry (island clip path + rotated street
 * grid) reused from the design handoff. */
function ManhattanMap() {
    return (
        <svg viewBox="0 0 300 440" className="unnyc-home-story__map-svg" aria-label="Simplified street map with UN Headquarters and NYC City Hall marked">
            <defs>
                <radialGradient id="unnycMapFade" gradientUnits="userSpaceOnUse" cx="150" cy="220" r="300">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="70%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <mask id="unnycMapMask">
                    <rect x="-700" y="-700" width="1900" height="1700" fill="url(#unnycMapFade)" />
                </mask>
                <clipPath id="unnycIsland">
                    <path d="M215.1 22.0 L215.3 23.2 L217.8 22.4 L222.0 23.9 L221.5 28.4 L224.1 32.3 L225.9 31.8 L226.0 30.4 L224.4 26.8 L227.9 28.6 L227.3 30.0 L228.4 31.2 L232.2 28.9 L239.0 30.9 L240.8 32.3 L242.2 36.0 L238.6 46.8 L236.3 50.8 L233.9 52.3 L233.9 54.3 L226.8 64.1 L223.7 60.9 L222.8 63.2 L224.8 66.1 L222.0 69.0 L222.1 71.1 L209.5 94.4 L200.7 116.8 L202.6 157.2 L201.7 174.1 L210.7 193.1 L210.3 204.8 L208.7 207.6 L199.2 215.4 L192.4 228.5 L186.7 232.7 L185.6 236.8 L188.7 248.8 L187.2 252.1 L159.7 289.7 L138.1 323.6 L137.1 339.0 L133.9 337.7 L133.8 340.1 L135.6 349.1 L138.8 353.7 L138.8 357.9 L135.4 377.1 L129.4 394.0 L127.4 395.6 L122.2 396.2 L122.3 397.1 L110.6 398.6 L109.6 396.8 L95.2 399.5 L88.6 403.7 L88.2 405.3 L89.6 406.9 L88.1 408.2 L84.9 406.5 L84.1 407.2 L85.7 410.0 L83.7 407.6 L74.8 414.8 L71.8 415.8 L71.8 417.1 L67.7 418.0 L64.9 417.2 L60.8 411.7 L60.8 409.7 L59.3 409.8 L57.8 405.5 L59.8 401.6 L58.6 401.1 L60.4 391.5 L62.4 391.9 L62.9 389.1 L60.9 388.6 L62.3 377.4 L68.2 378.1 L68.7 375.0 L62.8 373.5 L68.6 373.6 L68.7 372.4 L64.1 370.9 L69.3 371.0 L70.8 361.2 L64.9 360.2 L65.0 359.2 L71.0 359.9 L71.3 356.0 L66.2 355.4 L66.8 350.5 L71.7 351.0 L72.0 345.3 L66.9 344.6 L72.1 344.6 L73.0 331.5 L70.9 331.3 L71.3 328.0 L74.3 328.2 L74.4 326.9 L70.1 325.7 L74.4 326.3 L75.2 323.2 L70.0 321.8 L70.2 320.8 L75.5 320.9 L75.8 318.7 L70.7 317.3 L70.9 316.3 L74.5 316.8 L74.7 315.5 L71.0 315.0 L71.2 314.0 L74.9 314.5 L75.1 313.2 L71.3 312.7 L71.5 311.7 L75.2 312.2 L75.4 310.8 L71.7 310.3 L71.8 309.4 L73.7 309.7 L75.2 306.5 L72.7 304.3 L75.3 305.8 L77.7 297.7 L82.4 289.8 L78.8 286.8 L79.5 285.2 L82.9 287.0 L86.6 281.5 L82.9 279.4 L86.8 281.1 L88.0 279.0 L84.2 276.9 L88.2 278.6 L88.9 277.3 L85.6 274.6 L90.7 277.3 L92.0 275.5 L86.7 272.6 L87.1 271.8 L92.5 274.7 L93.5 272.5 L88.0 269.4 L93.8 271.8 L95.0 269.7 L89.5 266.6 L95.4 269.0 L96.6 266.8 L91.0 263.8 L95.5 265.4 L96.4 263.9 L92.2 261.5 L92.7 260.7 L96.8 263.0 L99.1 258.9 L95.5 256.9 L99.4 258.3 L100.2 255.5 L97.2 253.5 L100.8 255.5 L106.8 245.6 L152.5 158.2 L161.8 144.6 L159.0 142.6 L162.9 134.9 L164.5 133.1 L166.7 134.2 L167.5 133.2 L173.3 122.2 L181.8 97.4 L180.2 83.2 L189.0 75.1 L205.0 44.5 L205.8 36.5 L209.1 29.3 Z" />
                </clipPath>
            </defs>
            <path
                d="M215.1 22.0 L215.3 23.2 L217.8 22.4 L222.0 23.9 L221.5 28.4 L224.1 32.3 L225.9 31.8 L226.0 30.4 L224.4 26.8 L227.9 28.6 L227.3 30.0 L228.4 31.2 L232.2 28.9 L239.0 30.9 L240.8 32.3 L242.2 36.0 L238.6 46.8 L236.3 50.8 L233.9 52.3 L233.9 54.3 L226.8 64.1 L223.7 60.9 L222.8 63.2 L224.8 66.1 L222.0 69.0 L222.1 71.1 L209.5 94.4 L200.7 116.8 L202.6 157.2 L201.7 174.1 L210.7 193.1 L210.3 204.8 L208.7 207.6 L199.2 215.4 L192.4 228.5 L186.7 232.7 L185.6 236.8 L188.7 248.8 L187.2 252.1 L159.7 289.7 L138.1 323.6 L137.1 339.0 L133.9 337.7 L133.8 340.1 L135.6 349.1 L138.8 353.7 L138.8 357.9 L135.4 377.1 L129.4 394.0 L127.4 395.6 L122.2 396.2 L122.3 397.1 L110.6 398.6 L109.6 396.8 L95.2 399.5 L88.6 403.7 L88.2 405.3 L89.6 406.9 L88.1 408.2 L84.9 406.5 L84.1 407.2 L85.7 410.0 L83.7 407.6 L74.8 414.8 L71.8 415.8 L71.8 417.1 L67.7 418.0 L64.9 417.2 L60.8 411.7 L60.8 409.7 L59.3 409.8 L57.8 405.5 L59.8 401.6 L58.6 401.1 L60.4 391.5 L62.4 391.9 L62.9 389.1 L60.9 388.6 L62.3 377.4 L68.2 378.1 L68.7 375.0 L62.8 373.5 L68.6 373.6 L68.7 372.4 L64.1 370.9 L69.3 371.0 L70.8 361.2 L64.9 360.2 L65.0 359.2 L71.0 359.9 L71.3 356.0 L66.2 355.4 L66.8 350.5 L71.7 351.0 L72.0 345.3 L66.9 344.6 L72.1 344.6 L73.0 331.5 L70.9 331.3 L71.3 328.0 L74.3 328.2 L74.4 326.9 L70.1 325.7 L74.4 326.3 L75.2 323.2 L70.0 321.8 L70.2 320.8 L75.5 320.9 L75.8 318.7 L70.7 317.3 L70.9 316.3 L74.5 316.8 L74.7 315.5 L71.0 315.0 L71.2 314.0 L74.9 314.5 L75.1 313.2 L71.3 312.7 L71.5 311.7 L75.2 312.2 L75.4 310.8 L71.7 310.3 L71.8 309.4 L73.7 309.7 L75.2 306.5 L72.7 304.3 L75.3 305.8 L77.7 297.7 L82.4 289.8 L78.8 286.8 L79.5 285.2 L82.9 287.0 L86.6 281.5 L82.9 279.4 L86.8 281.1 L88.0 279.0 L84.2 276.9 L88.2 278.6 L88.9 277.3 L85.6 274.6 L90.7 277.3 L92.0 275.5 L86.7 272.6 L87.1 271.8 L92.5 274.7 L93.5 272.5 L88.0 269.4 L93.8 271.8 L95.0 269.7 L89.5 266.6 L95.4 269.0 L96.6 266.8 L91.0 263.8 L95.5 265.4 L96.4 263.9 L92.2 261.5 L92.7 260.7 L96.8 263.0 L99.1 258.9 L95.5 256.9 L99.4 258.3 L100.2 255.5 L97.2 253.5 L100.8 255.5 L106.8 245.6 L152.5 158.2 L161.8 144.6 L159.0 142.6 L162.9 134.9 L164.5 133.1 L166.7 134.2 L167.5 133.2 L173.3 122.2 L181.8 97.4 L180.2 83.2 L189.0 75.1 L205.0 44.5 L205.8 36.5 L209.1 29.3 Z"
                className="unnyc-home-story__map-island"
            />
            <g mask="url(#unnycMapMask)" clipPath="url(#unnycIsland)" fill="none" className="unnyc-home-story__map-grid">
                <g transform="rotate(29 150 220)">
                    <path
                        d="M-240 -240 L700 -240 M-240 -229 L700 -229 M-240 -218 L700 -218 M-240 -207 L700 -207 M-240 -196 L700 -196 M-240 -185 L700 -185 M-240 -174 L700 -174 M-240 -163 L700 -163 M-240 -152 L700 -152 M-240 -141 L700 -141 M-240 -130 L700 -130 M-240 -119 L700 -119 M-240 -108 L700 -108 M-240 -97 L700 -97 M-240 -86 L700 -86 M-240 -75 L700 -75 M-240 -64 L700 -64 M-240 -53 L700 -53 M-240 -42 L700 -42 M-240 -31 L700 -31 M-240 -20 L700 -20 M-240 -9 L700 -9 M-240 2 L700 2 M-240 13 L700 13 M-240 24 L700 24 M-240 35 L700 35 M-240 46 L700 46 M-240 57 L700 57 M-240 68 L700 68 M-240 79 L700 79 M-240 90 L700 90 M-240 101 L700 101 M-240 112 L700 112 M-240 123 L700 123 M-240 134 L700 134 M-240 145 L700 145 M-240 156 L700 156 M-240 167 L700 167 M-240 178 L700 178 M-240 189 L700 189 M-240 200 L700 200 M-240 211 L700 211 M-240 222 L700 222 M-240 233 L700 233 M-240 244 L700 244 M-240 255 L700 255 M-240 266 L700 266 M-240 277 L700 277 M-240 288 L700 288 M-240 299 L700 299 M-240 310 L700 310 M-240 321 L700 321 M-240 332 L700 332 M-240 343 L700 343 M-240 354 L700 354 M-240 365 L700 365 M-240 376 L700 376 M-240 387 L700 387 M-240 398 L700 398 M-240 409 L700 409 M-240 420 L700 420 M-240 431 L700 431 M-240 442 L700 442 M-240 453 L700 453 M-240 464 L700 464 M-240 475 L700 475"
                        strokeWidth="0.6"
                        opacity="0.42"
                    />
                    <path
                        d="M-240 -240 L-240 480 M-224 -240 L-224 480 M-208 -240 L-208 480 M-192 -240 L-192 480 M-176 -240 L-176 480 M-160 -240 L-160 480 M-144 -240 L-144 480 M-128 -240 L-128 480 M-112 -240 L-112 480 M-96 -240 L-96 480 M-80 -240 L-80 480 M-64 -240 L-64 480 M-48 -240 L-48 480 M-32 -240 L-32 480 M-16 -240 L-16 480 M0 -240 L0 480 M16 -240 L16 480 M32 -240 L32 480 M48 -240 L48 480 M64 -240 L64 480 M80 -240 L80 480 M96 -240 L96 480 M112 -240 L112 480 M128 -240 L128 480 M144 -240 L144 480 M160 -240 L160 480 M176 -240 L176 480 M192 -240 L192 480 M208 -240 L208 480 M224 -240 L224 480 M240 -240 L240 480 M256 -240 L256 480 M272 -240 L272 480 M288 -240 L288 480 M304 -240 L304 480 M320 -240 L320 480 M336 -240 L336 480 M352 -240 L352 480 M368 -240 L368 480 M384 -240 L384 480 M400 -240 L400 480 M416 -240 L416 480 M432 -240 L432 480 M448 -240 L448 480 M464 -240 L464 480 M480 -240 L480 480 M496 -240 L496 480 M512 -240 L512 480 M528 -240 L528 480 M544 -240 L544 480 M560 -240 L560 480 M576 -240 L576 480 M592 -240 L592 480 M608 -240 L608 480 M624 -240 L624 480 M640 -240 L640 480 M656 -240 L656 480 M672 -240 L672 480 M688 -240 L688 480"
                        strokeWidth="0.9"
                        opacity="0.68"
                    />
                    <path d="M-240 0 L700 0 M-240 224 L700 224" strokeWidth="1.6" opacity="0.8" />
                    <path d="M144 -240 L144 480 M336 -240 L336 480" strokeWidth="1.7" opacity="0.82" />
                </g>
            </g>
            <path d="M144.7 309.8 L80.4 390.5" fill="none" className="unnyc-home-story__map-connector" strokeDasharray="4 5" />
            <g fontSize="13" fontWeight="700" letterSpacing="1.3">
                <circle cx="144.7" cy="309.8" r="18" fill="none" className="unnyc-home-story__map-un-ring" />
                <circle cx="144.7" cy="309.8" r="6" className="unnyc-home-story__map-un-dot" />
                <path d="M163 309.8 L192 309.8" className="unnyc-home-story__map-connector" fill="none" />
                <text x="198" y="314" className="unnyc-home-story__map-un-label">UN HEADQUARTERS</text>
                <circle cx="80.4" cy="390.5" r="5.5" fill="none" className="unnyc-home-story__map-cityhall-ring" />
                <path d="M74.9 390.5 L46 390.5" className="unnyc-home-story__map-connector" fill="none" />
                <text x="40" y="394.5" textAnchor="end" className="unnyc-home-story__map-cityhall-label">NYC CITY HALL</text>
            </g>
        </svg>
    );
}

function SignatureMark() {
    return (
        <svg viewBox="0 0 380 120" className="unnyc-home-story__signature-svg" aria-label="Signature">
            <path
                data-draw="1"
                data-delay="240"
                data-dur="900"
                d="M14 96 C 70 96 300 96 366 96"
                className="unnyc-home-story__signature-line"
            />
            <path
                data-draw="1"
                data-delay="420"
                data-dur="1200"
                d="M28 84 C 40 30 52 18 62 26 C 72 34 58 76 66 82 C 74 88 92 44 104 30 C 116 16 122 24 118 44 C 114 64 106 78 116 80 C 128 82 140 42 156 30 C 168 21 174 32 168 50 C 162 68 158 78 168 80 C 182 82 198 46 214 34 C 228 24 234 34 228 52 C 222 70 220 80 232 80 C 252 80 268 52 288 40 C 302 32 312 40 306 56 C 302 68 296 76 306 80 C 318 84 336 74 352 58"
                className="unnyc-home-story__signature-scribble"
            />
        </svg>
    );
}

/** One of the six per-card decorative animations, indexed 1-6 to match the
 * six crosswalk reasons in order. Geometry is fixed art; `hanim()` in the
 * effect above drives it purely by scroll progress. */
function ReasonSvg({ index }) {
    switch (index) {
        case 1:
            return (
                <svg data-anim="1" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <g data-c1b="1" data-x="5" data-r="-2"><path d="M 50.0 89.0 L 120.0 55.0 L 250.0 105.0 L 180.0 139.0 Z" className="unnyc-home-story__hcard-fill" /></g>
                    <g data-c1b="1" data-x="-6" data-r="2.2"><path d="M 50.0 77.0 L 120.0 43.0 L 250.0 93.0 L 180.0 127.0 Z" className="unnyc-home-story__hcard-fill" /></g>
                    <g data-c1b="1" data-x="4" data-r="-1.6"><path d="M 50.0 65.0 L 120.0 31.0 L 250.0 81.0 L 180.0 115.0 Z" className="unnyc-home-story__hcard-fill" /></g>
                    <g data-c1b="1" data-x="-5" data-r="2.6">
                        <path d="M 50.0 53.0 L 120.0 19.0 L 250.0 69.0 L 180.0 103.0 Z" className="unnyc-home-story__hcard-fill" />
                        <path d="M 64.0 54.1 L 124.2 24.9 L 236.0 67.9 L 175.8 97.1 Z" fill="none" className="unnyc-home-story__hcard-fill-line" />
                        <ellipse cx="150" cy="61" rx="27" ry="15" fill="none" className="unnyc-home-story__hcard-warm" transform="rotate(21 150 61)" />
                        <text x="150" y="68" textAnchor="middle" className="unnyc-home-story__hcard-warm-text" transform="rotate(21 150 61)">$</text>
                    </g>
                </svg>
            );
        case 2:
            return (
                <svg data-anim="2" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <path data-p2="sh" d="M126 84V64a24 24 0 0 1 48 0v20" fill="none" className="unnyc-home-story__hcard-warm-stroke" style={{ transformOrigin: '126px 84px' }} />
                    <rect data-p2="body" x="108" y="84" width="84" height="64" rx="11" className="unnyc-home-story__hcard-fill" />
                    <circle data-p2="hole" cx="150" cy="108" r="8" fill="none" className="unnyc-home-story__hcard-fill-line" />
                    <path data-p2="hole" d="M147 115h6l2 15h-10z" fill="none" className="unnyc-home-story__hcard-fill-line" />
                </svg>
            );
        case 3:
            return (
                <svg data-anim="3" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <path data-p3="s" d="M150 12 208 34v42c0 40-26 62-58 74-32-12-58-34-58-74V34z" className="unnyc-home-story__hcard-fill" />
                    <rect data-p3="scan" x="94" y="18" width="112" height="2" rx="1" className="unnyc-home-story__hcard-warm-fill" />
                    <path data-p3="c" d="M126 82l16 17 32-35" fill="none" className="unnyc-home-story__hcard-warm-stroke-thick" />
                </svg>
            );
        case 4:
            return (
                <svg data-anim="4" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <g data-p4="lid" style={{ transformOrigin: '150px 130px' }}>
                        <rect x="86" y="48" width="128" height="82" rx="5" className="unnyc-home-story__hcard-fill" />
                        <rect x="94" y="56" width="112" height="66" rx="3" fill="none" className="unnyc-home-story__hcard-fill-line" />
                        <circle data-p4f="1" cx="150" cy="80" r="12" fill="none" className="unnyc-home-story__hcard-warm-stroke" />
                        <path data-p4f="1" d="M129 118a21 21 0 0 1 42 0" fill="none" className="unnyc-home-story__hcard-warm-stroke" />
                    </g>
                    <rect data-p4="base" x="84" y="130" width="132" height="9" rx="3" className="unnyc-home-story__hcard-fill" />
                    <path data-p4="base" d="M84 139h132l10 9H74z" className="unnyc-home-story__hcard-fill" />
                </svg>
            );
        case 5:
            return (
                <svg data-anim="5" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <g data-p5="rot" style={{ transformOrigin: '150px 85px' }}>
                        <path data-p5a="1" d="M 156.4 22.1 L 202.6 102.0 L 182.3 93.3 M 202.6 102.0 L 205.1 80.2" fill="none" className="unnyc-home-story__hcard-warm-stroke-thick" />
                        <path data-p5a="1" d="M 201.3 122.0 L 109.0 122.0 L 126.6 108.8 M 109.0 122.0 L 126.6 135.2" fill="none" className="unnyc-home-story__hcard-warm-stroke-thick" />
                        <path data-p5a="1" d="M 92.3 110.9 L 138.5 31.0 L 141.1 52.8 M 138.5 31.0 L 118.2 39.7" fill="none" className="unnyc-home-story__hcard-warm-stroke-thick" />
                    </g>
                </svg>
            );
        case 6:
            return (
                <svg data-anim="6" viewBox="0 0 300 170" width="100%" height="100%" aria-hidden="true">
                    <circle cx="150" cy="78" r="60" fill="none" className="unnyc-home-story__hcard-globe" />
                    <ellipse cx="150" cy="78" rx="60" ry="21" fill="none" className="unnyc-home-story__hcard-globe" />
                    <ellipse cx="150" cy="78" rx="25" ry="60" fill="none" className="unnyc-home-story__hcard-globe" />
                    <line x1="90" y1="78" x2="210" y2="78" className="unnyc-home-story__hcard-globe" />
                    <circle data-p6r="1" cx="118" cy="54" r="0" fill="none" className="unnyc-home-story__hcard-warm-stroke" />
                    <circle data-p6r="1" cx="118" cy="54" r="0" fill="none" className="unnyc-home-story__hcard-warm-stroke" />
                    <circle data-p6r="1" cx="118" cy="54" r="0" fill="none" className="unnyc-home-story__hcard-warm-stroke" />
                    <path data-p6a="1" d="M118 54Q145 24 172 50" fill="none" className="unnyc-home-story__hcard-warm-light-stroke" />
                    <path data-p6a="1" d="M118 54Q172 44 196 86" fill="none" className="unnyc-home-story__hcard-warm-light-stroke" />
                    <path data-p6a="1" d="M118 54Q120 96 140 116" fill="none" className="unnyc-home-story__hcard-warm-light-stroke" />
                    <path data-p6a="1" d="M118 54Q94 76 104 100" fill="none" className="unnyc-home-story__hcard-warm-light-stroke" />
                    <path data-p6a="1" d="M118 54Q150 76 168 112" fill="none" className="unnyc-home-story__hcard-warm-light-stroke" />
                    <circle data-p6d="1" cx="172" cy="50" r="4" className="unnyc-home-story__hcard-dot" opacity="0" />
                    <circle data-p6d="1" cx="196" cy="86" r="4" className="unnyc-home-story__hcard-dot" opacity="0" />
                    <circle data-p6d="1" cx="140" cy="116" r="4" className="unnyc-home-story__hcard-dot" opacity="0" />
                    <circle data-p6d="1" cx="104" cy="100" r="4" className="unnyc-home-story__hcard-dot" opacity="0" />
                    <circle data-p6d="1" cx="168" cy="112" r="4" className="unnyc-home-story__hcard-dot" opacity="0" />
                    <circle cx="118" cy="54" r="5" className="unnyc-home-story__hcard-warm-fill" />
                </svg>
            );
        default:
            return null;
    }
}
