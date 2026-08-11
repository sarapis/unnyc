import '../campaign.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import CampaignSignForm from '@/components/unnyc/CampaignSignForm';
import { fetchAPI } from '@/lib/api';
import { getContent, inlineMd, principlesFlat } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('sign');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
}

/**
 * /campaign/sign — the open letter as a standalone, signable page.
 * Individuals sign, organizations endorse; both go to Payload's
 * `campaign-endorsements` collection and appear on the endorser wall below
 * once published (vetting = publishing in the Sarapis admin).
 *
 * ALL COPY LIVES IN content/sign.md, except the eight principles, which come
 * from content/principles.md — the single source shared with /start and the
 * printable declaration. `{{principles}}` in the markdown marks where that list
 * is injected. See docs/EDITING-CONTENT.md.
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
    // list spliced in where the editor put the marker.
    const letter = doc.sections.letter;
    const chunks = [];
    for (const b of [{ label: null, html: letter.html }, ...letter.blocks]) {
        const [before, after] = b.html.includes(PRINCIPLES_MARKER)
            ? b.html.split(PRINCIPLES_MARKER)
            : [b.html, null];
        chunks.push({ label: b.label, before, after });
    }

    return (
        <div className="unnyc-cmp">
            <HeaderHeightVar />

            {/* Letter header */}
            <header className="unnyc-cmp-header">
                <div className="unnyc-cmp-container">
                    <h1 className="unnyc-cmp-header__title">{doc.title}</h1>
                    {stats && stats.total > 0 && (
                        <p className="unnyc-cmp-header__tally" aria-live="polite">
                            Signed by <strong>{stats.individuals}</strong>{' '}
                            individual{stats.individuals === 1 ? '' : 's'} and{' '}
                            <strong>{stats.organizations}</strong>{' '}
                            organization{stats.organizations === 1 ? '' : 's'}
                        </p>
                    )}
                    <dl className="unnyc-cmp-header__meta">
                        {doc.addressed.map((row) => (
                            <div key={row.label}>
                                <dt>{row.label}</dt>
                                <dd>{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </header>

            <div className="unnyc-cmp-layout">
                <article className="unnyc-cmp-letter unnyc-cmp-layout__main">
                    {chunks.map((c, i) => (
                        <div key={i}>
                            {c.label && <h2>{c.label}</h2>}
                            <div dangerouslySetInnerHTML={{ __html: c.before }} />
                            {c.after !== null && (
                                <>
                                    <ol className="unnyc-cmp-letter__principles">
                                        {principles.map((p, j) => (
                                            <li key={j}>
                                                <strong>{p.title}</strong> —{' '}
                                                {p.desc.charAt(0).toLowerCase() + p.desc.slice(1)}.
                                            </li>
                                        ))}
                                    </ol>
                                    <div dangerouslySetInnerHTML={{ __html: c.after }} />
                                </>
                            )}
                        </div>
                    ))}

                    {/* MUST be a flow container, not a <p>. `sections.*.html` is
                        block-level markdown output, so it arrives already wrapped
                        in its own <p>. A <p> cannot contain a <p>: the browser
                        silently closes the outer one and splits it into siblings,
                        so the parsed DOM stops matching what React rendered and
                        the whole page fails to hydrate. That is what this was
                        until 2026-08-11. Anywhere a phrasing element needs
                        markdown, use inlineMd() instead — see the refs list below
                        and every other consumer in this repo. */}
                    <div
                        className="unnyc-cmp-letter__signoff"
                        dangerouslySetInnerHTML={{ __html: doc.sections.signoff.html }}
                    />

                    <aside className="unnyc-cmp-letter__refs">
                        <h3>{doc.refsTitle}</h3>
                        <ul>
                            {doc.references.map((r, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(r) }} />
                            ))}
                        </ul>
                    </aside>
                </article>

                {/* Sign / endorse */}
                <aside className="unnyc-cmp-sign unnyc-cmp-sign--sidebar unnyc-cmp-layout__aside">
                    <h2 className="unnyc-cmp-sign__title">{doc.signTitle}</h2>
                    <p className="unnyc-cmp-sign__lede">{doc.signLede}</p>
                    <CampaignSignForm campaign={CAMPAIGN} />
                </aside>
            </div>

            {/* Endorser wall */}
            {(orgs.length > 0 || people.length > 0) && (
                <section className="unnyc-cmp-wall">
                    <div className="unnyc-cmp-container">
                        {orgs.length > 0 && (
                            <>
                                <h2 className="unnyc-cmp-wall__title">{doc.wall.orgsTitle}</h2>
                                <ul className="unnyc-cmp-wall__orgs">
                                    {orgs.map((o) => (
                                        <li key={o.id} className="unnyc-cmp-wall__org">
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
                        {people.length > 0 && (
                            <>
                                <h2 className="unnyc-cmp-wall__title">{doc.wall.peopleTitle}</h2>
                                <ul className="unnyc-cmp-wall__people">
                                    {people.map((p) => (
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
