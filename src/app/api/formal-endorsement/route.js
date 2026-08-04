import { NextResponse } from 'next/server';

/**
 * Forwards formal endorsement commitments to a Google Sheet via an Apps
 * Script Web App endpoint. Kept server-side (rather than posting from the
 * client straight to the Apps Script URL) so the URL never ships to the
 * browser and so we control the response shape regardless of what Apps
 * Script returns.
 *
 * Set ENDORSEMENT_SHEET_WEBHOOK_URL in the Vercel project's environment
 * variables once the Apps Script Web App is deployed.
 */
export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { orgType, orgName, country, employees, firstName, jobTitle, workEmail, endorses, consent } = body || {};
    if (!orgType || !orgName || !country || !employees || !firstName || !jobTitle || !workEmail || !endorses || !consent) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const webhookUrl = process.env.ENDORSEMENT_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('Formal endorsement: ENDORSEMENT_SHEET_WEBHOOK_URL is not configured');
        return NextResponse.json({ error: 'Endorsement intake is not configured yet' }, { status: 503 });
    }

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...body, submittedAt: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error(`Sheet webhook responded ${res.status}`);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('Formal endorsement: forwarding to sheet failed —', e.message);
        return NextResponse.json({ error: 'Could not record endorsement' }, { status: 502 });
    }
}
