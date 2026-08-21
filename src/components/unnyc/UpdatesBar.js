"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createSubmission } from '@/lib/api';

/**
 * UpdatesBar — the site-wide email capture, mounted once in layout.js.
 *
 * ── A BAR, NOT A MODAL, AND THAT IS THE MAIN DECISION HERE ──────────────────
 * Nothing is covered, nothing is blocked, and the page underneath stays usable.
 * Three reasons, in order of weight:
 *   1. Google treats interstitials that cover content on mobile as a negative
 *      signal. Blocking the page after a week spent on canonicals, structured
 *      data and the font critical path would be self-defeating.
 *   2. This site's job is to be READ and forwarded. Interrupting somebody
 *      mid-argument costs more attention than it captures.
 *   3. A non-modal region needs no focus trap, no aria-modal, and no
 *      return-focus-on-close — machinery that is easy to get subtly wrong for
 *      keyboard and screen-reader users, and invisible when you do.
 * If this ever becomes a modal, all of point 3 becomes required work.
 *
 * ── IT WAITS FOR ENGAGEMENT ─────────────────────────────────────────────────
 * Half the page read AND at least MIN_DWELL on it, or MAX_WAIT elapsed either
 * way. The dwell floor exists because "50% scrolled" fires almost immediately on
 * a short page like `/` or `/campaign` — scroll depth alone would have made this
 * an on-arrival popup on exactly the pages where that is most annoying.
 *
 * ── WHERE IT DOESN'T APPEAR ─────────────────────────────────────────────────
 * SUPPRESSED (below): the two campaign forms and /contact already take an email,
 * and asking twice on one page reads as a broken site rather than as enthusiasm;
 * both printables are meant to reach paper. Print is also handled in CSS, so it
 * can never end up in a PDF.
 *
 * ── SUBMISSION ──────────────────────────────────────────────────────────────
 * Payload's `campaign-signups`, the SAME collection the "get updates" checkbox
 * on /campaign/sign has always used — no new collection, no CMS change, no
 * secret. `source` carries the actual pathname, so the admin shows which page
 * earned each address; the sign-form path sends '/campaign', so the two are
 * distinguishable.
 * ⚠ It CANNOT be tested from localhost: that origin is not in Payload's CORS
 * allowlist, so the POST is blocked by the browser and this shows its generic
 * error. That is expected, not a bug — verify on the deployed origin.
 */

/** Routes that already ask for an email, and the two printables. */
const SUPPRESSED = new Set([
    '/campaign/sign',
    '/campaign/endorse',
    '/campaign/endorse/document',
    '/principles/document',
    '/contact',
]);

const STORAGE_DISMISSED = 'unnyc:updates:dismissed';
const STORAGE_SUBSCRIBED = 'unnyc:updates:subscribed';

const MIN_DWELL_MS = 8000;   // never sooner than this, however fast they scroll
const MAX_WAIT_MS = 25000;   // ...and no later than this, however little they do
const SCROLL_FRACTION = 0.5; // half the scrollable height

/** Deliberately loose. The server is the real validator and an over-clever
 *  regex rejects addresses that work — this only catches the obvious typo
 *  before a round trip. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** localStorage throws in private-mode Safari and when storage is full. A
 *  reader who cannot be remembered should still see the bar once, not crash. */
function remembered(key) {
    try {
        return window.localStorage.getItem(key) === '1';
    } catch {
        return false;
    }
}
function remember(key) {
    try {
        window.localStorage.setItem(key, '1');
    } catch {
        /* ignore — worst case it appears again next visit */
    }
}

export default function UpdatesBar({ copy, campaign = 'un-open-source' }) {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const shown = useRef(false);

    const suppressed = SUPPRESSED.has(pathname);

    useEffect(() => {
        if (suppressed || shown.current) return;
        if (remembered(STORAGE_DISMISSED) || remembered(STORAGE_SUBSCRIBED)) return;

        const mountedAt = Date.now();
        let dwellTimer;
        const show = () => {
            if (shown.current) return;
            shown.current = true;
            setVisible(true);
        };

        // Fires as soon as BOTH conditions hold: if they scroll early, wait out
        // the dwell floor; if the dwell has already passed, show immediately.
        const onScroll = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 1;
            if (progress < SCROLL_FRACTION) return;
            const waited = Date.now() - mountedAt;
            if (waited >= MIN_DWELL_MS) show();
            else if (!dwellTimer) dwellTimer = setTimeout(show, MIN_DWELL_MS - waited);
        };

        const backstop = setTimeout(show, MAX_WAIT_MS);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(backstop);
            clearTimeout(dwellTimer);
        };
    }, [suppressed, pathname]);

    const dismiss = useCallback(() => {
        setVisible(false);
        remember(STORAGE_DISMISSED);
    }, []);

    // Escape closes it. Non-modal, so this is a convenience rather than the
    // requirement it would be for a dialog — but a reader who reaches for Escape
    // should not have to hunt for the button.
    useEffect(() => {
        if (!visible) return;
        const onKey = (e) => {
            if (e.key === 'Escape') dismiss();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [visible, dismiss]);

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
            remember(STORAGE_SUBSCRIBED);
        } catch {
            setStatus('error');
            setMessage(copy.error);
        }
    }

    if (suppressed || !visible) return null;

    return (
        <aside
            className="unnyc-updates"
            // A labelled region, NOT role="dialog": nothing is trapped and the
            // page behind it is fully usable, so announcing a dialog would
            // misdescribe it to a screen reader.
            aria-label={copy.title}
        >
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

                <button
                    type="button"
                    className="unnyc-updates__close"
                    onClick={dismiss}
                    aria-label={copy.dismiss}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        </aside>
    );
}
