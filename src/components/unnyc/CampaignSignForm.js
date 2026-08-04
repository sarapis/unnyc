"use client";
import { useState } from 'react';
import { createSubmission } from '@/lib/api';

const EMPTY = { name: '', email: '', title: '', organization: '', contactName: '', website: '' };

/**
 * CampaignSignForm — signature/endorsement form for the campaign page.
 *
 * Two modes: sign as an individual, or endorse on behalf of an organization.
 * Posts to Payload's `campaign-endorsements` collection (public create-only;
 * entries appear on the endorser wall once published/reviewed). Optionally also
 * subscribes the email to campaign updates via `campaign-signups`.
 */
export default function CampaignSignForm({ campaign = 'un-open-source' }) {
    const [kind, setKind] = useState('individual');
    const [fields, setFields] = useState(EMPTY);
    const [wantsUpdates, setWantsUpdates] = useState(false);
    // 'idle' | 'submitting' | 'success' | 'error'
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (status === 'submitting') return;

        const name = fields.name.trim();
        const email = fields.email.trim();
        if (!name) {
            setStatus('error');
            setMessage(kind === 'individual' ? 'Please enter your name.' : 'Please enter the organization name.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        if (kind === 'organization' && !fields.contactName.trim()) {
            setStatus('error');
            setMessage('Please enter a contact name for the organization.');
            return;
        }

        setStatus('submitting');
        setMessage('');

        try {
            await createSubmission('campaign-endorsements', {
                kind,
                name,
                email,
                campaign,
                title: fields.title.trim() || undefined,
                organization: fields.organization.trim() || undefined,
                contactName: fields.contactName.trim() || undefined,
                website: fields.website.trim() || undefined,
            });

            // Best-effort updates subscription — never blocks the signature.
            if (wantsUpdates) {
                createSubmission('campaign-signups', { email, campaign, source: '/campaign' }).catch(() => { });
            }

            setStatus('success');
            setMessage(
                kind === 'individual'
                    ? 'Thank you for signing. Your name will appear below once reviewed.'
                    : 'Thank you. Your organization’s endorsement will appear below once reviewed.'
            );
            setFields(EMPTY);
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again in a moment.');
        }
    };

    const switchKind = (k) => {
        setKind(k);
        if (status !== 'idle') { setStatus('idle'); setMessage(''); }
    };

    return (
        <div className="unnyc-cmp-form" id="sign">
            <div className="unnyc-cmp-form__tabs" role="tablist" aria-label="Sign as">
                <button
                    type="button"
                    role="tab"
                    aria-selected={kind === 'individual'}
                    className={`unnyc-cmp-form__tab${kind === 'individual' ? ' unnyc-cmp-form__tab--active' : ''}`}
                    onClick={() => switchKind('individual')}
                >
                    Sign as an individual
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={kind === 'organization'}
                    className={`unnyc-cmp-form__tab${kind === 'organization' ? ' unnyc-cmp-form__tab--active' : ''}`}
                    onClick={() => switchKind('organization')}
                >
                    Endorse as an organization
                </button>
            </div>

            {status === 'success' ? (
                <p className="unnyc-cmp-form__success" role="status">{message}</p>
            ) : (
                <form className="unnyc-cmp-form__body" onSubmit={submit} noValidate>
                    {kind === 'individual' ? (
                        <>
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
                            <div className="unnyc-cmp-form__row">
                                <label className="unnyc-cmp-form__field">
                                    <span>Title <em>(optional)</em></span>
                                    <input type="text" autoComplete="organization-title" value={fields.title} onChange={set('title')} />
                                </label>
                                <label className="unnyc-cmp-form__field">
                                    <span>Affiliation <em>(optional)</em></span>
                                    <input type="text" autoComplete="organization" value={fields.organization} onChange={set('organization')} />
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="unnyc-cmp-form__row">
                                <label className="unnyc-cmp-form__field">
                                    <span>Organization name *</span>
                                    <input type="text" autoComplete="organization" value={fields.name} onChange={set('name')} required />
                                </label>
                                <label className="unnyc-cmp-form__field">
                                    <span>Website <em>(optional)</em></span>
                                    <input type="url" inputMode="url" placeholder="https://" value={fields.website} onChange={set('website')} />
                                </label>
                            </div>
                            <div className="unnyc-cmp-form__row">
                                <label className="unnyc-cmp-form__field">
                                    <span>Contact name *</span>
                                    <input type="text" autoComplete="name" value={fields.contactName} onChange={set('contactName')} required />
                                </label>
                                <label className="unnyc-cmp-form__field">
                                    <span>Contact email *</span>
                                    <input type="email" inputMode="email" autoComplete="email" value={fields.email} onChange={set('email')} required />
                                </label>
                            </div>
                        </>
                    )}

                    <label className="unnyc-cmp-form__updates">
                        <input
                            type="checkbox"
                            checked={wantsUpdates}
                            onChange={(e) => setWantsUpdates(e.target.checked)}
                        />
                        <span>Also send me campaign updates by email</span>
                    </label>

                    <div className="unnyc-cmp-form__actions">
                        <button
                            type="submit"
                            className="unnyc-btn unnyc-btn--primary"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting'
                                ? 'Submitting…'
                                : kind === 'individual' ? 'Sign the letter' : 'Endorse the letter'}
                        </button>
                        <p className="unnyc-cmp-form__privacy">
                            Your email is never shown publicly. Names appear on this page after a quick review.
                        </p>
                    </div>

                    {status === 'error' && (
                        <p className="unnyc-cmp-form__error" role="alert">{message}</p>
                    )}
                </form>
            )}
        </div>
    );
}
