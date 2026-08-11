---
title: "New York Runs on Software It Doesn’t Control"
lede: "Vendor reliance for digital public infrastructure is the status quo, and it costs the city. Adoption of the UN Open Source Principles would close massive gaps and save taxpayer funds."
meta:
  title: "Open Source for NYC: Why It Matters — UNNYC"
  description: "What NYC’s reliance on proprietary vendor software costs, what endorsing the UN Open Source Principles would cost and fund, and how each principle lines up with the city’s own tech agenda."
  ogTitle: "Open Source for NYC: Why It Matters — UNNYC"
  ogDescription: "What vendor reliance costs the city, what endorsement would cost and fund, and how the UN Open Source Principles line up with NYC’s own stated tech priorities — principle by principle."
principles:
  - slug: open-by-default
    icon: unlock
    number: 1
    title: "Open by Default"
  - slug: contribute-back
    icon: git-pull-request
    number: 2
    title: "Contribute Back"
  - slug: secure-by-design
    icon: shield-check
    number: 3
    title: "Secure by Design"
  - slug: foster-inclusion
    icon: users
    number: 4
    title: "Foster Inclusion"
  - slug: design-for-reusability
    icon: recycle
    number: 5
    title: "Design for Reusability"
  - slug: provide-documentation
    icon: book-open
    number: 6
    title: "Provide Documentation"
  - slug: rise
    icon: award
    number: 7
    title: "RISE"
  - slug: sustain-and-scale
    icon: trending-up
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

