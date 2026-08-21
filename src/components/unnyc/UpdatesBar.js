"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { createSubmission } from '@/lib/api';

/**
 * UpdatesBar — the site-wide email capture, rendered IN THE FLOW between the
 * content and the footer (mounted in layout.js, between <main> and
 * <UnnycFooter />).
 *
 * ── IT USED TO BE A FIXED OVERLAY, AND MOVING IT IN-FLOW DELETED MOST OF IT ──
 * The first version was `position: fixed` at the bottom of the viewport, which
 * needed: a scroll-depth listener, an 8s dwell floor, a 25s backstop, a slide-in
 * animation, a `prefers-reduced-motion` exception, a dismiss button, two
 * localStorage keys, an Escape handler, and a mobile height budget — because a
 * thing that covers the page has to earn its place and then get out of the way.
 * In the flow it covers nothing, so every one of those is gone.
 *
 * What replaces the trigger is the layout itself: a reader reaches this by
 * getting to the end of the page, which IS the engagement signal the timers were
 * approximating. And it cannot be an intrusive interstitial, which was the whole
 * anxiety behind the original design.
 *
 * ⚠ DO NOT ADD A REVEAL ANIMATION OR A DELAY. In-flow content that appears after
 * mount shifts the page under the reader — the exact opposite of the fixed
 * version's problem, and a Core Web Vitals penalty (CLS) rather than an
 * interstitial one. It renders immediately, server-side included.
 *
 * ⚠ NO localStorage, DELIBERATELY. The fixed version remembered dismissal and
 * success so it would stop nagging. In-flow there is nothing to nag: the form
 * simply sits at the end of the page like any other. Reading storage to hide it
 * would also mean the server and the client render different things — a
 * hydration mismatch — for no reader benefit. Success state lasts the session.
 *
 * ── WHERE IT DOESN'T APPEAR ─────────────────────────────────────────────────
 * SUPPRESSED (below) on the two campaign forms and /contact, which already take
 * an email — asking twice on one page reads as a broken site — and on both
 * printables, which are meant to reach paper. The `@media print` rule still
 * matters too: in-flow, this WOULD print at the end of any other page.
 *
 * ── SUBMISSION ──────────────────────────────────────────────────────────────
 * Payload's `campaign-signups`, the SAME collection the "get updates" checkbox
 * on /campaign/sign has always used — no new collection, no CMS change, no
 * secret. `source` carries the pathname, so the admin shows which page earned
 * each address; the sign-form path sends '/campaign'.
 * ⚠ It CANNOT be tested from localhost: that origin is not in Payload's CORS
 * allowlist, so the POST is blocked and this shows its generic error. To check
 * the live origin without creating a record, POST an intentionally invalid body
 * and confirm Payload answers 400 "invalid: Email" rather than a network error.
 */

/** Routes that already ask for an email, and the two printables. */
const SUPPRESSED = new Set([
    '/campaign/sign',
    '/campaign/endorse',
    '/campaign/endorse/document',
    '/principles/document',
    '/contact',
]);

/** Deliberately loose. The server is the real validator and an over-clever
 *  regex rejects addresses that work — this only catches the obvious typo
 *  before a round trip. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UpdatesBar({ copy, campaign = 'un-open-source' }) {
    const pathname = usePathname();
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    if (SUPPRESSED.has(pathname) || !copy) return null;

    async function onSubmit(e) {
        e.preventDefault();
        if (status === 'submitting') return;

        const value = email.trim();
        if (!LOOKS_LIKE_EMAIL.test(value)) {
            setStatus('error');
            setMessage(copy.invalid);
            return;
        }

        setStatus('submitting');
        setMessage('');
        try {
            await createSubmission('campaign-signups', {
                email: value,
                campaign,
                // The page they were reading when they signed up.
                source: pathname,
            });
            setStatus('success');
            setMessage(copy.success);
        } catch {
            setStatus('error');
            setMessage(copy.error);
        }
    }

    return (
        <aside className="unnyc-updates" aria-label={copy.title}>
            <div className="unnyc-updates__inner">
                {status === 'success' ? (
                    <p className="unnyc-updates__done" role="status">
                        {copy.success}
                    </p>
                ) : (
                    <>
                        <div className="unnyc-updates__copy">
                            <p className="unnyc-updates__title">{copy.title}</p>
                            <p className="unnyc-updates__text">{copy.text}</p>
                        </div>

                        <form className="unnyc-updates__form" onSubmit={onSubmit} noValidate>
                            <label className="unnyc-updates__label" htmlFor="unnyc-updates-email">
                                {copy.placeholder}
                            </label>
                            <input
                                id="unnyc-updates-email"
                                className="unnyc-updates__input"
                                type="email"
                                name="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder={copy.placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-describedby="unnyc-updates-consent"
                                aria-invalid={status === 'error' ? 'true' : undefined}
                                required
                            />
                            <button
                                type="submit"
                                className="unnyc-btn unnyc-btn--primary unnyc-updates__submit"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? copy.buttonBusy : copy.button}
                            </button>
                        </form>

                        <p className="unnyc-updates__consent" id="unnyc-updates-consent">
                            {copy.consent}
                        </p>
                    </>
                )}

                {/* aria-live so the error is announced without moving focus. */}
                <p className="unnyc-updates__status" role="status" aria-live="polite">
                    {status === 'error' ? message : ''}
                </p>
            </div>
        </aside>
    );
}
