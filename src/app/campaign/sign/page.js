import UnnycTakeActionStoryscroller from '@/components/unnyc/primer/UnnycTakeActionStoryscroller';
import './sign.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { fetchAPI } from '@/lib/api';
import { getContent, inlineMd, principlesFlat } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { breadcrumbLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('sign');
    return pageMetadata(meta, '/campaign/sign');
}

/**
 * /campaign/sign — the open letter as a standalone, signable page, in the
 * storyscroller layout (2026-09): letter prose on the left, a sticky
 * "Add your name" card on the right, no sidebar rail. Individuals sign,
 * organizations endorse; both go to Payload's `campaign-endorsements`
 * collection and appear on the endorser wall below once published (vetting
 * = publishing in the Sarapis admin).
 *
 * ALL COPY LIVES IN content/sign.md, except the eight principles, which come
 * from content/principles.md — the single source shared with /start and the
 * printable declaration. `{{principles}}` in the markdown marks where that list
 * is injected. See docs/EDITING-CONTENT.md.
 *
 * The form itself is CampaignSignForm.js, unchanged — this page only
 * restyles it (see sign.css) and wraps it in a sticky card. It posts to
 * Payload directly and isn't reused anywhere else, so that restyling is
 * safe: /campaign/endorse's EndorseForm shares the same `.unnyc-cmp-form__*`
 * class names, but this file's overrides are scoped under
 * `.unnyc-take-action-story`, a wrapper only this page renders.
 *
 * Revalidated every 5 minutes so newly published endorsements and the live
 * tally appear without a rebuild.
 */
export const revalidate = 300;

const CAMPAIGN = 'un-open-source';
const PRINCIPLES_MARKER = '<p>{{principles}}</p>';

async function getEndorsements() {
    try {
        // Query goes in the PATH — fetchAPI's second argument is options
        // ({ isDraftMode }), not params. This used to pass { campaign } there,
        // where it was silently ignored; harmless with one campaign, wrong the
        // moment there are two.
        const res = await fetchAPI(`/campaign-endorsements?campaign=${encodeURIComponent(CAMPAIGN)}`);
        return res?.data || [];
    } catch (e) {
        console.error('Campaign: endorsements fetch failed —', e.message);
        return [];
    }
}

/**
 * Tally, derived from the rows we already fetched.
 *
 * There used to be a second request to `/campaign-endorsements/stats`. That is
 * not a Payload endpoint — Payload read `stats` as a document id, so it 403'd on
 * every render and the tally never once appeared. Counting the list we already
 * have is one fewer request and cannot drift from what the wall shows.
 */
function tally(endorsements) {
    const organizations = endorsements.filter((e) => e.kind === 'organization').length;
    const individuals = endorsements.filter((e) => e.kind === 'individual').length;
    return { organizations, individuals, total: organizations + individuals };
}

export default async function CampaignSignPage() {
    const endorsements = await getEndorsements();
    const stats = tally(endorsements);
    const doc = getContent('sign');
    const principles = principlesFlat(getContent('principles').principlesDoc);
    const orgs = endorsements.filter((e) => e.kind === 'organization');
    const people = endorsements.filter((e) => e.kind === 'individual');

    // The letter body: prose from markdown, with the data-driven principles
    // list spliced in where the editor put the marker. Same derivation as
    // the page this replaces — see UnnycTakeActionStoryscroller for how each
    // chunk is revealed.
    const letter = doc.sections.letter;
    const chunks = [];
    for (const b of [{ label: null, html: letter.html }, ...letter.blocks]) {
        const [before, after] = b.html.includes(PRINCIPLES_MARKER)
            ? b.html.split(PRINCIPLES_MARKER)
            : [b.html, null];
        chunks.push({ label: b.label, before, after });
    }

    return (
        <>
            <StructuredData data={breadcrumbLd('/campaign/sign')} />
            <HeaderHeightVar />
            <UnnycTakeActionStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.title,
                    tally: stats.total > 0 ? stats : null,
                    addressed: doc.addressed,
                }}
                letter={{
                    chunks,
                    principles,
                    signoffHtml: doc.sections.signoff.html,
                    refsTitle: doc.refsTitle,
                    referencesHtml: doc.references.map((r) => inlineMd(r)),
                }}
                sign={{ title: doc.signTitle, lede: doc.signLede, campaign: CAMPAIGN }}
                wall={{ orgsTitle: doc.wall.orgsTitle, peopleTitle: doc.wall.peopleTitle, orgs, people }}
            />
        </>
    );
}
