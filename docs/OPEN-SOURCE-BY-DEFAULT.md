# When NYC Government Goes Open Source by Default

**Draft, 2026-08-07. Not published — a working document to circulate.** The
executive summary is the whole argument in one page; the full report below it
carries the evidence, the sourcing and the caveats, and is expected to grow.

Directional by design: it gives the sequence that follows an endorsement and what
each step unlocks, without asserting timelines the City has not agreed to.
Factual claims are sourced. Claims that are the campaign's judgement rather than
fact are labelled as such, in both halves.

---

# Executive summary

New York is asked to endorse the UN Open Source Principles. This document answers
the question that follows: **what happens the day after we sign.**

**Endorsement is** a public statement of how the city intends to build and buy
software. **It is not** a procurement overhaul, a migration, or a budget line.
Barcelona signed in a single day in November 2025 and is still building out what
it committed to.

Then, in order:

| # | Step | What it unlocks |
|---|---|---|
| 1 | **Keep building the capacity to build** — PIT Crew | The ability to *choose* open source, not only to ask for it |
| 2 | **Give it an owner** — an OSPO | Decisions made once, not agency by agency |
| 3 | **Inventory what the city already has** | A real picture — usually further along than anyone counted |
| 4 | **Ask the question at every contract expiry** | Change needing no new policy, on dates already in the calendar |
| 5 | **Then write it into new contracts** | Systems the city can move between vendors |
| 6 | **Contribute back to what it already runs on** | Influence over the software the city depends on |
| 7 | **Pursue strategically significant projects** | Solved problems that leave reusable components behind |
| 8 | **Collaborate globally, aim to lead** | Standing — a city others build on |

**Three things that make this credible:**

- **The capacity already exists.** PIT Crew is 30 staff across four crews on
  $5.24M baselined, with roughly 2,800 applicants. Step 1 is not "start" — it is
  "keep going." Everything below it is downstream.
- **Not renewing is easier than rewriting.** OTI's contracting identity holds
  1,381 contracts worth roughly $6.8 billion, every one with an end date.
  Declining a renewal needs no drafting, no legal review and no procurement
  change — only a question asked on a date already in the calendar.
- **The flagship already exists.** ACCESS NYC runs its eligibility logic on an
  open source rules engine and publishes the rules. Rules as code is an
  established international practice, and New York has one of the most complex
  benefits landscapes in the country already encoded.

**The smallest possible next step.** Those published ACCESS NYC rules carry **no
licence**, which means that legally nobody can reuse them — the city has done the
hard part and left the easy part undone. Applying a clear open licence costs
essentially nothing, converts an existing asset into a genuine public good, and
is the cleanest early test of whether any of this is real.

---

# Full report

## The question this answers

