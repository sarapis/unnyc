import Link from 'next/link';
import '../campaign.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import CampaignSignForm from '@/components/unnyc/CampaignSignForm';
import { fetchAPI } from '@/lib/api';
import { openSource } from '@/data/unnyc';

export const metadata = {
    title: 'Sign the Open Letter — NYC Should Endorse the UN Open Source Principles',
    description:
        'An open letter calling on New York City to formally endorse the UN Open Source Principles and become the first city in the Americas to do so. Sign as an individual or endorse as an organization.',
    openGraph: {
        title: 'NYC Should Endorse the UN Open Source Principles — Sign the Open Letter',
        description:
            'Join the campaign to make New York the first city in the Americas to endorse the UN Open Source Principles.',
        type: 'article',
    },
};

/**
 * /campaign/sign — the open letter as a standalone, signable page.
 * Individuals sign, organizations endorse; both go to Payload's
 * `campaign-endorsements` collection and appear on the endorser wall below
 * once published (vetting = publishing in the Sarapis admin).
 *
 * Revalidated every 5 minutes so newly published endorsements and the live
 * tally appear without a rebuild.
 */
export const revalidate = 300;

const CAMPAIGN = 'un-open-source';

async function getEndorsements() {
    try {
        const res = await fetchAPI('/campaign-endorsements', { campaign: CAMPAIGN });
        return res?.data || [];
    } catch (e) {
        console.error('Campaign: endorsements fetch failed —', e.message);
        return [];
    }
}

async function getStats() {
    try {
        const res = await fetchAPI('/campaign-endorsements/stats', { campaign: CAMPAIGN });
        return res?.data || null;
    } catch (e) {
        console.error('Campaign: stats fetch failed —', e.message);
        return null;
    }
}

