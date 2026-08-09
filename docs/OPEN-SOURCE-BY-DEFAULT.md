# When NYC Government Goes Open Source by Default

**Draft, 2026-08-07. Not published — a working document to circulate.** It is
deliberately directional: it describes the sequence of what follows an
endorsement and what each step unlocks, without asserting timelines the City has
not agreed to. Every factual claim about another government is sourced; every
claim about New York is either sourced or marked as the campaign's inference.

---

## The question this answers

The campaign asks New York to endorse the UN Open Source Principles. The first
question any official at OTI will reasonably ask is not *why* — the case for
that is on [/crosswalk](https://unnyc.wegov.nyc/crosswalk) — but **what happens
the day after we sign.**

If the honest answer were "a great deal, quickly, and expensively," the ask would
deserve to fail. It isn't. Endorsement is a signature and a direction of travel.
What follows is a sequence the city can walk at its own pace, and most of the
early steps formalize things New York already does.

## What endorsement is, and what it is not

**It is:** a public statement that the city intends to build and buy software the
way the UN system has agreed to — open by default, contributed back to, secure by
design, documented, reusable, sustained, and built with the people who use it.

**It is not:** a procurement overhaul, a migration project, a mandate to rip out
working systems, or a commitment to a budget line. Barcelona, the first city in
the world to endorse, did so on 2 November 2025 and paired the signature with
three *forward* commitments it is still building out
([Barcelona City Council](https://www.barcelona.cat/infobarcelona/en/tema/science/barcelona-is-the-first-city-in-the-world-to-endorse-the-un-open-source-principles_1567058.html)).
The signature was immediate. The work was not, and was never claimed to be.

This distinction is the single most important thing to communicate to a
skeptical commissioner. The risk of endorsing is low precisely because
endorsement commits the city to a *posture*, and the posture is one New York's
own technology agenda already describes.

## The sequence

### 1. Name where it lives

Nothing else works without an owner. Every government that has made this stick
put a small coordinating team behind it — an Open Source Programme Office. Paris
stood up the first city-level OSPO in Europe in 2022
([Paris Open Source](https://opensource.paris.fr/ossparis/english.html)); Munich
created one by City Council motion in 2023 under a "public money, public code"
mandate ([opensource.muenchen.de](https://opensource.muenchen.de/ospo.html));
Barcelona committed to one alongside its endorsement.

An OSPO is a coordinating function, not a new agency. It decides what the city
uses, what it publishes, how it contributes back, and how it stays secure while
doing so. **The campaign's position is that NYC's Office of Technology &
Innovation is the natural host**, since it already coordinates technology
citywide — that is an inference from OTI's remit, not a commitment anyone at OTI
has made.

What this unlocks: everything below has somewhere to be decided.

### 2. Make "open by default" an actual default

New York already lives by this rule for *data*. The Open Data Law (Local Law 11
of 2012) requires agencies to publish public data by default, and it is one of
the strongest such laws in the country. A handful of agencies already publish
code to GitHub on their own initiative.

The gap is that publishing code is a matter of which agency happens to care.
Closing it means the burden of proof flips: teams justify why a system should
stay closed, rather than why it should be opened.

What this unlocks: the tools taxpayers already funded become auditable, reusable
between agencies, and fixable by more than one vendor.

### 3. Write it into what the city buys

For a city, procurement is where this stops being philosophy. The contracts New
York signs decide whether its data stays portable, whether formats are
documented, and whether a future administration can change providers without
rebuilding from scratch.

This is also where the cost argument lands. The Comptroller's 2026 review of the
city's master agreements found **nearly $4 billion spent beyond the estimated
value of OTI's citywide IT contracts**, with purchase records that reveal almost
nothing about what was actually bought
([Monty Hall Contracts](https://comptroller.nyc.gov/reports/the-monty-hall-contracts-unchecked-spending-across-the-citys-master-agreements/)).
A preference for open standards and open source, written into solicitations, is
the highest-leverage clause the city's buyers control.

What this unlocks: a slow benefits portal or a broken permit form can be handed
to a different vendor, or rebuilt in-house, instead of the city being locked to
whoever won the original contract.

### 4. Contribute back to what the city already runs on

This is the step with the shortest path to a real result, because the case
already exists. New York's Civic Engagement Commission runs the city's
participatory budgeting programme on **Decidim** — the open source platform
Barcelona built and gave away, which also runs in Helsinki, Mexico City, and
France's National Assembly.

New York is already a beneficiary. Contributing fixes and features upstream would
strengthen a tool the city depends on today, and would give it more influence
over that software's direction than any vendor relationship has ever offered.

What this unlocks: the city stops being purely a consumer of the commons it
relies on — and gains a seat in deciding where that software goes.

### 5. Fund maintenance, not just launches

Software that is built and then abandoned is the failure mode this principle
exists to prevent. The proven mechanism is a modest, dedicated maintenance fund.
Germany's Sovereign Tech Agency has invested over €24 million in 60+ critical
open source components since 2022, and received nearly 500 applications seeking
more than €114 million — several times what it could fund
([Sovereign Tech Agency](https://www.sovereign.tech/)).

New York does not have to invent the scale. It has already committed comparable
money to public-interest technology: five PIT Crews, with
[$5.24 million in baselined funding for four of them](https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/)
and a fifth built with Rockefeller Foundation support. The point is not that PIT
Crew money should be redirected — it is that a fund of this order is a category
of spending the city has already shown it can do.

What this unlocks: affordability that lasts. A Click to Cancel portal that still
works in five years, not only on launch day.

### 6. Take the seat that already exists

Every June, UN Open Source Week brings more than 2,600 participants from over 120
countries to UN Headquarters — a subway ride from City Hall. New York currently
hosts that gathering without participating in it.

Endorsement changes that standing, and the practical benefit is access: to
governments that have already solved problems New York is about to encounter, and
to software they have already built and tested. Paris's Lutèce platform was
piloted by a Baltimore neighbourhood nonprofit with support from Paris's own IT
staff. That is what a network membership actually buys.

What this unlocks: the city stops solving alone what dozens of governments have
already solved together.

## What could go wrong

An honest roadmap names its own failure modes.

- **A signature with no owner.** The most likely bad outcome is not backlash but
  inertia — an endorsement that is announced and then belongs to nobody. This is
  what step 1 exists to prevent.
- **"Open source" used as a synonym for "free."** It is not. It removes per-seat
  licensing, not the cost of maintenance, and a roadmap that promises savings
  without funding upkeep will produce abandoned systems and justified cynicism.
- **Publishing without documenting.** Code released with thin or absent
  documentation is technically open and practically unusable. Principle 6 exists
  because this is the common failure, not a hypothetical one.
- **Security theatre in reverse.** Opening code does not by itself make a system
  secure. NYC Cyber Command already runs a citywide
  [Vulnerability Disclosure Program](https://nyc.responsibledisclosure.com/hc/en-us);
  opening code makes that channel more useful, not redundant.

## How you would know it is working

Signals, not targets — the campaign is not in a position to set the City's
metrics:

- A named team, in OTI or elsewhere, whose job description includes this.
- City repositories that accept outside contributions, and merge some.
- At least one upstream contribution to software the city depends on — Decidim
  is the obvious first candidate.
- Open standards language appearing in solicitations.
- NYC staff in the room at UN Open Source Week as participants, not hosts.
- A second city in the Americas following, because New York went first.

## Sources and provenance

Facts about Barcelona, Paris, Munich, Tokyo, Germany's Sovereign Tech Agency and
the UN Principles are drawn from the campaign's own sourced pages —
[/success](https://unnyc.wegov.nyc/success),
[/crosswalk](https://unnyc.wegov.nyc/crosswalk) and
[/resources](https://unnyc.wegov.nyc/resources) — where each carries its
citation. NYC-specific claims are cited inline above.

Marked as inference, not fact: that OTI is the natural home for an NYC OSPO, and
the ordering of the six steps. Both are the campaign's judgement. The city may
sequence differently, and a roadmap it writes itself will be a better roadmap
than one written for it.

Every external link above returns 200 except
`nyc.responsibledisclosure.com`, which returns 403 to automated requests — normal
for a Zendesk-hosted help centre, and it is the same URL already cited on the
live `/crosswalk` page. It has not been confirmed in a browser here.

## If this becomes a public page

It was written as a repo document by choice. If it is later published, the
natural slot is between [/success](https://unnyc.wegov.nyc/success) (what other
cities won) and [/campaign](https://unnyc.wegov.nyc/campaign) (sign) — the
funnel currently jumps from evidence straight to the ask without answering
"and then what?". Publishing means moving the prose into `content/*.md` and
adding a route; see [EDITING-CONTENT.md](EDITING-CONTENT.md).