The campaign asks New York to endorse the UN Open Source Principles. The first
question anyone at OTI will reasonably ask is not *why* — the case for that is on
[/crosswalk](https://unnyc.wegov.nyc/crosswalk) — but **what happens the day
after we sign.**

If the honest answer were "a great deal, quickly, and expensively," the ask would
deserve to fail. It isn't. Endorsement is a signature and a direction of travel,
and the sequence that follows starts from something New York has already built.

## What endorsement is, and what it is not

**It is:** a public statement that the city intends to build and buy software the
way the UN system has agreed to — open by default, contributed back to, secure by
design, documented, reusable, sustained, and built with the people who use it.

**It is not:** a procurement overhaul, a migration project, a mandate to rip out
working systems, or a commitment to a budget line. Barcelona, the first city in
the world to endorse, signed on 2 November 2025 and paired the signature with
three *forward* commitments it is still building out
([Barcelona City Council](https://www.barcelona.cat/infobarcelona/en/tema/science/barcelona-is-the-first-city-in-the-world-to-endorse-the-un-open-source-principles_1567058.html)).
The signature was immediate. The work was not, and was never claimed to be.

## The sequence

### 1. Keep building the capacity to build — PIT Crew

**Everything else here is downstream of this one.** A commitment to open source
by default is close to meaningless in an organisation that cannot build software
itself. Without in-house capacity, "open by default" degrades into asking vendors
to please open their code — a request the city has little leverage to make and no
ability to act on if refused. With it, open source becomes an option the city can
actually exercise: adopt something that already exists, extend it, and keep it.

New York has started. In July 2026 the Mayor and Chief Technology Officer Lisa
Gelobter, who serves as commissioner of OTI, launched the **Public Interest
Technology (PIT) Crew**, pairing product managers, designers, engineers, user
researchers and data experts with agencies to move from idea to launched tool in
months rather than years
([StateScoop](https://statescoop.com/nyc-technology-pit-crew-initiative-digital-services/)).
The city will hire
[**30 full-time employees across four crews, using $5.24 million in baselined
city funding**](https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/),
with a fifth crew supported by the Rockefeller Foundation expected to add at
least five more — five crews in total. The first is building a Click to Cancel
complaint portal with DCWP. Roughly
[**2,800 people applied**](https://www.amny.com/politics/mamdanis-tech-pit-crews-2800-applicanants/).
BetaNYC called it
["decades in the making"](https://www.beta.nyc/2026/07/13/decades-in-the-making-new-york-city-launches-its-pit-crew/).

That demand signal matters as much as the headcount: the constraint on public
interest technology in New York is not willingness to do the work.

**The campaign's position** — inference, not City policy — is that this capacity
should keep growing, and that endorsement is a reason to grow it. Thirty
technologists is a real start set against a technology estate the city contracts
out at a scale of billions (see step 4). Every later step in this document
assumes someone inside the city can read, run, fix and publish code.

*What this unlocks: the ability to choose open source at all, rather than only to
ask for it.*

### 2. Give it an owner — an OSPO

Capacity without coordination produces good isolated projects and no standard.
Every government that has made open source stick put a small coordinating team
behind it — an Open Source Programme Office. Paris stood up Europe's first
city-level OSPO in 2022
([Paris Open Source](https://opensource.paris.fr/ossparis/english.html)); Munich
created one by City Council motion in 2023 under a "public money, public code"
mandate ([opensource.muenchen.de](https://opensource.muenchen.de/ospo.html));
Barcelona committed to one alongside its endorsement.

An OSPO is a coordinating function, not a new agency: it decides what the city
uses, what it publishes, how it contributes back, and how it stays secure while
doing so. **The campaign's position** — again inference — is that OTI is the
natural host, since it already coordinates technology citywide and now houses
PIT Crew.

*What this unlocks: somewhere for every decision below to be made once, rather
than agency by agency.*

### 3. Inventory what the city already has

An OSPO cannot organise or support what it cannot see. The third step is an
inventory of the open source already in and around city government:

- code city agencies already publish (several do, on their own initiative);
- open source components inside systems the city has built;
- open source the city depends on but does not maintain — including software it
  already pays subscription and support fees for, which is common and is a
  reminder that open source is unlocked, not unpaid;
- open source the city runs but did not write, such as the participation platform
  behind its participatory budgeting programme.

The inventory is cheap relative to what it reveals, and it is a precondition for
both procurement steps that follow: you cannot judge a contract against
"open by default" without knowing what the city already has, already relies on,
and would be re-buying.

*What this unlocks: a real picture — and usually the discovery that the city is
further along than anyone had counted.*

### 4. Ask the question at every contract expiry

**This is the cheapest real change available, and it is easier than the step
after it.** Writing new terms into future solicitations requires drafting, legal
review and procurement change. *Not renewing* requires none of that. A renewal is
a decision point that already exists, on a date already in the calendar. The only
new thing is a question asked at that moment: *does renewing this align with open
by default, or is there now an open, reusable option the city could own instead?*

The scale is knowable, because every contract carries an end date. The
procurement records for OTI's contracting identity alone — it appears in the
data under its predecessor name, the Department of Information Technology and
Telecommunications — run to **1,381 contracts worth roughly $6.8 billion**,
averaging about $4.9 million each. Renewals are visible as renewals; a substantial
share of software and licence contracts are explicitly titled as one.

Most answers will be "renew" — and that is fine. The value is that the question
gets asked at all, on a schedule the city already keeps, and that the exceptions
become visible. Set against the Comptroller's finding of
[nearly $4 billion spent beyond the estimated value of OTI's citywide IT contracts](https://comptroller.nyc.gov/reports/the-monty-hall-contracts-unchecked-spending-across-the-citys-master-agreements/),
with purchase records that reveal almost nothing about what was bought, a
recurring review is overdue on its own merits.

**This step is the campaign's proposal, not existing City practice.** The
underlying contract data is public; [Databook](https://databook.nyc/) is one place
the expiry list can be generated without waiting on anyone.

*What this unlocks: change that needs no new policy — only a question asked on
dates that already exist.*

### 5. Then write it into what the city buys

Having asked the question at expiry, the city will know which clauses actually
matter. That is the right moment to write them into new solicitations rather than
before: a preference for open standards and open source, requirements that data
stays portable and formats documented, and terms that let a future administration
change providers without rebuilding from scratch.

As one of the largest municipal technology buyers in the country, the standards
New York writes into its solicitations ripple through the vendor market well
beyond the five boroughs.

*What this unlocks: a slow benefits portal or a broken permit form can be handed
to a different vendor, or rebuilt in-house, instead of the city being locked to
whoever won the original contract.*

### 6. Contribute back to what the city already runs on

This has the shortest path to a visible result, because the case already exists.
New York's Civic Engagement Commission runs the city's participatory budgeting
programme on **Decidim** — the open source platform Barcelona built and gave
away, which also runs in Helsinki, Mexico City, and France's National Assembly.

New York is already a beneficiary. With capacity (step 1) and an owner (step 2),
contributing fixes and features upstream becomes straightforward, strengthens a
tool the city depends on today, and gives it more influence over that software's
direction than any vendor relationship has offered.

*What this unlocks: the city stops being purely a consumer of the commons it
relies on.*

### 7. Pursue strategically significant projects

The steps so far are posture, plumbing and procurement. This is where the city
builds something — deliberately choosing projects that produce **reusable
building blocks**, not one-off applications, so each solved problem leaves behind
a component the next problem can use.

**The clearest candidate is rules as code, and New York has already started it.**

ACCESS NYC, the city's benefits eligibility screener, is not a form with a
lookup table behind it. Its eligibility logic runs on a rules engine — the open
source Drools platform — and the city publishes both the application
([CityOfNewYork/ACCESS-NYC](https://github.com/CityOfNewYork/ACCESS-NYC)) and the
rules themselves
([NYCOpportunity/ACCESS-NYC-Rules](https://github.com/NYCOpportunity/ACCESS-NYC-Rules)).
NYC Opportunity went further and exposed the engine as a public
[Benefits Screening API](https://digitalgovernmenthub.org/publications/access-nyc-benefits-screening-api/),
explicitly so other governments could use it. Both repositories were actively
maintained as of August 2026.

That is rules as code: policy expressed as executable, inspectable logic rather
than reimplemented by hand in every system that needs it. It is an international
practice with an existing commons — France's open source
[OpenFisca](https://openfisca.org/en/) engine is used by France, New Zealand,
Australia and Spain, and by Barcelona to tell residents what they are entitled
to. New York would not be inventing the category. It would be joining it with one
of the most complex benefits landscapes in the United States already encoded.

**The strategic move is to expand this into a citywide standard.** Any city
application where a deterministic rule decides an outcome — eligibility,
entitlement, fee schedules, licensing thresholds, penalty calculations — is a
candidate to run on shared, published rules instead of logic rebuilt per system.
Written once, inspectable by the public, reusable by every agency, and correct in
the same way everywhere.

**The campaign's position** — inference, and a pointed one — is that this is the
better foundation for the city's unified services portal than the path MyCity has
taken. MyCity launched in 2023 and drew a
[City Council oversight hearing in September 2024](https://council.nyc.gov/jennifer-gutierrez/2024/09/30/chair-jennifer-gutierrez-leads-key-oversight-hearing-on-mycity-portal-highlighting-delays-and-concerns-with-adams-administrations-flagship-initiative)
over delays and the absence of a clear roadmap, by which point the city had
registered 97 contracts across 32 vendors and spent more than $60 million. Set
beside a rules engine the city already owns, already publishes, and already
operates, the contrast is the whole argument of this document in one example.

**A concrete first move, costing almost nothing.** As of 7 August 2026, the
`ACCESS-NYC-Rules` repository contains no licence file, and the main ACCESS NYC
repository's `license.txt` is WordPress's, inherited from the platform rather
than chosen for the City's own code. Code published without a licence is not
open source — copyright defaults to all rights reserved, and reuse is legally
unclear. New York has therefore already done the hard part, publishing its
eligibility rules, while leaving the easy part undone. Applying a clear open
licence would convert an existing asset into a genuine public good, and it is
exactly the kind of thing an OSPO (step 2) and an inventory (step 3) exist to
catch.

*What this unlocks: solved problems that leave reusable components behind —
and one flagship the city can point at.*

### 8. Collaborate globally, and aim to be a leading contributor

The final step is a change in posture: from a city that hosts and consumes the
global open source commons to one that **contributes to and helps lead it**.

Three venues are already open to New York:

- **The UN.** Every June, UN Open Source Week brings more than 2,600 participants
  from over 120 countries to UN Headquarters — a subway ride from City Hall. New
  York currently hosts that gathering without participating in it.
- **The Open Government Partnership.** New York is not a candidate here; it is
  already a member, having
  [joined OGP Local in the 2024 cohort](https://www.opengovpartnership.org/members/new-york-city-usa/),
  with government contacts in the Mayor's Office and the Mayor's Office of
  Engagement. Its action plan is being co-created with civil society **now** —
  which makes it a live, concrete route for an open source commitment rather
  than a future ambition.
- **Practitioner networks** — the TODO Group for OSPOs, the Digital Public Goods
  Alliance for certifying what the city builds, and the rules-as-code community
  around OpenFisca and its equivalents.

The benefit runs both ways, and the outbound direction is the point. Paris's
Lutèce platform was piloted by a Baltimore neighbourhood nonprofit with support
from Paris's own IT staff; Barcelona's Decidim runs New York's own participatory
budgeting. Cities that publish good software acquire influence disproportionate
to their size, because other governments adopt what works and then help maintain
it.

**The ambition worth stating plainly:** that New York becomes a leading
contributor of technical solutions to the global public sector — a city other
governments build on, not only the city where the movement holds its annual
meeting. Step 7 is what makes that credible, because a leading contributor needs
something worth contributing.

*What this unlocks: standing. The city stops solving alone what dozens of
governments have already solved together — and starts solving things for them.*

## What could go wrong

An honest roadmap names its own failure modes.

- **A signature with no capacity behind it.** The most likely bad outcome is an
  endorsement announced into an organisation that still cannot build, where "open
  by default" becomes a preference nobody can act on. This is why capacity is
  step 1 and not step 5.
- **An OSPO with no authority.** A coordinating office that cannot influence
  procurement or agency practice produces documents, not defaults.
- **"Open source" read as "free."** It removes per-seat licensing, not the cost of
  maintenance — the city already pays support fees for open source it runs. A
  roadmap promising savings without funding upkeep produces abandoned systems and
  well-earned cynicism. UN Principle 8 is *sustain and scale*, and building blocks
  (step 7) raise the stakes rather than lowering them: a component several
  agencies depend on has to be somebody's ongoing job, not a launch.
- **Rules as code drifting from the rules.** Encoded eligibility logic is only
  trustworthy if the people who own the policy agree it says what the policy says,
  and keep agreeing as the policy changes. Without that loop, the city ends up
  with a fast, inspectable, confidently wrong answer — worse than a slow one,
  because it looks authoritative.
- **A "building block" nobody adopts.** A component is only reusable if a second
  team actually reuses it. If the rules engine serves one application forever, it
  is a good application and a failed standard.
- **Publishing without documenting.** Code released with thin documentation is
  technically open and practically unusable. Principle 6 exists because this is
  the common failure, not a hypothetical one.
- **Security theatre in reverse.** Opening code does not by itself make a system
  secure. NYC Cyber Command already runs a citywide
  [Vulnerability Disclosure Program](https://nyc.responsibledisclosure.com/hc/en-us);
  opening code makes that channel more useful, not redundant.

## How you would know it is working

Signals, not targets — the campaign is not in a position to set the City's
metrics:

- PIT Crew growing rather than holding at its first cohort.
- A named team whose job description includes open source across agencies.
- An inventory that exists, is current, and is public.
- **A clear open licence on the ACCESS NYC rules** — the smallest possible test of
  whether any of this is real.
- At least one contract expiry where the answer was "don't renew, we have an open
  option" — and the reasoning published.
- Open standards language appearing in new solicitations.
- One upstream contribution to software the city depends on.
- A second city application running on the same published rules, rather than
  reimplementing them.
- An open source commitment in New York's OGP action plan.
- Another government adopting something New York built — the real test of
  step 8.

## Sources and provenance

PIT Crew details are cited to amNY, StateScoop and BetaNYC rather than to the
[Mayor's Office announcement](https://www.nyc.gov/mayors-office/news/2026/07/mayor-mamdani-launches--public-interest-technology--pit--crew--t)
that carries them, because nyc.gov returns 403 to automated requests and the
figures could not be machine-verified there. The 30 staff / four crews /
$5.24 million figures were confirmed against amNY, which quotes them directly.
Contract counts and values are from NYC's public procurement records as surfaced
by [Databook](https://databook.nyc/). MyCity's 97 contracts / 32 vendors /
$60 million figures are from the
[September 2024 Council oversight hearing](https://council.nyc.gov/jennifer-gutierrez/2024/09/30/chair-jennifer-gutierrez-leads-key-oversight-hearing-on-mycity-portal-highlighting-delays-and-concerns-with-adams-administrations-flagship-initiative).
Facts about Barcelona, Paris and Munich come from the campaign's own sourced
pages — [/success](https://unnyc.wegov.nyc/success),
[/crosswalk](https://unnyc.wegov.nyc/crosswalk) and
[/resources](https://unnyc.wegov.nyc/resources).

The ACCESS NYC licensing observation was checked directly against the GitHub API
on 7 August 2026: `ACCESS-NYC-Rules` returns 404 for a licence and its file list
contains none, and `ACCESS-NYC`'s `license.txt` is WordPress's. **Both are easily
changed, and may have been by the time you read this — re-check before repeating
the claim.**

**Labelled as the campaign's judgement, not fact:** that PIT Crew capacity should
expand and that endorsement is a reason to expand it; that OTI is the natural
home for an OSPO; that contract-expiry review should become routine practice;
that expanding ACCESS NYC into a citywide rules-as-code standard is a better
foundation for unified services than MyCity's path; and the ordering of the eight
steps. The City may sequence differently, and a roadmap it writes itself will be
better than one written for it.

The MyCity comparison is a criticism of an approach, not of the people doing the
work, and it should be made that way in any room. The relevant claim is that
building on owned, published components beats assembling a portal from many
contracts — not that anyone acted in bad faith.

Contract figures are a snapshot and will move. No individual vendor or contract
is named here by choice — the argument is about a recurring decision point, not
about any particular supplier, and the underlying data is public for anyone who
wants to check it.

Link checks. Everything above returns 200 to an automated request except three
that return 403, which is common bot protection rather than evidence of a dead
link:

- `opengovpartnership.org` — **confirmed by loading it in a browser.** NYC's
  membership, the 2024 cohort, the ongoing co-creation process and the named
  government contacts were all read off the live page.
- `nyc.gov` (the PIT Crew release) — **not confirmed here**; its figures were
  verified against amNY instead, which quotes them directly.
- `nyc.responsibledisclosure.com` — **not confirmed here**; normal for a
  Zendesk-hosted help centre, and the same URL already cited on the live
  `/crosswalk` page.

## How this document grows

The report is expected to get longer; the executive summary is not. Keep the
summary at one page — if a new finding does not change the eight steps, the three
credibility points or the smallest next step, it belongs below the fold only.

Known gaps, roughly in order of how much they would strengthen the argument:

- **A worked contract-expiry example.** Step 4 argues the case in the abstract.
  One real expiring contract, with the open alternative named and the saving or
  capability gain estimated, would make it concrete. The data supports this; it
  needs the analysis doing.
- **What the inventory would actually find.** Step 3 asserts the city is further
  along than anyone has counted. A first pass across city GitHub organisations
  would turn that assertion into a number.
- **Rules as code, costed.** Step 7's case is strong on principle and thin on
  what expanding ACCESS NYC would take — people, time, which agencies first.
- **Other cities' failures, not only their wins.** Every case study here
  succeeded. Munich's earlier desktop-Linux retreat is the obvious counter-example
  the campaign should be able to discuss confidently rather than avoid.
- **What OTI already says it wants.** The argument would land harder quoted back
  in the administration's own language, from OTI's published strategy.
- **A named ask.** The document explains a sequence but never says who should do
  what next. Deliberate at this stage; it will need one before it goes to anybody.

When a step's evidence changes, update the summary table's "what it unlocks" line
in the same commit — a summary that drifts from the report is worse than no
summary.

## If this becomes a public page

Written as a repo document by choice. If published, the natural slot is between
[/success](https://unnyc.wegov.nyc/success) (what other cities won) and
[/campaign](https://unnyc.wegov.nyc/campaign) (sign) — the funnel currently jumps
from evidence straight to the ask without answering "and then what?".
Publishing means moving the prose into `content/*.md` and adding a route; see
[EDITING-CONTENT.md](EDITING-CONTENT.md). The executive summary would make a
strong page on its own, with the full report behind a link.