export default async function CampaignSignPage() {
    const [endorsements, stats] = await Promise.all([getEndorsements(), getStats()]);
    const orgs = endorsements.filter((e) => e.kind === 'organization');
    const people = endorsements.filter((e) => e.kind === 'individual');

    return (
        <div className="unnyc-cmp">
            <HeaderHeightVar />

            {/* Letter header */}
            <header className="unnyc-cmp-header">
                <div className="unnyc-cmp-container">
                    <h1 className="unnyc-cmp-header__title">
                        New York City Should Endorse the UN Open Source Principles
                    </h1>
                    {stats && stats.total > 0 && (
                        <p className="unnyc-cmp-header__tally" aria-live="polite">
                            Signed by <strong>{stats.individuals}</strong>{' '}
                            individual{stats.individuals === 1 ? '' : 's'} and{' '}
                            <strong>{stats.organizations}</strong>{' '}
                            organization{stats.organizations === 1 ? '' : 's'}
                        </p>
                    )}
                    <dl className="unnyc-cmp-header__meta">
                        <div>
                            <dt>To</dt>
                            <dd>
                                The NYC Mayor&rsquo;s Office of Technology &amp; Innovation and the
                                Mayor&rsquo;s Office for International Affairs
                            </dd>
                        </div>
                        <div>
                            <dt>From</dt>
                            <dd>WeGovNYC / Sarapis, and the undersigned</dd>
                        </div>
                        <div>
                            <dt>Re</dt>
                            <dd>
                                Formally endorsing the United Nations Open Source Principles — and
                                making New York the first city in the Americas to do so
                            </dd>
                        </div>
                    </dl>
                </div>
            </header>

            <div className="unnyc-cmp-layout">
                {/* Letter body */}
                <article className="unnyc-cmp-letter unnyc-cmp-layout__main">
                    <p className="unnyc-cmp-letter__salutation">
                        Dear Chief Technology Officer and Commissioner for International Affairs,
                    </p>

                    <p>
                        Every June, the United Nations convenes <strong>UN Open Source Week</strong> at
                        its Headquarters — here, in New York City. In 2026 it drew more than{' '}
                        <strong>2,600 participants from over 120 countries</strong> to discuss how open
                        source software can serve the public good. New York provides the stage on which
                        the world&rsquo;s open source movement gathers. It has not yet joined that
                        movement.
                    </p>
                    <p>
                        We are writing to ask you to change that: to{' '}
                        <strong>formally endorse the UN Open Source Principles</strong>, and in doing so
                        make New York the <strong>first city in the Americas</strong> to align its
                        digital governance with the standard the UN itself has set.
                    </p>

                    <h2>The precedent is already set</h2>
                    <p>
                        In November 2025,{' '}
                        <strong>
                            Barcelona became the first city in the world to formally endorse the UN Open
                            Source Principles
                        </strong>{' '}
                        — a decision sparked by attending UN Open Source Week. Endorsement was not a
                        procurement overhaul. It was a signature paired with a roadmap of three
                        commitments:
                    </p>
                    <ol>
                        <li>
                            A <strong>Citizen Agreement for Democratic Technologies and Digital Rights</strong>{' '}
                            — a participatory forum with civil society, universities, and the private sector.
                        </li>
                        <li>
                            An <strong>Open Source Programme Office (OSPO)</strong>, modeled on those in
                            Paris and Munich, to promote open source across municipal services.
                        </li>
                        <li>
                            A <strong>municipal fund</strong> offering grants for open source digital
                            innovation.
                        </li>
                    </ol>
                    <p>
                        The move cost Barcelona little and signaled a great deal: that a city can commit,
                        publicly and concretely, to building and sharing technology as a public good.
                    </p>

                    <h2>New York is ready — and has a habit of being first</h2>
                    <p>
                        NYC has repeatedly led U.S. cities in its engagement with the UN and in open
                        government. The groundwork for endorsement already exists:
                    </p>
                    <ul>
                        <li>
                            <strong>First U.S. city to submit a Voluntary Local Review (VLR)</strong> of
                            its Sustainable Development Goal progress to the UN (2018) — a model since
                            copied worldwide.
                        </li>
                        <li>
                            <strong>First U.S. city to join the UN&rsquo;s Safe Cities Global Initiative.</strong>
                        </li>
                        <li>
                            An <strong>Open Data Law since 2012</strong> (Local Law 11 of 2012), one of
                            the strongest in the nation, with city code already published on GitHub.
                        </li>
                        <li>
                            An <strong>Office of Technology &amp; Innovation</strong> already positioned
                            to house an NYC OSPO and to coordinate open source practice across agencies.
                        </li>
                    </ul>
                    <p>
                        Endorsing the Principles formalizes values the City already professes, and gives
                        its technologists a shared, internationally recognized framework to work within.
                    </p>

                    <h2>The eight principles</h2>
                    <p>
                        The UN Open Source Principles — endorsed in March 2025 by seventeen
                        organizations, first the Open Source Initiative and then sixteen more
                        including the Linux Foundation and the Eclipse Foundation — are:
                    </p>
                    <ol className="unnyc-cmp-letter__principles">
                        {openSource.principles.map((p, i) => (
                            <li key={i}>
                                <strong>{p.title}</strong> — {p.desc.charAt(0).toLowerCase() + p.desc.slice(1)}.
                            </li>
                        ))}
                    </ol>

                    <h2>The ask</h2>
                    <p>
                        We respectfully call on the{' '}
                        <strong>Mayor&rsquo;s Office of Technology &amp; Innovation</strong>, together
                        with the <strong>Mayor&rsquo;s Office for International Affairs</strong>, to:
                    </p>
                    <ol>
                        <li>
                            <strong>Formally endorse the UN Open Source Principles</strong>, publicly and
                            by name.
                        </li>
                        <li>
                            <strong>Announce a light-touch roadmap</strong> in the spirit of
                            Barcelona&rsquo;s — beginning with a commitment to explore an{' '}
                            <strong>NYC Open Source Programme Office</strong> within OTI.
                        </li>
                        <li>
                            <strong>Do so before or during UN Open Source Week</strong>, so that the city
                            that hosts the world&rsquo;s open source community can welcome it as a member
                            of it.
                        </li>
                    </ol>
                    <p>
                        New York does not need to reinvent the model. It needs only to sign — and to lead
                        the Americas in doing so.
                    </p>

                    <p className="unnyc-cmp-letter__signoff">
                        Respectfully,
                        <br />
                        <strong>WeGovNYC / Sarapis</strong>, and the undersigned
                    </p>

                    <aside className="unnyc-cmp-letter__refs">
                        <h3>References</h3>
                        <ul>
                            <li>
                                <a
                                    href="https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    UN Open Source Principles (announcement)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/barcelona-first-city-globally-adopt-un-open-source-principles"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Barcelona&rsquo;s endorsement (OSOR)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.unopensource.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    UN Open Source Week
                                </a>
                            </li>
                        </ul>
                    </aside>
                </article>

                {/* Sign / endorse */}
                <aside className="unnyc-cmp-sign unnyc-cmp-sign--sidebar unnyc-cmp-layout__aside">
                    <h2 className="unnyc-cmp-sign__title">Add your name</h2>
                    <p className="unnyc-cmp-sign__lede">
                        Sign the letter as an individual, or endorse it on behalf of your
                        organization. Every signature strengthens the case that New York&rsquo;s civic
                        community wants the city to lead.
                    </p>
                    <CampaignSignForm campaign={CAMPAIGN} />
                </aside>
            </div>

            {/* Endorser wall */}
            {(orgs.length > 0 || people.length > 0) && (
                <section className="unnyc-cmp-wall">
                    <div className="unnyc-cmp-container">
                        {orgs.length > 0 && (
                            <>
                                <h2 className="unnyc-cmp-wall__title">Endorsing organizations</h2>
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
                                <h2 className="unnyc-cmp-wall__title">Individual signatories</h2>
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