Every city agency runs on software, and most of it is proprietary — owned, licensed, and controlled by a handful of large vendors. Walking away would mean rebuilding from zero, so every renewal strengthens the vendor’s hand: licensing fees paid year after year with no ownership at the end, no leverage to force fixes, public money flowing to shareholders instead of neighborhoods. The scale is documented: the City Comptroller’s 2026 review of the city’s master agreements found [nearly $4 billion in spending beyond the estimated value of OTI’s citywide IT contracts](https://comptroller.nyc.gov/reports/the-monty-hall-contracts-unchecked-spending-across-the-citys-master-agreements/) — with purchase records that reveal almost nothing about what was actually bought.

The New Yorkers who feel that first aren’t the loudest voices at a budget hearing. They’re the residents stuck on a benefits portal an agency can’t fix without paying a vendor for the privilege, and the small businesses locked out of city data because it sits behind a system nobody outside the vendor can touch.

> Barcelona framed its own endorsement in terms that echo NYC’s civic tech mission: a “desire to put technology in the hands of citizens and reduce reliance on large tech companies,” through “a collaborative model in which cities control their own data and infrastructure.”
>
> — Barcelona’s endorsement of the UN Open Source Principles, as reported by [the EU Open Source Observatory](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/barcelona-first-city-globally-adopt-un-open-source-principles)

## open-by-default

UN Open Source Principle #1 reverses the burden of proof: teams justify why software should stay closed, not why it should be open. New York already lives by this rule for data — the Open Data Law (Local Law 11 of 2012) requires agencies to publish public data by default — and a handful of agencies already publish code on GitHub. What’s missing is a citywide default, rather than a matter of which agency happens to care.

### The Gap

Endorsement formalizes that instinct for code. The tools taxpayers already funded — a benefits calculator, a 311 tracker, the next Click to Cancel — become auditable, reusable across agencies, and fixable faster, by a city full of developers who want to put their skills to work for it.

## contribute-back

UN Open Source Principle #2 is reciprocity: institutions that benefit from open source should upstream fixes, publish reusable tools, and engage the communities maintaining the software they depend on. Every large software company already works this way — not out of altruism, but influence: contributors steer projects toward their own needs. NYC could be doing the same.

### The Gap

New York already has a stake. Its own Civic Engagement Commission runs the city’s participatory budgeting on Decidim, the open source platform Barcelona built. Contributing fixes back would strengthen a tool NYC depends on today — and give the city more influence over its software than any vendor contract has ever granted it.

## secure-by-design

UN Open Source Principle #3 treats security as a first-class requirement, not a patch applied after launch — and open code is inspectable code: community review surfaces vulnerabilities faster than a vendor’s word. New York already runs a citywide [Vulnerability Disclosure Program](https://nyc.responsibledisclosure.com/hc/en-us) for outside researchers. But for the vendor-purchased majority of city systems the code stays closed, so nobody outside the vendor can verify how well-built a system was to begin with.

### The Gap

Endorsement means problems can be found before they’re exploited — code the city can audit by inspection, not just by policy. Instead of trusting a vendor’s word on security, NYC can check the work: the verifiable trust the administration has made a defining theme of its tech agenda.

## foster-inclusion

UN Open Source Principle #4 calls for a broad, diverse contributor base — first-timers welcomed, documentation for non-experts, translation into the languages a community speaks. New York has the raw material: a famously diverse technical population, civic tech groups like BetaNYC, and [nearly 2,800 applicants to PIT Crew’s first hiring round](https://www.amny.com/politics/mamdanis-tech-pit-crews-2800-applicanants/). What it lacks is a formal bridge between that community and the city’s own software.

### The Gap

Endorsement extends the invitation past a single hiring cycle: a published contributor guide, city tools documented in multiple languages, and community contributions treated as a normal part of how NYC builds — trust earned the most direct way there is, by letting residents see and help build the software their government runs on.

## design-for-reusability

UN Open Source Principle #5 calls for software built to work across platforms and contexts, so one government’s solution becomes every government’s head start. The contracts NYC signs decide whether its data stays portable, whether formats are documented, and whether a future administration can switch providers without rebuilding from scratch. As one of the largest municipal technology buyers in the country, the standards NYC writes into its solicitations ripple through the vendor market well beyond the five boroughs.

### The Gap

Endorsing this principle means designing tools that can be adapted for reuse in different cities across contexts. This puts NYC on the map as a provider of software that other cities benefit from, continuing its legacy at the front of technological innovation, instead of relying exclusively on costly vendor contracts and the open source tools built in other parts of the world.

## provide-documentation

The strength of an open source project is largely derived from the comprehensiveness of its documentation; UN Open Source Principle #6 treats documentation as a deliverable. Documentation should be reviewed and maintained alongside the code so someone other than the original author can safely use, fix, or extend it. Vendor systems often ship with documentation that’s thin, outdated, or contractually restricted to the vendor’s own staff, so when a contract lapses or a key technologist moves on, institutional knowledge of how a system actually works can leave with them.

### The Gap

Endorsing this principle is the key to Fostering Inclusion and Contributing Back. Real documentation in plain language that is kept current and owned by the city provides accessibility, making code more maintainable and increasing a solution’s longevity. It’s also the standard NYC’s own civic tech community has pointed to ([BetaNYC](https://www.beta.nyc/2025/11/18/dear-mayor-elect-8-gov-tech-ideas/) put it plainly: “adopt secure, reusable code citywide”).

## rise

UN Open Source Principle #7 — Recognize, Incentivize, Support, and Empower — holds that institutions should formally back the people doing open source work, not leave it to individual initiative. The mechanism other governments use is an [Open Source Programme Office](gloss:ospo): [Munich](https://opensource.muenchen.de/ospo.html) runs one under a [“public money, public code”](gloss:public-money-public-code) mandate, and [Barcelona](https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/barcelona-first-city-globally-adopt-un-open-source-principles) paired its UN endorsement with a commitment to create one. New York’s Office of Technology & Innovation, which already coordinates technology citywide, is the natural host for one too.

### The Gap

Endorsing this principle, and pairing it with the creation of a dedicated OSPO for NYC, would provide the city with a small coordinating team that decides what an organization uses, what it publishes, how it contributes back, and how it stays secure while doing so. It is the organizational component that ensures the success of projects New Yorkers rely on.

## sustain-and-scale

UN Open Source Principle #8 calls for solutions that meet evolving needs over time — funded and maintained for the long run, not abandoned when a contract or donor cycle ends. The mechanism other governments use to fund this is a modest, dedicated pool of money. This can be modeled on Germany’s [Sovereign Tech Agency](https://www.sovereign.tech/), which has put over €24 million into keeping critical open source infrastructure maintained. The city already found [$5.24 million in baselined funding](https://www.amny.com/politics/mamdani-tech-five-new-pit-crews/) for four PIT Crews, plus a fifth built with Rockefeller Foundation support.

### The Gap

Since the money is already there, endorsing this principle means dedicating it to infrastructure that is built on open, reusable, standards-based components the city can sustain indefinitely. For NYC, sustaining the systems PIT Crew builds is what makes affordability durable rather than a one-time announcement.

## closing

Every June, UN Open Source Week brings more than 2,600 participants from over 120 countries to UN Headquarters — a standing global table on public-interest technology, a subway ride from City Hall, at which New York is host but not participant.

New York has a habit of being first to tables like this: first U.S. city to submit a Voluntary Local Review to the UN, first to join Safe Cities. No city in the Americas has yet endorsed the Principles. Endorsing them is the same move applied to technology — low cost, high signal, and a seat in the network where the world’s best performing governments trade what works.
