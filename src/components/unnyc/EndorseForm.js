"use client";
import { useState } from 'react';

const ORG_TYPES = ['Academia', 'Civil Society', 'Private Sector', 'Technical Community', 'International Organisation'];
const EMPLOYEE_BANDS = ['1-10', '11-50', '51-250', '251-1000', 'Over 1000'];

const EMPTY = {
    orgType: '',
    orgName: '',
    country: '',
    website: '',
    employees: '',
    firstName: '',
    jobTitle: '',
    workEmail: '',
    endorses: false,
    activity: '',
    consent: '',
};

/**
 * EndorseForm — mirrors the fields of "The United Nations Open Source
 * Principles Endorsement" form (the reference CryptPad form provided for
 * this page), so the same information organizations already expect to give
 * the UN directly maps onto NYC's own formal-endorsement record. Posts to
 * /api/formal-endorsement, which forwards to a Google Sheet via an Apps
 * Script Web App endpoint.
 */
export default function EndorseForm() {
    const [fields, setFields] = useState(EMPTY);
    // 'idle' | 'submitting' | 'success' | 'error'
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (status === 'submitting') return;

        if (!fields.orgType) {
            setStatus('error');
            setMessage('Please select an organisation / association type.');
            return;
        }
        if (!fields.orgName.trim()) {
            setStatus('error');
            setMessage('Please enter the name of your organisation / association.');
            return;
        }
        if (!fields.country.trim()) {
            setStatus('error');
            setMessage('Please enter the country of your organisation / association.');
            return;
        }
        if (!fields.employees) {
            setStatus('error');
            setMessage('Please select the number of employees.');
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
            const res = await fetch('/api/formal-endorsement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orgType: fields.orgType,
                    orgName: fields.orgName.trim(),
                    country: fields.country.trim(),
                    website: fields.website.trim() || undefined,
                    employees: fields.employees,
                    firstName: fields.firstName.trim(),
                    jobTitle: fields.jobTitle.trim(),
                    workEmail: fields.workEmail.trim(),
                    endorses: fields.endorses,
                    activity: fields.activity.trim() || undefined,
                    consent: fields.consent,
                }),
            });
            if (!res.ok) throw new Error('Request failed');

            setStatus('success');
            setMessage('Thank you. Your organisation’s formal endorsement has been recorded.');
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
                        <span>Organisation / Association type *</span>
                        <select value={fields.orgType} onChange={set('orgType')} required>
                            <option value="" disabled>Select one</option>
                            {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </label>
                    <label className="unnyc-cmp-form__field">
                        <span>Number of employees *</span>
                        <select value={fields.employees} onChange={set('employees')} required>
                            <option value="" disabled>Select one</option>
                            {EMPLOYEE_BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </label>
                </div>

                <div className="unnyc-cmp-form__row">
                    <label className="unnyc-cmp-form__field">
                        <span>Name of Organisation / Association *</span>
                        <input type="text" autoComplete="organization" value={fields.orgName} onChange={set('orgName')} required />
                    </label>
                    <label className="unnyc-cmp-form__field">
                        <span>Country of Organisation / Association *</span>
                        <input type="text" autoComplete="country-name" value={fields.country} onChange={set('country')} required />
                    </label>
                </div>

                <div className="unnyc-cmp-form__row">
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
