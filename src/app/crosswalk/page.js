import Link from 'next/link';
import Image from 'next/image';
import '../primer.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import GlossaryTerm from '@/components/unnyc/primer/GlossaryTerm';
import { openSource } from '@/data/unnyc';

export const metadata = {
    title: 'Why Open Source Matters to NYC — UNNYC',
    description:
        'Why NYC’s reliance on proprietary vendor software costs the city, what endorsing the UN Open Source Principles would actually cost and fund, and how each of the eight principles lines up with the Mamdani administration’s own tech agenda.',
    openGraph: {
        title: 'Why Open Source Matters to NYC — UNNYC',
        description:
            'What vendor reliance costs the city, what endorsement would cost and fund, and how the UN Open Source Principles line up with the Mamdani administration’s own stated tech priorities — principle by principle.',
        type: 'article',
    },
};

/**
 * /crosswalk — "why this matters to NYC." The persuasive core of the
 * campaign: who pays for vendor reliance today, what endorsement would
 * actually cost and fund, then a principle-by-principle crosswalk between
 * the UN's agenda and NYC's reality. The gap-to-close block on each
 * principle draws on NYC's own tech agenda — PIT Crew, the Office of
 * Technology & Innovation, its affordability/trust/excellence themes — as
 * evidence of alignment, not as claims about what the administration
 * itself believes. This page's target reader is the administration, not an
 * individual resident.
 */
