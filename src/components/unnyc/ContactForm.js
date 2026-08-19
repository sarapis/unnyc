"use client";
import { useState } from 'react';
import { createSubmission } from '@/lib/api';

const EMPTY = { name: '', email: '', message: '', website: '' };

/**
 * ContactForm — the footer's Contact page form. Name, email, message.
 *
 * Posts to Payload's `contact-submissions` (anonymous create, admin-only read),
 * the same collection sarapis.org's own contact form uses. No CMS change was
 * needed: the collection already has exactly these three fields, and
 * next.sarapis.org's CORS list must include opensource.nyc (and www) — the
 * campaign's primary domain since 2026-08-19. A missing origin fails INVISIBLY:
 * the browser blocks the POST and the form shows only the generic error.
 *
 * Two things worth knowing:
 *
 *  - `website` is the collection's HONEYPOT, not a real field. Payload's
 *    beforeValidate throws if it is filled and never stores it. It is hidden
 *    from people (and from screen readers, and from tab order) — leave it that
 *    way; a visible "website" input would reject genuine submissions.
 *  - The collection is NOT brand-scoped — it has no `sites` field, so messages
 *    from here land in the same bucket as sarapis.org's. `createSubmission`
 *    sends a `site` key anyway and Payload silently ignores it (verified against
 *    the live API). Hence the source line appended to the message below: it is
 *    the only thing that tells an admin which site a message came from.
 */
export default function ContactForm() {
    const [fields, setFields] = useState(EMPTY);
    // 'idle' | 'submitting' | 'success' | 'error'
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (status === 'submitting') return;

        const name = fields.name.trim();
        const email = fields.email.trim();
        const body = fields.message.trim();

        if (!name) {
            setStatus('error');
            setMessage('Please enter your name.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        if (!body) {
            setStatus('error');
            setMessage('Please enter a message.');
            return;
        }

        setStatus('submitting');
        setMessage('');

        try {
            await createSubmission('contact-submissions', {
                name,
                email,
                // The collection has no per-site field; this line is what tells
                // an admin the message came from the campaign site.
                message: `${body}\n\n— Sent from opensource.nyc`,
                ...(fields.website ? { website: fields.website } : {}),
            });
            setStatus('success');
            setMessage('Thanks — your message is on its way. We’ll get back to you.');
            setFields(EMPTY);
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again in a moment.');
        }
    };

    if (status === 'success') {
        return (
            <div className="unnyc-cmp-form">
                <p className="unnyc-cmp-form__success" role="status">{message}</p>
            </div>
        );
    }

    return (
        <div className="unnyc-cmp-form">
            <form className="unnyc-cmp-form__body" onSubmit={submit} noValidate>
                <div className="unnyc-cmp-form__row">
                    <label className="unnyc-cmp-form__field">
                        <span>Your name *</span>
                        <input type="text" autoComplete="name" value={fields.name} onChange={set('name')} required />
                    </label>
                    <label className="unnyc-cmp-form__field">
                        <span>Email *</span>
                        <input type="email" inputMode="email" autoComplete="email" value={fields.email} onChange={set('email')} required />
                    </label>
                </div>

                <label className="unnyc-cmp-form__field">
                    <span>Message *</span>
                    <textarea rows={6} value={fields.message} onChange={set('message')} required />
                </label>

                {/* Honeypot — hidden from people, offered to bots. See the note above. */}
                <div className="unnyc-cmp-form__hp" aria-hidden="true">
                    <label>
                        Website
                        <input
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={fields.website}
                            onChange={set('website')}
                        />
                    </label>
                </div>

                <div className="unnyc-cmp-form__actions">
                    <button type="submit" className="unnyc-btn unnyc-btn--primary" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Sending…' : 'Send message'}
                    </button>
                    <p className="unnyc-cmp-form__privacy">
                        Your email is only used to reply. It is never shown publicly or added to a list.
                    </p>
                </div>

                {status === 'error' && (
                    <p className="unnyc-cmp-form__error" role="alert">{message}</p>
                )}
            </form>
        </div>
    );
}
