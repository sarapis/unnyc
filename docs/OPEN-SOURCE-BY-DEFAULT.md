# When NYC Government Goes Open Source by Default

**Draft, 2026-08-07. Not published — a working document to circulate.** It is
deliberately directional: it gives the sequence of what follows an endorsement
and what each step unlocks, without asserting timelines the City has not agreed
to. Factual claims are sourced. Claims that are the campaign's judgement rather
than fact are labelled as such.

---

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

### 7. Fund maintenance, not just launches

Software built and then abandoned is the failure this principle exists to
prevent, and it is the predictable result of funding launches only. The proven
mechanism is a modest, dedicated maintenance fund: Germany's Sovereign Tech
Agency has invested over €24 million in 60+ critical open source components since
2022, and received nearly 500 applications seeking more than €114 million —
several times what it could fund ([Sovereign Tech Agency](https://www.sovereign.tech/)).

New York does not have to invent the scale. PIT Crew's baselined funding shows a
commitment of this order is a category of spending the city can already do. The
point is not to redirect that money, but that the precedent exists.

*What this unlocks: affordability that lasts — a Click to Cancel portal that still
works in five years, not only on launch day.*

### 8. Take the seat that already exists

Every June, UN Open Source Week brings more than 2,600 participants from over 120
countries to UN Headquarters — a subway ride from City Hall. New York currently
hosts that gathering without participating in it.

The practical benefit is access: to governments that have already solved problems
New York is about to meet, and to software they have built and tested. Paris's
Lutèce platform was piloted by a Baltimore neighbourhood nonprofit with support
from Paris's own IT staff. That is what the network membership actually buys.

*What this unlocks: the city stops solving alone what dozens of governments have
already solved together.*

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
  well-earned cynicism.
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
- At least one contract expiry where the answer was "don't renew, we have an open
  option" — and the reasoning published.
- Open standards language appearing in new solicitations.
- One upstream contribution to software the city depends on.
- NYC staff at UN Open Source Week as participants, not hosts.
- A second city in the Americas following, because New York went first.

## Sources and provenance

PIT Crew details are cited to amNY, StateScoop and BetaNYC rather than to the
[Mayor's Office announcement](https://www.nyc.gov/mayors-office/news/2026/07/mayor-mamdani-launches--public-interest-technology--pit--crew--t)
that carries them, because nyc.gov returns 403 to automated requests and the
figures could not be machine-verified there. The 30 staff / four crews /
$5.24 million figures were confirmed against amNY, which quotes them directly.
Contract counts and values are from NYC's public procurement records as surfaced
by [Databook](https://databook.nyc/). Facts about Barcelona, Paris, Munich and
the Sovereign Tech Agency come from the campaign's own sourced pages —
[/success](https://unnyc.wegov.nyc/success),
[/crosswalk](https://unnyc.wegov.nyc/crosswalk) and
[/resources](https://unnyc.wegov.nyc/resources).

**Labelled as the campaign's judgement, not fact:** that PIT Crew capacity should
expand and that endorsement is a reason to expand it; that OTI is the natural
home for an OSPO; that contract-expiry review should become routine practice; and
the ordering of the eight steps. The City may sequence differently, and a roadmap
it writes itself will be better than one written for it.

Contract figures are a snapshot and will move. No individual vendor or contract
is named here by choice — the argument is about a recurring decision point, not
about any particular supplier, and the underlying data is public for anyone who
wants to check it.

Every external link above returns 200 except two that return 403 to automated
requests and have not been confirmed in a browser here: `nyc.gov` (see above) and
`nyc.responsibledisclosure.com`, which is normal for a Zendesk-hosted help centre
and is the same URL already cited on the live `/crosswalk` page.

## If this becomes a public page

Written as a repo document by choice. If published, the natural slot is between
[/success](https://unnyc.wegov.nyc/success) (what other cities won) and
[/campaign](https://unnyc.wegov.nyc/campaign) (sign) — the funnel currently jumps
from evidence straight to the ask without answering "and then what?".
Publishing means moving the prose into `content/*.md` and adding a route; see
[EDITING-CONTENT.md](EDITING-CONTENT.md).
