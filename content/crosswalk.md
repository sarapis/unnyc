---
title: "New York Runs on Software It Doesn’t Control"
lede: "Who pays for vendor reliance today, what endorsing the UN Open Source Principles would actually cost, and what [closing the gap](#open-by-default) on each of the eight principles would mean for the city."
meta:
  title: "Open Source for NYC: Why It Matters — UNNYC"
  description: "Why NYC’s reliance on proprietary vendor software costs the city, what endorsing the UN Open Source Principles would actually cost and fund, and how each of the eight principles lines up with the Mamdani administration’s own tech agenda."
  ogTitle: "Open Source for NYC: Why It Matters — UNNYC"
  ogDescription: "What vendor reliance costs the city, what endorsement would cost and fund, and how the UN Open Source Principles line up with the Mamdani administration’s own stated tech priorities — principle by principle."
principles:
  - slug: open-by-default
    icon: 1
    number: 1
    title: "Open by Default"
  - slug: contribute-back
    icon: 2
    number: 2
    title: "Contribute Back"
  - slug: secure-by-design
    icon: 3
    number: 3
    title: "Secure by Design"
  - slug: foster-inclusion
    icon: 4
    number: 4
    title: "Foster Inclusion"
  - slug: design-for-reusability
    icon: 5
    number: 5
    title: "Design for Reusability"
  - slug: provide-documentation
    icon: 6
    number: 6
    title: "Provide Documentation"
  - slug: rise
    icon: 7
    number: 7
    title: "RISE"
  - slug: sustain-and-scale
    icon: 8
    number: 8
    title: "Sustain and Scale"
closingTitle: "Why New York Is Central to This Movement"
foot:
  text: "Convinced? Here’s what it’s already won other cities."
  ctas:
    - href: /start
      label: "← New to government open source?"
      style: outline
    - href: /success
      label: "See what success looks like →"
      style: primary
---

<!-- Prose below. `## <slug>` starts a section; `### The Gap to Close`
     marks the gap block inside a principle. Links are normal markdown;
     `[text](gloss:ospo)` renders as a glossary term. -->

## intro

### Who Pays for Vendor Reliance?

Every city agency runs on software, and the vast majority of it is proprietary, meaning that it is owned, licensed, and controlled by a very small number of very large vendors. This leaves the city and its residents reliant on the vendors to maintain and secure the software they need, because walking away would mean having to rebuild that system from zero. Every year the vendor’s negotiating position strengthens whilst the city’s weakens, and the cost shows up as licensing fees paid year after year with no ownership at the end, renewals with no leverage to force bug fixes or vulnerabilities, and public money that goes to a vendor’s shareholders instead of a neighborhood.

The New Yorkers who feel that reliance first aren’t the ones with the loudest voice in a budget hearing: they’re the residents who depend most on the systems that money should be improving, from a slow benefits portal an agency can’t change without paying a vendor for the privilege, to a small business locked out of city data because it sits behind a system nobody outside the vendor can touch. NYC is already working to build programs that escape the costs of vendor reliance, and aligning with the UN’s Open Source Principles would standardize that mission for NYC civic tech.

### What Would Endorsement Actually Cost?

Endorsing the UN Open Source Principles costs the city nothing directly — it’s a signature, the same one Barcelona signed in November 2025. What follows costs real but modest money, and New York doesn’t have to guess what that looks like — it already budgeted for something comparable. The five PIT Crews carry [$5.24 million in baselined city funding for four of them](https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/), with a fifth built through the Rockefeller Foundation via the Mayor’s Fund to Advance New York City. A comparable [Open Source Programme Office](gloss:ospo) or open-source maintenance fund would be a similarly modest, already-proven-scale investment — not a new category of city spending, but the same kind PIT Crew already represents.

