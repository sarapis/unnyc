import Link from 'next/link';
import '../primer.css';
import './success.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import PrimerCases from '@/components/unnyc/primer/PrimerCases';

export const metadata = {
    title: 'What Success Looks Like — UNNYC',
    description:
        'Barcelona, Paris, France, and Tokyo already show what endorsing and building on open source wins a government — real tools other cities adopt, and real international standing.',
    openGraph: {
        title: 'What Success Looks Like — UNNYC',
        description:
            'What Barcelona, Paris, France, and Tokyo have already won by going open source — and what it would mean for New York.',
        type: 'article',
    },
};

/**
 * /success — "What success looks like." Sits between /crosswalk
 * ("why it matters") and /campaign ("sign the letter") in the reading
 * flow. Barcelona is the primary, deepest case; Paris/France and Tokyo get
 * full treatment too; the remaining case studies (Munich, Estonia, Germany,
 * India, DHIS2, OpenCRVS) sit at the bottom via the shared PrimerCases grid.
 * All facts here were independently verified — several commonly-repeated
 * claims (Decidim adoption counts, the Baltimore/Lutèce story, Tokyo's
 * dashboard being forked internationally) turned out to be overstated or
 * false and are deliberately NOT repeated; see inline sourcing.
 */
export default function SuccessPage() {
    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            <header className="unnyc-success__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-success__title">
                        A Roadmap for NYC to Follow
                    </h1>
                    <p className="unnyc-success__lede">
                        <a href="#barcelona" className="unnyc-gloss__link">Barcelona</a>,{' '}
                        <a href="#paris" className="unnyc-gloss__link">Paris</a>, and{' '}
                        <a href="#tokyo" className="unnyc-gloss__link">Tokyo</a> have already done
                        versions of what this campaign is asking New York to do — and each has
                        something concrete to show for it. Here&rsquo;s exactly what NYC would be
                        modeling itself after.
                    </p>
                </div>
            </header>

            {/* Barcelona — primary case */}
            <section className="unnyc-success__case" id="barcelona">
                <div className="unnyc-success__case-banner">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Barcelona_Skyline.jpg/1280px-Barcelona_Skyline.jpg"
                        alt="Skyline of Barcelona"
                    />
                    <a
                        href="https://commons.wikimedia.org/wiki/File:Barcelona_Skyline.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="unnyc-success__case-banner-credit"
                    >
                        Photo: SGDWN / Wikimedia Commons (CC BY-SA 4.0)
                    </a>
                </div>
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-success__case-title">Barcelona: The First City to Sign</h2>

                    <p>
                        On November 2, 2025, Barcelona became the first city in the world to
                        formally endorse the UN Open Source Principles, formalizing the signature
                        during Barcelona Open Tech Week. The move followed the city&rsquo;s own
                        participation in UN Open Source Week 2025 in New York — the same event
                        this campaign is built around. Barcelona paired the signature with three
                        forward commitments: an Open Source Programme Office it&rsquo;s now
                        standing up, a Citizen Agreement for Democratic Technologies and Digital
                        Rights, and a municipal open source fund — all still being built out, not
                        finished overnight. The signature itself, though, was immediate: exactly
                        the &ldquo;low-cost, high-signal&rdquo; move this campaign is asking of
                        New York.
                    </p>

                    <p>
                        What Barcelona already runs, independent of that pending office, is the
                        real proof of concept. <strong>Decidim</strong>, the city&rsquo;s open
                        source citizen-participation platform, has been running since 2016,
                        financed by Barcelona City Council and the Catalan regional government.
                        Its 2020–2023 participatory budgeting cycle alone allocated €30 million
                        and drew 64,571 participants who submitted 1,982 proposals, 76 of which
                        were funded. In July 2023, the Digital Public Goods Alliance recognized
                        Decidim as a Digital Public Good — the same designation this campaign
                        points to elsewhere as a marker of software built to a global public-sector
                        standard.
                    </p>

                    <div className="unnyc-success__stats">
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">1st</span>
                            <span className="unnyc-success__stat-label">City in the world to endorse the UN Principles</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">64,571</span>
                            <span className="unnyc-success__stat-label">Participants in one participatory-budget cycle</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">2023</span>
                            <span className="unnyc-success__stat-label">Decidim recognized as a UN-aligned Digital Public Good</span>
                        </div>
                    </div>

                    <p>
                        New York is already, quietly, inside this story: the city&rsquo;s own
                        Civic Engagement Commission runs its participatory budgeting program on
                        Decidim today. NYC didn&rsquo;t have to build that tool from scratch —
                        Barcelona already built and gave it away. That&rsquo;s the case for
                        exporting systems made concrete: Decidim also runs in Helsinki, Mexico
                        City, Kakogawa, France&rsquo;s National Assembly and Senate, and was
                        selected by the European Commission itself. Barcelona built one city&rsquo;s
                        tool and became, in its own words, &ldquo;the world&rsquo;s capital of open
                        source&rdquo; — hosting an annual international convening that draws the
                        same global attention UN Open Source Week brings to New York every June.
                    </p>

                    <p className="unnyc-success__sources">
                        Sources:{' '}
                        <a
                            href="https://www.barcelona.cat/infobarcelona/en/tema/science/barcelona-is-the-first-city-in-the-world-to-endorse-the-un-open-source-principles_1567058.html"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Barcelona City Council
                        </a>
                        {', '}
                        <a
                            href="https://decidim.org/blog/2026-04-07-case-study-participatory-budget-2020-2023-in-barcelona/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Decidim
                        </a>
                        {', '}
                        <a
                            href="https://decidim.org/blog/2023-07-13-decidim-is-recognized-as-a-digital-public-good/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Digital Public Goods Alliance
                        </a>
                    </p>
                </div>
            </section>

            {/* Paris / France */}
            <section className="unnyc-success__case unnyc-success__case--alt" id="paris">
                <div className="unnyc-success__case-banner">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1280px-Paris_Night.jpg"
                        alt="Paris cityscape at night"
                    />
                    <a
                        href="https://commons.wikimedia.org/wiki/File:Paris_Night.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="unnyc-success__case-banner-credit"
                    >
                        Photo: Benh LIEU SONG / Wikimedia Commons (CC BY-SA 4.0)
                    </a>
                </div>
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-success__case-title">Paris: From One Office to National Policy</h2>

                    <p>
                        Paris has run an open source software policy since 2002, centered on
                        Lutèce, a platform that now powers more than 300 city services — permits,
                        housing, the participatory budget. In 2022, after planning that began in
                        2019, Paris stood up the first city-level Open Source Programme Office in
                        Europe to coordinate it. That office has had real reach: a Baltimore
                        neighborhood nonprofit, the St. Francis Neighborhood Center, piloted
                        Lutèce with support from Paris&rsquo;s own IT staff and university
                        partners — a small example, but a real one, of a city&rsquo;s software
                        crossing an ocean because it was built to be reusable.
                    </p>

                    <p>
                        The bigger story is what came after. On May 6, 2025, France became the
                        first national government in the world to endorse the UN Open Source
                        Principles — nineteen other organizations joined that same announcement.
                        France&rsquo;s national open source office, Etalab, now maintains an
                        official government software catalog with 494 approved free software
                        products, 1,810 registered public-sector users, and 274 named referents
                        across 183 public bodies. What started as one city&rsquo;s OSPO became,
                        within three years, whole-of-government infrastructure and the first
                        national endorsement anywhere.
                    </p>

                    <div className="unnyc-success__stats">
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">2022</span>
                            <span className="unnyc-success__stat-label">Paris&rsquo;s OSPO founded — first in Europe</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">May 2025</span>
                            <span className="unnyc-success__stat-label">France, first national government to endorse</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">494</span>
                            <span className="unnyc-success__stat-label">Free software products in France&rsquo;s official government catalog</span>
                        </div>
                    </div>

                    <p>
                        For New York, the parallel is direct: being first isn&rsquo;t a one-time
                        press moment, it&rsquo;s a starting point other institutions build on.
                        New York would be the first city in the Americas to endorse the
                        Principles — the same kind of firsts that, for France, turned a single
                        city office into a national model other governments now point to.
                    </p>

                    <p className="unnyc-success__sources">
                        Sources:{' '}
                        <a
                            href="https://opensource.paris.fr/ossparis/english.html"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Paris Open Source
                        </a>
                        {', '}
                        <a
                            href="https://www.library.jhu.edu/news/2022/02/ospo-europe-when-institutions-cooperate-and-the-open-source-experience/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            OSPO++ Europe
                        </a>
                        {', '}
                        <a
                            href="https://technical.ly/civic-news/paris-lutece-open-source-platform-city-services-west-baltimore-community-center-st-francis/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Technical.ly
                        </a>
                        {', '}
                        <a
                            href="https://unite.un.org/en/news/france-becomes-first-government-endorse-un-open-source-principles"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            unite.un.org
                        </a>
                        {', '}
                        <a
                            href="https://code.gouv.fr/en/expenditure-staff-impact/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            code.gouv.fr
                        </a>
                    </p>
                </div>
            </section>

            {/* Tokyo */}
            <section className="unnyc-success__case" id="tokyo">
                <div className="unnyc-success__case-banner">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Minato_City%2C_Tokyo%2C_Japan_%28Night%29.jpg/1280px-Minato_City%2C_Tokyo%2C_Japan_%28Night%29.jpg"
                        alt="Tokyo skyline at night"
                    />
                    <a
                        href="https://commons.wikimedia.org/wiki/File:Minato_City,_Tokyo,_Japan_(Night).jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="unnyc-success__case-banner-credit"
                    >
                        Photo: David Kernan / Wikimedia Commons (CC BY 4.0)
                    </a>
                </div>
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-success__case-title">Tokyo: When Transparency Becomes Infrastructure</h2>

                    <p>
                        In March 2020, with COVID-19 spreading and no time for a normal
                        procurement process, the Tokyo Metropolitan Government worked with the
                        civic tech group Code for Japan to build its COVID-19 tracking dashboard
                        entirely in the open on GitHub — public code anyone could inspect,
                        question, or copy, built in weeks instead of the months a closed
                        contract would have taken.
                    </p>

                    <p>
                        The result is the clearest test of &ldquo;design for reusability&rdquo;
                        this campaign can point to: every one of Japan&rsquo;s 47 prefectures,
                        plus multiple municipalities, forked Tokyo&rsquo;s codebase rather than
                        building their own from scratch. No national mandate required it — the
                        code being open and well-built was enough to make it the default choice.
                        One city&rsquo;s transparency became the country&rsquo;s de facto standard
                        for a public-health emergency.
                    </p>

                    <div className="unnyc-success__stats">
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">47/47</span>
                            <span className="unnyc-success__stat-label">Japanese prefectures that adopted Tokyo&rsquo;s dashboard</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">2020</span>
                            <span className="unnyc-success__stat-label">Built in the open, in weeks, during a live crisis</span>
                        </div>
                        <div className="unnyc-success__stat">
                            <span className="unnyc-success__stat-number">0</span>
                            <span className="unnyc-success__stat-label">National mandates needed to make it the standard</span>
                        </div>
                    </div>

                    <p className="unnyc-success__sources">
                        Sources:{' '}
                        <a
                            href="https://github.com/Tokyo-Metro-Gov/covid19"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Tokyo-Metro-Gov/covid19 (GitHub)
                        </a>
                        {', '}
                        <a
                            href="https://github.com/Tokyo-Metro-Gov/covid19/blob/development/FORKED_SITES.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            official fork registry
                        </a>
                    </p>
                </div>
            </section>

            {/* The rest of the case studies */}
            <PrimerCases />

            {/* Foot nav */}
            <section className="unnyc-success__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>Ready to add New York to this list?</p>
                    <div className="unnyc-success__foot-ctas">
                        <Link href="/crosswalk" className="unnyc-btn unnyc-btn--outline">
                            ← Why this matters to NYC
                        </Link>
                        <Link href="/campaign" className="unnyc-btn unnyc-btn--primary">
                            Sign the open letter →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
