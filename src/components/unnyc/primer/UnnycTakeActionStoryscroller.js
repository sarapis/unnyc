'use client';

import { useEffect, useRef } from 'react';
import CampaignSignForm from '@/components/unnyc/CampaignSignForm';

/**
 * UnnycTakeActionStoryscroller — the storyscroller redesign of
 * /campaign/sign ("Take Action · An open letter"): a letter-page hero (the
 * To/From/Re block), the open letter as prose on the left, and a sticky
 * "Add your name" card on the right holding the existing CampaignSignForm.
 * No sidebar rail — this page is a letter, not a topic tour. Sibling of the
 * /start, /principles, /crosswalk, /success and /resources storyscrollers —
 * same palette and reveal system, reimplemented here against this page's
 * own content. See page.js for how the props here are shaped from
 * content/sign.md, content/principles.md, and the fetched endorsements.
 *
 * CampaignSignForm itself is untouched — this component only wraps it in a
 * sticky card and restyles its `.unnyc-cmp-form__*` classes via sign.css,
 * scoped under this component's own root class so /campaign/endorse's
 * EndorseForm (same class names) is unaffected.
 */
export default function UnnycTakeActionStoryscroller({ hero, letter, sign, wall }) {
    const rootRef = useRef(null);
    const asideRef = useRef(null);

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

        const wireOne = (el, index) => {
            if (el.dataset.wired) return;
            el.dataset.wired = '1';
            const d = Number(el.dataset.delay || (index % 2) * 40);
            el.style.opacity = '0';
            el.style.transform = 'translateY(22px)';
            el.style.transition = `opacity 0.85s ${EASE} ${d}ms, transform 0.85s ${EASE} ${d}ms`;
            if (reduce) {
                play(el);
                return;
            }
            pending.add(el);
            io.observe(el);
        };

        const setup = () => {
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

            // The letter's prose blocks arrive as one HTML string per markdown
            // block (dangerouslySetInnerHTML) — there is no per-paragraph node
            // to hang data-reveal on ahead of time. Tag each top-level child
            // the first time we see one of these containers, then wire them
            // exactly like any other data-reveal element below.
            root.querySelectorAll('[data-reveal-children]').forEach((container) => {
                if (container.dataset.childrenTagged) return;
                container.dataset.childrenTagged = '1';
                [...container.children].forEach((child, i) => {
                    child.setAttribute('data-reveal', '1');
                    child.setAttribute('data-delay', String((i % 2) * 40));
                });
            });

            root.querySelectorAll('[data-reveal]').forEach(wireOne);
            sweep();
        };

        let raf1 = requestAnimationFrame(() => {
            raf1 = requestAnimationFrame(setup);
        });

        let scrollRaf = 0;
        const onScroll = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = 0;
                sweep();
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onScroll);
        const t1 = setTimeout(setup, 400);
        const t2 = setTimeout(setup, 1400);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScroll);
            io?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* The sign card sits in a sticky column beside a letter that is usually
       much taller than it, so a fixed `top` is normally enough — CSS handles
       that case alone. The one thing CSS can't do is the rare short-viewport
       case where the card ITSELF is taller than the window (e.g. an error
       message showing on a small laptop): a fixed top could then pin the
       card so its own submit button never scrolls into view. A
       ResizeObserver on the card — which fires on a tab switch, an error, or
       the success panel, not just a window resize — lets `top` shrink so the
       whole card stays reachable. Desktop-only; sign.css forces `static`
       below 900px regardless of this inline style. */
    useEffect(() => {
        const aside = asideRef.current;
        if (!aside) return undefined;

        const recompute = () => {
            const top = Math.min(96, Math.max(24, window.innerHeight - aside.offsetHeight - 24));
            aside.style.top = `${top}px`;
        };

        recompute();
        const ro = new ResizeObserver(recompute);
        ro.observe(aside);
        window.addEventListener('resize', recompute);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', recompute);
        };
    }, []);

    return (
        <div className="unnyc-take-action-story" ref={rootRef}>
            <section className="unnyc-take-action-story__hero">
                <div className="unnyc-container">
                    <div className="unnyc-take-action-story__hero-inner">
                        <p className="unnyc-take-action-story__kicker" data-reveal="1">
                            <i aria-hidden="true" className="unnyc-take-action-story__kicker-rule" />
                            {hero.kicker}
                        </p>
                        <h1
                            className="unnyc-take-action-story__h1"
                            data-reveal="1"
                            data-delay="90"
                            dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                        />
                        {hero.tally && (
                            <p className="unnyc-take-action-story__tally" aria-live="polite" data-reveal="1" data-delay="120">
                                Signed by <strong>{hero.tally.individuals}</strong> individual
                                {hero.tally.individuals === 1 ? '' : 's'} and{' '}
                                <strong>{hero.tally.organizations}</strong> organization
                                {hero.tally.organizations === 1 ? '' : 's'}
                            </p>
                        )}
                        <dl className="unnyc-take-action-story__addressed" data-reveal="1" data-delay="160">
                            {hero.addressed.map((row) => (
                                <div key={row.label}>
                                    <dt>{row.label}</dt>
                                    <dd>{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <section className="unnyc-take-action-story__main">
                <div className="unnyc-container">
                    <div className="unnyc-take-action-story__layout">
                        <article className="unnyc-take-action-story__letter">
                            {letter.chunks.map((c, i) => (
                                <div key={i}>
                                    {c.label && (
                                        <h2 data-reveal="1">{c.label}</h2>
                                    )}
                                    <div data-reveal-children="1" dangerouslySetInnerHTML={{ __html: c.before }} />
                                    {c.after !== null && (
                                        <>
                                            <ol className="unnyc-take-action-story__principles" data-reveal="1">
                                                {letter.principles.map((p, j) => (
                                                    <li key={j}>
                                                        <strong>{p.title}</strong> —{' '}
                                                        {p.desc.charAt(0).toLowerCase() + p.desc.slice(1)}.
                                                    </li>
                                                ))}
                                            </ol>
                                            <div data-reveal-children="1" dangerouslySetInnerHTML={{ __html: c.after }} />
                                        </>
                                    )}
                                </div>
                            ))}

                            {/* MUST be a flow container, not a <p> — see the note this
                                page's predecessor left about signoff.html arriving
                                already wrapped in its own <p>. */}
                            <div
                                data-reveal="1"
                                className="unnyc-take-action-story__signoff"
                                dangerouslySetInnerHTML={{ __html: letter.signoffHtml }}
                            />

                            <div className="unnyc-take-action-story__refs" data-reveal="1">
                                <p className="unnyc-take-action-story__refs-label">{letter.refsTitle}</p>
                                <ul>
                                    {letter.referencesHtml.map((html, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
                                    ))}
                                </ul>
                            </div>
                        </article>

                        <aside
                            ref={asideRef}
                            className="unnyc-take-action-story__sign-aside"
                            data-reveal="1"
                            data-delay="120"
                        >
                            <p className="unnyc-take-action-story__sign-label">{sign.title}</p>
                            <p className="unnyc-take-action-story__sign-lede">{sign.lede}</p>
                            <CampaignSignForm campaign={sign.campaign} />
                        </aside>
                    </div>
                </div>
            </section>

            {(wall.orgs.length > 0 || wall.people.length > 0) && (
                <section className="unnyc-take-action-story__wall">
                    <div className="unnyc-container">
                        {wall.orgs.length > 0 && (
                            <>
                                <h2 className="unnyc-take-action-story__wall-title" data-reveal="1">
                                    {wall.orgsTitle}
                                </h2>
                                <ul className="unnyc-take-action-story__wall-orgs">
                                    {wall.orgs.map((o, i) => (
                                        <li key={o.id} className="unnyc-take-action-story__wall-org" data-reveal="1" data-delay={(i % 3) * 40}>
                                            {o.website ? (
                                                <a href={o.website} target="_blank" rel="noopener noreferrer">
                                                    {o.name} ↗
                                                </a>
                                            ) : (
                                                o.name
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {wall.people.length > 0 && (
                            <>
                                <h2 className="unnyc-take-action-story__wall-title" data-reveal="1">
                                    {wall.peopleTitle}
                                </h2>
                                <ul className="unnyc-take-action-story__wall-people">
                                    {wall.people.map((p) => (
                                        <li key={p.id}>
                                            <strong>{p.name}</strong>
                                            {(p.title || p.organization) && (
                                                <span>
                                                    {' — '}
                                                    {[p.title, p.organization].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