The clearest outside evidence this is financially sound comes from Germany’s [Sovereign Tech Agency](https://www.sovereign.tech/), which has invested more than €24 million in over 60 critical open source projects since 2022 — and received nearly 500 applications requesting more than €114 million, several times what it could fund. That’s a real, oversubscribed market showing this kind of investment is not just affordable, but in demand from the people who’d actually use it to keep public infrastructure working. And because open source software carries no per-seat licensing fee, this kind of one-time public investment tends to replace a recurring vendor bill — money the city currently pays out every year, indefinitely, for permission to keep using its own systems. By contrast, New York’s own [CityTime payroll system](https://www.nyc.gov/assets/doi/downloads/pdf/mar12/pr92_12%20_citytimesettlement__2.pdf) — a single vendor contract gone wrong — ballooned from a $63 million no-bid deal into more than $700 million in costs and fraud, exactly the kind of risk vendor reliance carries that a modest, proven-scale investment like this does not.

> Barcelona framed its own endorsement in terms that echo NYC’s own civic tech mission: a “desire to put technology in the hands of citizens and reduce reliance on large tech companies,” aiming for technology “in the hands of the citizens” through “a collaborative model in which cities control their own data and infrastructure.”
>
> — Barcelona’s endorsement of the UN Open Source Principles, as reported by [the EU Open Source Observatory](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/barcelona-first-city-globally-adopt-un-open-source-principles)

Open source software solutions will redirect capacity and control that currently flow to outside vendors toward the city and the residents it serves.

## open-by-default

UN Open Source Principle #1 reverses the usual burden of proof: instead of asking a team to justify why software should be open, it asks them to justify why it should stay closed. New York already lives by a version of this rule for data — the Open Data Law (Local Law 11 of 2012) requires city agencies to publish public data by default — and a handful of agencies have taken the same approach with their own code, publishing to GitHub on their own initiative. What’s missing is a citywide default that makes that the rule rather than a matter of which agency happens to care.

### The Gap

Endorsing this principle would formalize that instinct for code. For NYC, that means the tools taxpayers already funded — a benefits calculator, a 311 tracker, the next Click to Cancel — are auditable and reusable across agencies, and fixable faster. NYC is already a hub for talented developers who care about the welfare of their city; and endorsment of this principle provides a path for them to put their skills to work.

## contribute-back

Open source tools are built on a foundation of reciprocity; UN Open Source Principle #2 holds that institutions benefiting from open source should be active participants in it by upstreaming fixes, publishing genuinely reusable tools, and engaging the communities that maintain the software they depend on. Indeed, all software is built in part on open source tooling, and it is standard for large software companies to run their own OSPOs where employees dedicate some of their working time contributing back to the projects they depend on. That may sound like an ulikely stroke of altruism, but contributing is their self-interest because it allows them to influence the direction of the project and make it work best for their own products. NYC could be doing the same.

### The Gap

Endorsing this principle would commit the city to actively contributing to the open source projects it utilizes, giving it more power to influence the software products it relies than has ever been granted through vendor reliance. New York already has a stake in this: its own Civic Engagement Commission runs the city’s participatory budgeting program on Decidim, the open source platform built by Barcelona, so contributing fixes and features back would directly strengthen a tool NYC already depends on today.

## secure-by-design

UN Open Source Principle #3 treats security as a first-class requirement, not a patch applied after launch, and in fact is actually more secure than closed systems. This is because open source software allows for greater transparency and community review, which can help identify and fix security vulnerabilities more quickly. Threat modeling before code is written, keeping dependencies current, and providing a public, no-retaliation channel for outside researchers to report flaws responsibly are all part of this approach. New York already runs a citywide [Vulnerability Disclosure Program](https://nyc.responsibledisclosure.com/hc/en-us), coordinated by NYC Cyber Command, that gives researchers exactly that channel for nyc.gov and cityofnewyork.us systems. What it doesn’t cover is the software itself: for the vendor-purchased majority of city systems, the underlying code stays closed, so even with a disclosure channel open, nobody outside the vendor can verify how well-built the system was to begin with.

### The Gap

Endorsing this principle means that in addition to providing a way to report problems, the code is open enough that problems can be found before they’re exploited. Code the city itself owns and controls end-to-end, rather than a vendor’s closed system the city can audit only by policy, not by inspection. Instead of trusting a vendor’s word on security, NYC can check the work — the kind of verifiable trust the administration has made a defining theme of its tech agenda.

## foster-inclusion

UN Open Source Principle #4 calls for deliberately building a broad, diverse contributor base — welcoming first-time contributors, documenting for non-experts, translating into the languages a community speaks, and making sure the loudest voices in a project aren’t the only ones steering it. New York already has a large, technically skilled, famously diverse population, and civic tech groups like BetaNYC that have run open-data and open-government meetups for years, independent of any city mandate. [PIT Crew’s first hiring round drew nearly 2,800 applicants](https://www.amny.com/politics/mamdanis-tech-pit-crews-2800-applicanants/), a visible signal that New Yorkers want in on building the tools their government uses. However, there is no formal bridge between that existing community and city government’s own software.

### The Gap

Endorsing this principle extends that same invitation past a single hiring cycle: a published contributor guide, city tools documented in multiple languages, and community contributions treated as a normal part of how NYC builds software. That’s the trust the administration has named as a core goal, earned the most direct way there is: letting residents see, and help build, the software their government runs on.

## design-for-reusability

UN Open Source Principle #5 calls for software built to work across platforms and contexts, so one government’s solution becomes every government’s head start. For a city, procurement is where this stops being philosophy and becomes leverage: the contracts NYC signs decide whether its data stays portable, whether formats are documented, and whether a future administration can switch providers without rebuilding from scratch. As one of the largest municipal technology buyers in the country, the standards NYC writes into its solicitations ripple through the vendor market well beyond the five boroughs.

### The Gap to Close

Standardizing the city’s data plumbing — shared schemas, APIs, interoperability, and service levels — across agencies is the concrete version of this principle. A preference clause favoring open standards and open source, paired with that standardization, shapes every system the city buys for years afterward. For NYC, this extends the affordability agenda to procurement itself: a slow benefits portal or a broken permit form can be handed to a different vendor, or rebuilt by the next PIT Crew, instead of the city being stuck for years with whoever won the original contract.

## provide-documentation

UN Open Source Principle #6 treats documentation as a deliverable, not an afterthought — reviewed and maintained alongside the code so someone other than the original author can safely use, fix, or extend it. The pattern is a familiar one in [large institutions buying software generally](https://www.cloudapper.ai/enterprise-ai/vendor-lock-in-legacy-system-modernization-how-enterprises-recreate-the-problem/): vendor systems often ship with documentation that’s thin, outdated, or contractually restricted to the vendor’s own staff, so when a contract lapses or a key technologist moves on, institutional knowledge of how a system actually works can leave with them.

### The Gap to Close

Requiring real documentation — plain-language, kept current, and owned by the city rather than locked inside a vendor’s support desk — is a natural extension of what PIT Crew is already building toward: technology the city owns and can keep building on. It’s also the standard NYC’s own civic tech community has pointed to ( [BetaNYC](https://www.beta.nyc/2025/11/18/dear-mayor-elect-8-gov-tech-ideas/) put it plainly: “adopt secure, reusable code citywide”). For NYC, that’s the excellence the administration has named as its standard — public-sector software that stays fixable and explainable long after the team that built it moves on to the next problem.

## rise

UN Open Source Principle #7 — Recognize, Incentivize, Support, and Empower — holds that institutions should formally back the people doing open source work, not leave it to individual initiative. The mechanism other governments use is an [Open Source Programme Office](gloss:ospo): a small coordinating team, not a new agency, that decides what an organization uses, what it publishes, how it contributes back, and how it stays secure while doing so. [Munich](https://opensource.muenchen.de/ospo.html) runs one under a [“public money, public code”](gloss:public-money-public-code) mandate, and [Barcelona](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/barcelona-first-city-globally-adopt-un-open-source-principles) paired its UN endorsement with a commitment to create one. New York’s Office of Technology & Innovation, which already coordinates technology citywide, is the natural host for one too.

### The Gap to Close

An Open Source Programme Office would be the natural next chapter of the strategy PIT Crew already represents: real teams, real funding, and public interest technology built in-house. PIT Crew shows what that office would formalize — giving [Lisa Gelobter’s](https://en.wikipedia.org/wiki/Lisa_Gelobter) office a permanent, citywide mandate for exactly the kind of work it’s already doing, rather than five crews at a time.

## sustain-and-scale

UN Open Source Principle #8 calls for solutions that meet evolving needs over time — funded and maintained for the long run, not abandoned after launch. New York’s question isn’t whether it has [digital public infrastructure](gloss:dpi); any large resident-facing platform is infrastructure in effect. The question is whether it’s built on open, reusable, standards-based components the city can sustain indefinitely, or on closed ones it can’t maintain without the original vendor.

### The Gap to Close

The mechanism other governments use to fund this is a modest, dedicated pool of money — modeled on Germany’s [Sovereign Tech Agency](https://www.sovereign.tech/), which has put over €24 million into keeping critical open source infrastructure maintained, with nearly 500 applications requesting over €114 million — several times what it could fund. New York doesn’t have to invent this from scratch: the city already found [$5.24 million in baselined funding](https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/) for four PIT Crews, plus a fifth built with Rockefeller Foundation support — the same modest, sustained funding model this principle calls for, already in motion. For NYC, sustaining the systems PIT Crew builds is what makes affordability durable rather than a one-time announcement: a Click to Cancel portal, or whatever comes after it, that keeps working in five years, not just on launch day.

## closing

Every June, UN Open Source Week brings more than 2,600 participants from over 120 countries to UN Headquarters — in New York City. The Global Digital Compact, adopted by member states in 2024, gives that gathering a shared vocabulary: digital public goods, digital public infrastructure, open standards. It is, in effect, a standing global table on public-interest technology, convened a subway ride from City Hall, at which New York is currently a host but not a participant.

New York has a distinctive habit of being first to this kind of table on its own: it was the first U.S. city to submit a Voluntary Local Review of its Sustainable Development Goal progress to the UN, in 2018, and the first U.S. city to join the UN’s Safe Cities initiative. Endorsing the UN Open Source Principles is the same move, applied to technology.

No city in the Americas has yet endorsed the Principles. New York is the natural candidate to be first — gaining access to a global community of practice, to solutions other governments have already built and battle-tested, and to the contacts who can help it adopt them. New York’s own civic tech mission — building in-house, rejecting mediocrity, putting affordability and trust first — already lines up with these principles. Endorsing them is a low-cost way to say so on a global stage.
