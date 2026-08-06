"use client";
import { useState } from 'react';
import { createSubmission } from '@/lib/api';

const EMPTY = {
    orgName: '',
    website: '',
    firstName: '',
    jobTitle: '',
    workEmail: '',
    endorses: false,
    activity: '',
    consent: '',
};

/**
 * EndorseForm — formal endorsement on behalf of an organization.
 *
 * Modelled on "The United Nations Open Source Principles Endorsement" form, so
 * the information organizations already expect to give the UN maps onto NYC's
 * own record. Posts straight to Payload's `campaign-endorsements` with
 * kind: 'organization' — the SAME collection and review flow as the individual
 * signatures on /campaign/sign, so approved endorsements appear on the public
 * endorser wall.
 *
 * It used to POST to /api/formal-endorsement, which forwarded to a Google Sheet
 * via an Apps Script webhook. That route is gone: the Sheet needed a deployed
 * Apps Script and a bearer-capability URL held as a Vercel secret, to reach a
 * destination Payload already modelled (`kind: organization`, `website`,
 * `contactName`) and that the endorser wall already renders.
 *
 * Three fields from the UN form were dropped as unmodelled segmentation data:
 * organisation type, country, and employee count.
 */
export default function EndorseForm({ campaign = 'un-open-source' }) {
    const [fields, setFields] = useState(EMPTY);
    // 'idle' | 'submitting' | 'success' | 'error'
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (status === 'submitting') return;

        if (!fields.orgName.trim()) {
            setStatus('error');
            setMessage('Please enter the name of your organisation / association.');
            return;
        }
        if (!fields.firstName.trim()) {
            setStatus('error');
            setMessage('Please enter the contact point’s first name.');
            return;
        }
        if (!fields.jobTitle.trim()) {
            setStatus('error');
            setMessage('Please enter the contact point’s job title.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.workEmail.trim())) {
            setStatus('error');
            setMessage('Please enter a valid work email address.');
            return;
        }
        if (!fields.endorses) {
            setStatus('error');
            setMessage('Please check the box confirming your organisation/association endorses the Principles.');
            return;
        }
        if (!fields.consent) {
            setStatus('error');
            setMessage('Please indicate whether we may publish your activity description.');
            return;
        }

        setStatus('submitting');
        setMessage('');

        try {
            // Field names are the collection's, not the form's: `name` is the
            // organisation, `contactName`/`title` the contact point. See
            // CampaignEndorsements in the Sarapis CMS.
            await createSubmission('campaign-endorsements', {
                kind: 'organization',
                campaign,
                name: fields.orgName.trim(),
                email: fields.workEmail.trim(),
                contactName: fields.firstName.trim(),
                title: fields.jobTitle.trim(),
                website: fields.website.trim() || undefined,
                activity: fields.activity.trim() || undefined,
                activityConsent: fields.consent === 'Yes',
            });

            setStatus('success');
            setMessage('Thank you. Your organisation’s endorsement has been recorded and will appear on the endorser wall once reviewed.');
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
                <h3 className="unnyc-cmp-form__section">Organisation / Association</h3>

                <div className="unnyc-cmp-form__row">
                    <label className="unnyc-cmp-form__field">
                        <span>Name of Organisation / Association *</span>
                        <input type="text" autoComplete="organization" value={fields.orgName} onChange={set('orgName')} required />
                    </label>
                    <label className="unnyc-cmp-form__field">
                        <span>Website of Organisation / Association <em>(optional)</em></span>
                        <input type="url" inputMode="url" placeholder="https://" value={fields.website} onChange={set('website')} />
                    </label>
                </div>

                <h3 className="unnyc-cmp-form__section">Contact Point</h3>

                <div className="unnyc-cmp-form__row">
                    <label className="unnyc-cmp-form__field">
                        <span>First Name *</span>
                        <input type="text" autoComplete="given-name" value={fields.firstName} onChange={set('firstName')} required />
                    </label>
                    <label className="unnyc-cmp-form__field">
                        <span>Job Title *</span>
                        <input type="text" autoComplete="organization-title" value={fields.jobTitle} onChange={set('jobTitle')} required />
                    </label>
                </div>

                <div className="unnyc-cmp-form__row">
                    <label className="unnyc-cmp-form__field">
                        <span>Work Email *</span>
                        <input type="email" inputMode="email" autoComplete="email" value={fields.workEmail} onChange={set('workEmail')} required />
                    </label>
                </div>

                <h3 className="unnyc-cmp-form__section">Engagement with the Principles</h3>

                <label className="unnyc-cmp-form__updates">
                    <input
                        type="checkbox"
                        checked={fields.endorses}
                        onChange={(e) => setFields((f) => ({ ...f, endorses: e.target.checked }))}
                    />
                    <span>My Organisation/Association endorses the UN Open Source Principles</span>
                </label>

                <label className="unnyc-cmp-form__field unnyc-cmp-form__field--full">
                    <span>
                        Describe any relevant activity in support of the UN Open Source Principles that your
                        Organisation/Association is already carrying out or planning to undertake <em>(optional)</em>
                    </span>
                    <textarea rows={4} value={fields.activity} onChange={set('activity')} />
                </label>

                <fieldset className="unnyc-cmp-form__radios">
                    <legend>
                        Do you consent to this description of activities being made publicly available? *
                    </legend>
                    <label>
                        <input
                            type="radio"
                            name="consent"
                            value="Yes"
                            checked={fields.consent === 'Yes'}
                            onChange={set('consent')}
                        />
                        <span>Yes</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="consent"
                            value="No"
                            checked={fields.consent === 'No'}
                            onChange={set('consent')}
                        />
                        <span>No</span>
                    </label>
                </fieldset>

                <div className="unnyc-cmp-form__actions">
                    <button
                        type="submit"
                        className="unnyc-btn unnyc-btn--primary"
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'Submitting…' : 'Submit our endorsement'}
                    </button>
                    <p className="unnyc-cmp-form__privacy">
                        Contact information submitted here is confidential and will not be shared or reproduced
                        without prior written permission.
                    </p>
                </div>

                {status === 'error' && (
                    <p className="unnyc-cmp-form__error" role="alert">{message}</p>
                )}
            </form>
        </div>
    );
}