export default function CrosswalkPage() {
    return (
        <div className="unnyc-pr">
            <HeaderHeightVar />

            {/* Header */}
            <header className="unnyc-pr-cw__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-pr-cw__header-title">New York Runs on Software It Doesn&rsquo;t Control</h1>
                    <p className="unnyc-pr-cw__lede">
                        Who pays for vendor reliance today, what endorsing the UN Open Source
                        Principles would actually cost, and what{' '}
                        <a href="#open-by-default" className="unnyc-gloss__link">closing the gap</a>{' '}
                        on each of the eight principles would mean for the city.
                    </p>
                </div>
            </header>

            {/* Persuasive intro — the "meat" of the campaign */}
            <section className="unnyc-pr-why">
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-pr-why__heading">Who Pays for Vendor Reliance?</h2>
                    <p>
                        Every city agency runs on software, and today most of that software is
                        proprietary — owned, licensed, and controlled by a small number of large
                        vendors. Every year the city can&rsquo;t walk away from a contract without
                        rebuilding a system from zero, the vendor&rsquo;s negotiating position gets
                        stronger and the city&rsquo;s gets weaker. That cost doesn&rsquo;t disappear:
                        it shows up as licensing fees paid year after year with no ownership at the
                        end, renewals with no leverage, and public money that goes to a vendor&rsquo;s
                        shareholders instead of a neighborhood.
                    </p>
                    <p>
                        The New Yorkers who feel that reliance first aren&rsquo;t the ones with the
                        loudest voice in a budget hearing: they&rsquo;re the residents who depend most
                        on the systems that money should be improving, from a slow benefits portal an
                        agency can&rsquo;t change without paying a vendor for the privilege, to a small
                        business locked out of city data because it sits behind a system nobody outside
                        the vendor can touch. NYC is already working to build programs that escape the
                        costs of vendor reliance: the{' '}
                        <a
                            href="https://www.nyc.gov/mayors-office/news/2026/07/mayor-mamdani-launches--public-interest-technology--pit--crew--t"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Public Interest Technology (PIT) Crew
                        </a>, launched in July 2026 under Chief Technology Officer{' '}
                        <a href="https://en.wikipedia.org/wiki/Lisa_Gelobter" target="_blank" rel="noopener noreferrer">
                            Lisa Gelobter
                        </a>, exists specifically to build technology in-house rather than buy it off
                        the shelf. Alignment with the UN&rsquo;s Open Source Principles would
                        standardize that mission for NYC civic tech.
                    </p>

                    <h2 className="unnyc-pr-why__heading">What Would Endorsement Actually Cost?</h2>
                    <p>
                        Endorsing the UN Open Source Principles costs the city nothing directly —
                        it&rsquo;s a signature, the same one Barcelona signed in November 2025. What
                        follows costs real but modest money, and New York doesn&rsquo;t have to guess
                        what that looks like — it already budgeted for something comparable. The five
                        PIT Crews carry{' '}
                        <a
                            href="https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            $5.24 million in baselined city funding for four of them
                        </a>, with a fifth built through the Rockefeller Foundation via the
                        Mayor&rsquo;s Fund to Advance New York City. A comparable{' '}
                        <GlossaryTerm slug="ospo">Open Source Programme Office</GlossaryTerm> or
                        open-source maintenance fund would be a similarly modest,
                        already-proven-scale investment — not a new category of city spending, but the
                        same kind PIT Crew already represents.
                    </p>
                    <p>
                        The clearest outside evidence this is financially sound comes from Germany&rsquo;s{' '}
                        <a href="https://www.sovereign.tech/" target="_blank" rel="noopener noreferrer">
                            Sovereign Tech Agency
                        </a>, which has invested more than €24 million in over 60 critical open source
                        projects since 2022 — and received nearly 500 applications requesting more
                        than €114 million, several times what it could fund. That&rsquo;s a real,
                        oversubscribed market showing this kind of investment is not just affordable,
                        but in demand from the people who&rsquo;d actually use it to keep public
                        infrastructure working. And because open source software carries no per-seat
                        licensing fee, this kind of one-time public investment tends to replace a
                        recurring vendor bill — money the city currently pays out every year,
                        indefinitely, for permission to keep using its own systems.
                    </p>

                    <blockquote className="unnyc-pr-why__quote">
                        <p>
                            Barcelona framed its own endorsement in terms that echo NYC&rsquo;s own
                            civic tech mission: a &ldquo;desire to put technology in the hands of
                            citizens and reduce reliance on large tech companies,&rdquo; aiming for
                            technology &ldquo;in the hands of the citizens&rdquo; through &ldquo;a
                            collaborative model in which cities control their own data and
                            infrastructure.&rdquo;
                        </p>
                        <cite>
                            — Barcelona&rsquo;s endorsement of the UN Open Source Principles, as
                            reported by{' '}
                            <a href={openSource.barcelona.link} target="_blank" rel="noopener noreferrer">
                                the EU Open Source Observatory
                            </a>
                        </cite>
                    </blockquote>
                    <p>
                        Open source software solutions will redirect capacity and control that currently flow
                        to outside vendors toward the city and the residents it serves.
                    </p>
                </div>
            </section>

            {/* One section per principle */}
            <div className="unnyc-pr-cw">
                <section id="open-by-default" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ1.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">1. Open by Default</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #1 reverses the usual burden of proof:
                                instead of asking a team to justify why software should be open, it
                                asks them to justify why it should stay closed, with legitimate
                                exceptions for security, privacy, or licensing. New York already lives
                                by a version of this rule for data — the Open Data Law (Local Law 11
                                of 2012) requires city agencies to publish public data by default —
                                and a handful of agencies have taken the same approach with their own
                                code, publishing to GitHub on their own initiative. What&rsquo;s
                                missing is a citywide default that makes that the rule rather than a
                                matter of which agency happens to care.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                PIT Crew is already built to work this way: its first project, a{' '}
                                &ldquo;Click to Cancel&rdquo; complaint portal built with the Department
                                of Consumer and Worker Protection, is being developed in-house rather
                                than procured from a vendor — the administration&rsquo;s affordability
                                and excellence agenda in practice. Endorsing this principle would
                                formalize that instinct citywide: every PIT Crew build, and every
                                future city project, starting from the presumption that it&rsquo;s
                                open unless there&rsquo;s a real reason it can&rsquo;t be. For NYC,
                                that means the tools taxpayers already funded — a benefits calculator,
                                a 311 tracker, the next Click to Cancel — are auditable, reusable
                                across agencies, and fixable faster: extending the same in-house,
                                community-facing philosophy PIT Crew already embodies to every
                                project that follows it.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="contribute-back" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ2.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">2. Contribute Back</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #2 holds that institutions benefiting from
                                open source should be active participants in it, not just downstream
                                consumers — upstreaming fixes, publishing genuinely reusable tools, and
                                engaging the communities that maintain the software they depend on.
                                New York has a real track record here: NYC Planning Labs spent years
                                shipping open source mapping and civic tools in public, and other city
                                teams have published code and data pipelines that outside developers —
                                and other governments — have reused. What&rsquo;s been missing is the
                                policy and the plumbing to make that routine rather than dependent on
                                which team happens to take the initiative.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                Standardizing how city systems share data — common schemas, APIs,
                                interoperability — means what one PIT Crew builds for one agency
                                doesn&rsquo;t have to be rebuilt from scratch for the next. Endorsing
                                this principle turns that standard into policy: city-built tools get
                                published by default and can be picked up by the next agency or by the
                                civic tech groups already building on public data. For NYC, that
                                extends PIT Crew&rsquo;s affordability logic past a single agency —
                                money spent once, put to work everywhere the same problem shows up.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="secure-by-design" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ3.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">3. Secure by Design</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #3 treats security as a first-class
                                requirement, not a patch applied after launch — threat modeling before
                                code is written, dependencies kept current, and a public,
                                no-retaliation channel for outside researchers to report a flaw
                                responsibly. New York already runs a citywide{' '}
                                <a
                                    href="https://nyc.responsibledisclosure.com/hc/en-us"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Vulnerability Disclosure Program
                                </a>, coordinated by NYC Cyber Command, that gives researchers exactly
                                that channel for nyc.gov and cityofnewyork.us systems. What it
                                doesn&rsquo;t cover is the software itself: for the vendor-purchased
                                majority of city systems, the underlying code stays closed, so even
                                with a disclosure channel open, nobody outside the vendor can verify
                                how well-built the system was to begin with.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                Secure by design means the two working together — a way to report
                                problems, and code open enough that problems can be found before
                                they&rsquo;re exploited, not just after. PIT Crew&rsquo;s in-house
                                model is built for exactly this: code the city itself owns and
                                controls end-to-end, rather than a vendor&rsquo;s closed system the
                                city can audit only by policy, not by inspection. For NYC, that&rsquo;s
                                the difference between trusting a vendor&rsquo;s word on security and
                                being able to check the work — the kind of verifiable trust the
                                administration has made a defining theme of its tech agenda.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="foster-inclusion" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ4.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">4. Foster Inclusion</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #4 calls for deliberately building a broad,
                                diverse contributor base — welcoming first-time contributors,
                                documenting for non-experts, translating into the languages a
                                community speaks, and making sure the loudest voices in a project
                                aren&rsquo;t the only ones steering it. New York already has the raw
                                ingredients: a large, technically skilled, famously diverse population,
                                and civic tech groups like BetaNYC that have run open-data and
                                open-government meetups for years, independent of any city mandate.
                                What&rsquo;s missing is a formal bridge between that existing community
                                and city government&rsquo;s own software work.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                The administration has already opened one door:{' '}
                                <a
                                    href="https://www.amny.com/politics/mamdanis-tech-pit-crews-2800-applicanants/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PIT Crew&rsquo;s first hiring round drew nearly 2,800 applicants
                                </a>, a visible signal that New Yorkers want in on building the tools
                                their government uses. Endorsing this principle extends that same
                                invitation past a single hiring cycle: a published contributor guide,
                                city tools documented and translated into the languages New Yorkers
                                actually speak, and community contributions treated as a normal part
                                of how PIT Crew — and every agency after it — builds software. For
                                NYC, that&rsquo;s the trust the administration has named as a core
                                goal, earned the most direct way there is: letting residents see, and
                                help build, the software their government runs on.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="design-for-reusability" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ5.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">5. Design for Reusability</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #5 calls for software built to work across
                                platforms and contexts, so one government&rsquo;s solution becomes
                                every government&rsquo;s head start. For a city, procurement is where
                                this stops being philosophy and becomes leverage: the contracts NYC
                                signs decide whether its data stays portable, whether formats are
                                documented, and whether a future administration can switch providers
                                without rebuilding from scratch. As one of the largest municipal
                                technology buyers in the country, the standards NYC writes into its
                                solicitations ripple through the vendor market well beyond the five
                                boroughs.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                Standardizing the city&rsquo;s data plumbing — shared schemas, APIs,
                                interoperability, and service levels — across agencies is the concrete
                                version of this principle. A preference clause favoring open standards
                                and open source, paired with that standardization, shapes every system
                                the city buys for years afterward. For NYC, this extends the
                                affordability agenda to procurement itself: a slow benefits portal or a
                                broken permit form can be handed to a different vendor, or rebuilt by
                                the next PIT Crew, instead of the city being stuck for years with
                                whoever won the original contract.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="provide-documentation" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ6.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">6. Provide Documentation</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #6 treats documentation as a deliverable, not
                                an afterthought — reviewed and maintained alongside the code so someone
                                other than the original author can safely use, fix, or extend it. The
                                pattern is a familiar one in{' '}
                                <a
                                    href="https://www.cloudapper.ai/enterprise-ai/vendor-lock-in-legacy-system-modernization-how-enterprises-recreate-the-problem/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    large institutions buying software generally
                                </a>: vendor systems often ship with documentation that&rsquo;s thin,
                                outdated, or contractually restricted to the vendor&rsquo;s own staff,
                                so when a contract lapses or a key technologist moves on, institutional
                                knowledge of how a system actually works can leave with them.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                Requiring real documentation — plain-language, kept current, and owned
                                by the city rather than locked inside a vendor&rsquo;s support desk —
                                is a natural extension of what PIT Crew is already building toward:
                                technology the city owns and can keep building on. It&rsquo;s also the
                                standard NYC&rsquo;s own civic tech community has pointed to (
                                <a
                                    href="https://www.beta.nyc/2025/11/18/dear-mayor-elect-8-gov-tech-ideas/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    BetaNYC
                                </a>{' '}
                                put it plainly: &ldquo;adopt secure, reusable code citywide&rdquo;).
                                For NYC, that&rsquo;s the excellence the administration has named as
                                its standard — public-sector software that stays fixable and
                                explainable long after the team that built it moves on to the next
                                problem.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="rise" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ7.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">7. RISE</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #7 — Recognize, Incentivize, Support, and
                                Empower — holds that institutions should formally back the people
                                doing open source work, not leave it to individual initiative. The
                                mechanism other governments use is an{' '}
                                <GlossaryTerm slug="ospo">Open Source Programme Office</GlossaryTerm>: a
                                small coordinating team, not a new agency, that decides what an
                                organization uses, what it publishes, how it contributes back, and how
                                it stays secure while doing so.{' '}
                                <a
                                    href="https://opensource.muenchen.de/ospo.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Munich
                                </a>{' '}
                                runs one under a{' '}
                                <GlossaryTerm slug="public-money-public-code">
                                    &ldquo;public money, public code&rdquo;
                                </GlossaryTerm>{' '}
                                mandate, and{' '}
                                <a
                                    href={openSource.barcelona.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Barcelona
                                </a>{' '}
                                paired its UN endorsement with a commitment to create one. New
                                York&rsquo;s Office of Technology &amp; Innovation, which already
                                coordinates technology citywide, is the natural host for one too.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                An Open Source Programme Office would be the natural next chapter of
                                the strategy PIT Crew already represents: real teams, real funding, and
                                public interest technology built in-house. PIT Crew shows what that
                                office would formalize — giving{' '}
                                <a href="https://en.wikipedia.org/wiki/Lisa_Gelobter" target="_blank" rel="noopener noreferrer">
                                    Lisa Gelobter&rsquo;s
                                </a>{' '}
                                office a permanent, citywide mandate for exactly the kind of work
                                it&rsquo;s already doing, rather than five crews at a time.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="sustain-and-scale" className="unnyc-pr-cw__section">
                    <div className="unnyc-container unnyc-container--narrow">
                        <div className="unnyc-pr-cw__heading">
                            <Image src="/principle-icons/princ8.png" alt="" width={40} height={40} className="unnyc-pr-cw__icon" />
                            <h2 className="unnyc-pr-cw__title">8. Sustain and Scale</h2>
                        </div>
                        <div className="unnyc-pr-cw__part">
                            <p>
                                UN Open Source Principle #8 calls for solutions that meet evolving
                                needs over time — funded and maintained for the long run, not
                                abandoned after launch. New York&rsquo;s question isn&rsquo;t whether
                                it has{' '}
                                <GlossaryTerm slug="dpi">digital public infrastructure</GlossaryTerm>;
                                any large resident-facing platform is infrastructure in effect. The
                                question is whether it&rsquo;s built on open, reusable,
                                standards-based components the city can sustain indefinitely, or on
                                closed ones it can&rsquo;t maintain without the original vendor.
                            </p>
                        </div>
                        <div className="unnyc-pr-cw__part unnyc-pr-cw__part--gap">
                            <h4 className="unnyc-pr-cw__part-label unnyc-pr-cw__part-label--gap">The Gap to Close</h4>
                            <p>
                                The mechanism other governments use to fund this is a modest, dedicated
                                pool of money — modeled on Germany&rsquo;s{' '}
                                <a href="https://www.sovereign.tech/" target="_blank" rel="noopener noreferrer">
                                    Sovereign Tech Agency
                                </a>, which has put over €24 million into keeping critical open source
                                infrastructure maintained, with nearly 500 applications requesting
                                over €114 million — several times what it could fund. New York
                                doesn&rsquo;t have to invent this from scratch: the city already found{' '}
                                <a
                                    href="https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    $5.24 million in baselined funding
                                </a>{' '}
                                for four PIT Crews, plus a fifth built with Rockefeller Foundation
                                support — the same modest, sustained funding model this principle
                                calls for, already in motion. For NYC, sustaining the systems PIT Crew
                                builds is what makes affordability durable rather than a one-time
                                announcement: a Click to Cancel portal, or whatever comes after it,
                                that keeps working in five years, not just on launch day.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Closing — why NYC is central to the movement */}
            <section className="unnyc-pr-cw__closing">
                <div className="unnyc-container unnyc-container--narrow">
                    <h2 className="unnyc-pr-cw__closing-title">
                        Why New York Is Central to This Movement
                    </h2>
                    <p>
                        Every June, UN Open Source Week brings more than 2,600 participants from over
                        120 countries to UN Headquarters — in New York City. The Global Digital
                        Compact, adopted by member states in 2024, gives that gathering a shared
                        vocabulary: digital public goods, digital public infrastructure, open
                        standards. It is, in effect, a standing global table on public-interest
                        technology, convened a subway ride from City Hall, at which New York is
                        currently a host but not a participant.
                    </p>
                    <p>
                        New York has a distinctive habit of being first to this kind
                        of table on its own: it was the first U.S. city to submit a Voluntary Local
                        Review of its Sustainable Development Goal progress to the UN, in 2018, and
                        the first U.S. city to join the UN&rsquo;s Safe Cities initiative. Endorsing
                        the UN Open Source Principles is the same move, applied to technology.
                    </p>
                    <p>
                        No city in the Americas has yet endorsed the Principles. New York is the natural candidate to be first — gaining access
                        to a global community of practice, to solutions other governments have already
                        built and battle-tested, and to the contacts who can help it adopt them. New
                        York&rsquo;s own civic tech mission — building in-house, rejecting mediocrity,
                        putting affordability and trust first — already lines up with these principles.
                        Endorsing them is a low-cost way to say so
                        on a global stage.
                    </p>
                </div>
            </section>

            {/* Foot nav */}
            <section className="unnyc-pr-cw__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>Convinced? Here&rsquo;s what it&rsquo;s already won other cities.</p>
                    <div className="unnyc-pr-cw__foot-ctas">
                        <Link href="/start" className="unnyc-btn unnyc-btn--outline">
                            ← New to government open source?
                        </Link>
                        <Link href="/success" className="unnyc-btn unnyc-btn--primary">
                            See what success looks like →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
