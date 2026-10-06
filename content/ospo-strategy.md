---
# /ospo-strategy — the self-contained case for an Open Source Program Office
# (OSPO) inside New York City government. Rendered by UnnycOspoStoryscroller
# (src/components/unnyc/primer/). ALSO read by /ospo-strategy/document, the
# printable executive summary (src/app/ospo-strategy/document/page.js), which
# reads `metaDocument:` through `metaKey` in src/lib/seo.js — same arrangement
# as content/principles.md and its two routes.
#
# ⚠ DRAFT COPY (2026-10-02). The structure is settled; the prose is a first
# pass for the owner to tighten. Lines marked `# VERIFY` carry a claim that
# should be checked against its source before this is put in front of the
# CTO or the Mayor's office. Facts about Barcelona, Munich, Paris and France
# are the same ones content/success.md already cites — keep them in step.
#
# ⚠ NO COUNTS IN PROSE. The endorser total, the OSPO-directory total and the
# catalogue counts are all derived elsewhere on the site from data files; a
# number typed here goes stale the next time a snapshot is refreshed. Point at
# the directory instead ("the public-sector OSPOs listed on /resources").
#
# `title` carries its own <span> for the underlined phrase, same convention as
# content/start.md's `title` and content/principles.md's `heroTitle`.
title: "An Open Source Program Office for <span>New York City</span>"
heroKicker: "OSPO Strategy"
lede: "A clear, self-contained case for standing up an OSPO within city government: what it is, how it would be structured, how it would be tailored to New York, and the path to getting it done. Built to be the one place the administration needs."
meta:
  title: "An Open Source Program Office for NYC — UNNYC"
  description: "The case for standing up an Open Source Program Office inside New York City government: what an OSPO is, how to structure it, and a path to execution."
  ogTitle: "An Open Source Program Office for New York City"
  ogDescription: "An executive summary and policy brief making the self-contained case for an NYC OSPO — what it is, how peer cities built theirs, and how the City can start."
# /ospo-strategy/document — the printable executive summary. Its own title and
# description so the two routes don't share a preview card (see seo.js).
metaDocument:
  title: "OSPO Executive Summary — UNNYC"
  description: "A printable executive summary proposing an Open Source Program Office within NYC's Office of Technology & Innovation, with recommendations and next steps."
  ogTitle: "Executive Summary: An OSPO for New York City"
  ogDescription: "The one-page case for an Open Source Program Office in New York City government — prepared for the CTO, the Mayor, and the administration."

# Sticky rail (the storyscroller sidebar). `id` must match an <article id>
# rendered by the component. Playbooks is first (owner call, 2026-10-06): the
# page opens on the per-city catalogues, and the memo follows.
sectionNav:
  - id: playbooks
    label: "Playbooks"
  - id: summary
    label: "Executive Summary"
  - id: brief
    label: "Policy Brief"
  - id: resources
    label: "Supporting Resources"

# The Playbooks section: one sub-section per city OSPO, each a fact card plus
# an expandable catalogue of sources. ⚠ ONLY THE UI WORDS ARE HERE. Every
# city — its facts, its sources, their descriptions — comes from
# content/ospo-catalogue/<city>.json (getOspoCatalogue in src/lib/content.js),
# one file per case in the research handoff's shape; the matching prose is
# content/briefs/<city>.md, rendered under that city's case on /success.
# Munich first; Paris, CMS, the European Commission and the UN to follow by
# dropping in their JSON. Counts (sources per city) are derived, never typed.
playbooks:
  title: "Playbooks"
  lede: "How the cities that already have an OSPO built theirs: the founding act, the office, what it does all day, and every source we read to find out — catalogued so a working group can start from the documents, not from a summary of them."
  # The office's name is itself the link to its site (with an arrow); this is
  # the one text link under the facts, to the city's case study on /success.
  caseStudyLabel: "Read case study"
  catalogueLabel: "Catalogue"
  countLabel: "sources"
  useLabel: "For an NYC OSPO"
  notPublishedLabel: "Not published"
  # The kind of source, named under each entry's document glyph. Keys are the
  # six glyph kinds the component collapses the JSON `type` values into
  # (GLYPH_KIND in UnnycOspoStoryscroller.js); an unknown type shows as "page".
  kinds:
    council: "Council paper"
    page: "Official page"
    press: "Press"
    analysis: "Analysis"
    voice: "Interview or talk"
    code: "Code"
    doc: "Document"
    policy: "Policy or law"
    tool: "Tool"
  facts:
    founded: "Founded"
    placement: "Where it sits"
    headcount: "Headcount"
    budget: "Budget"
    procurement: "Role in procurement"
    authorizingAct: "Authorizing act"

# The memo header shared by the on-page executive summary card and the
# printable. `addressed` has the same shape as content/sign.md's — label/value
# rows, in order.
memo:
  kicker: "Executive Summary"
  # The printable's own <h1>. On the web page the section heading is
  # `summary.title` below; on paper the subject is the title.
  documentTitle: "Establishing an Open Source Program Office in New York City Government"
  # ⚠ Copy, not data — there is no real per-page date anywhere in this repo, and
  # a printed memo without one looks unfinished. Update it when the document is
  # revised; it prints exactly as written.
  date: "October 2026"
  addressed:
    - label: "To"
      value: "The Chief Technology Officer, New York City Office of Technology & Innovation; the Office of the Mayor"
    - label: "From"
      value: "UNNYC — a campaign of WeGovNYC and Sarapis"
    - label: "Re"
      value: "Establishing an Open Source Program Office (OSPO) within New York City government"
  # Printed at the foot of the document, after the recommendations.
  footnote: "Prepared by WeGovNYC / Sarapis for the New York City Office of Technology & Innovation and the Office of the Mayor. Sources: United Nations Open Source Principles (unite.un.org); Barcelona City Council, November 2025; Munich Open Source Program Office (opensource.muenchen.de); Ville de Paris (opensource.paris.fr); code.gouv.fr. A longer policy brief and supporting links are at un.opensource.nyc/ospo-strategy."

summary:
  title: "Executive Summary"
  lede: "The short version, written for a decision-maker: one page on what we are asking for, why, and what happens first."
  recommendationsTitle: "Recommendations"
  # Numbered on the page and on paper. Order is the order of execution.
  recommendations:
    - title: "Endorse the UN Open Source Principles, publicly and by name."
      desc: "It costs nothing, it signals intent to every agency and vendor at once, and it puts New York alongside Barcelona — the first city to do it — and France, the first national government."
    - title: "Charter an Open Source Program Office within OTI, with a named director reporting to the CTO."
      desc: "A small central team with a written mandate: set policy, keep the inventory, review procurements, and be the City's front door to the open source world."
    - title: "Baseline what the City already builds, uses and depends on."
      desc: "Inventory agency software, publish what can be published under an open licence, and name the open source dependencies the City's services already rest on."
    - title: "Make an open source evaluation a standing step in technology procurement."
      desc: "Before a proprietary licence is signed or renewed, ask whether an open alternative would serve New Yorkers better — and record the answer."
    - title: "Join the practitioner networks, and host the conversation."
      desc: "The TODO Group and the OSPO Alliance are where public-sector OSPOs compare notes, and UN Open Source Week already convenes the movement at UN Headquarters, in New York."
  documentCta:
    label: "Read it as a document"
    href: /ospo-strategy/document
  signCta:
    label: "Sign the open letter"
    href: /campaign/sign

brief:
  title: "Policy Brief"
  lede: "The longer argument: the problem an OSPO solves, how peer governments built theirs, the structural options for New York, and a first-year plan."

resources:
  title: "Supporting Resources"
  lede: "Playbooks for standing up an office, the peer offices to study, and this campaign's own materials — everything a working group would need in one place."
  groups:
    # Was "Playbooks for standing up an OSPO" until 2026-10-06, when the
    # per-city Playbooks section arrived at the top of the page and the name
    # would have meant two different things on one page.
    - title: "Guides and handbooks"
      links:
        - text: "TODO Group — OSPO guides"
          url: "https://todogroup.org/"
          desc: "The practitioner community for running an OSPO: definitions, maturity models, templates."
        - text: "OSPO Alliance — Good Governance Initiative"
          url: "https://ospo-alliance.org/"
          desc: "A European-rooted handbook for onboarding an OSPO, written for public bodies as much as companies."
        - text: "Munich Open Source Program Office"
          url: "https://opensource.muenchen.de/ospo.html"
          desc: "A city OSPO opened in 2024 under a “public money, public code” mandate — the closest peer in scale and mandate."
        - text: "Paris Open Source"
          url: "https://opensource.paris.fr/ossparis/english.html"
          desc: "Europe’s first city-level OSPO (2022), built around Lutèce, the platform behind hundreds of Paris services."
        - text: "code.gouv.fr — France’s public code catalogue"
          url: "https://code.gouv.fr/en/expenditure-staff-impact/"
          desc: "How a national government publishes, counts and accounts for its open source — the model New York could borrow."
    - title: "Peer offices and precedents"
      links:
        - text: "Barcelona endorses the UN Principles"
          url: "https://www.barcelona.cat/infobarcelona/en/tema/science/barcelona-is-the-first-city-in-the-world-to-endorse-the-un-open-source-principles_1567058.html"
          desc: "The city council’s own announcement, November 2025 — the first city in the world to sign, and the commitments it paired with the signature."
        - text: "France endorses the UN Principles"
          url: "https://unite.un.org/en/news/france-becomes-first-government-endorse-un-open-source-principles"
          desc: "The UN’s notice of the first national government to endorse, May 2025."
        - text: "Public-sector OSPOs, mapped"
          url: "/resources#ospos"
          internal: true
          desc: "The directory of government open source programme offices this site maintains, from the FLOSS-PSO Network’s list."
        - text: "LiMux — Munich’s first decade"
          url: "https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/document/limux-it-evolution-open-source-success-story-never"
          desc: "The EU’s Open Source Observatory on what Munich’s original migration got right and what it taught the city."
    - title: "This campaign’s own materials"
      links:
        - text: "The UN Open Source Principles, one page"
          url: "/principles/document"
          internal: true
          desc: "The eight principles as a printable reference — what the City would be endorsing."
        - text: "Declaration of endorsement"
          url: "/campaign/endorse/document"
          internal: true
          desc: "A printable declaration prepared for the City to sign."
        - text: "What success looks like"
          url: "/success"
          internal: true
          desc: "Barcelona, Munich and Paris as full case studies, with sources."
        - text: "The UN system and NYC government technology"
          url: "/resources/guide"
          internal: true
          desc: "Our long-form briefing on the programmes and convenings New York can join."
---

## summary

New York City already runs on open source — in its data platforms, its web services, and in the participatory-budgeting software the Civic Engagement Commission uses, which Barcelona built and gave away. What the City does not have is an institution responsible for that fact: a place that decides what to publish, what to adopt, how to contribute back, and how to stay secure doing so. That institution is an Open Source Program Office, and the world’s best-run governments have been standing them up for a decade.

### What an OSPO is

An Open Source Program Office is a small, central team that owns an organization’s open source strategy. In a government, it sets the policy for publishing the City’s own code, keeps the inventory of what agencies use and release, reviews technology purchases for open alternatives, manages licence and security compliance, and represents the City in the communities whose software it depends on. It is a coordinating function, not a new software shop: the agencies keep building, and the OSPO gives them one set of rules and one front door.

### Why New York City, and why now

The United Nations adopted its Open Source Principles in 2025, and endorsing organizations now include cities and national governments as well as foundations and companies. Barcelona became the first city in the world to endorse them in November 2025 and paired the signature with a commitment to an OSPO. France was the first national government, in May 2025, and its public code catalogue now accounts for the software hundreds of public bodies share. The movement is organized at UN Headquarters — UN Open Source Week convenes it in New York every year — and the host city is not yet part of it. An OSPO is how New York joins with substance rather than a statement.

### How it would be structured

The office sits inside the Office of Technology & Innovation and reports to the Chief Technology Officer. It opens with a director and a small core team covering four functions: policy and licensing, inventory and publishing, procurement review, and community and contribution. Each large agency names a liaison. A written charter, adopted by OTI, defines the office’s authority over publishing decisions and its advisory role in procurement, so that the office outlasts the administration that creates it — the lesson of Munich, whose first open source effort rose and fell with city politics and whose second was built as an institution.

### Tailored to New York City government

New York is not starting from zero. The City has a decade of open data practice under the Open Data Law, agencies that already publish code, and an unmatched concentration of civic technologists, universities and open source foundations within its borders. It also has scale: a technology budget large enough that an open evaluation step in procurement changes vendor behaviour on its own. The OSPO proposed here is sized for that reality — central enough to set one policy, light enough not to slow the agencies, and anchored to the institution that already owns the City’s technology strategy.

### The call to action

We ask the Office of Technology & Innovation to do three things, in order: endorse the UN Open Source Principles publicly and by name; charter an Open Source Program Office with a named director; and make an open source evaluation a standing step in every City technology contract. The first costs nothing and can happen this quarter. The second and third are the work of the first year.

### Path to execution

Quarter one: the endorsement, the charter and the director. Quarter two: the inventory of what the City builds and uses, and a publishing policy for it. Quarter three: the procurement evaluation step, piloted with a few agencies, and the City’s first deliberate releases. Quarter four: a public report on what was published, what was reviewed and what it saved, and a plan for year two. The policy brief below sets out each step, the structural options, the risks and the measures.

## brief

This brief expands the executive summary for the people who will have to make it real: what problem an OSPO solves for New York, what the peer governments actually did, three ways the office could be structured and which we recommend, how it should be chartered and staffed, what the first year looks like, where it could go wrong, and how the City would know it is working.

### The problem this solves

City government buys, builds and depends on software in every agency, with no shared view of what it owns, what it could reuse, or what it is paying twice for. Open source software is already everywhere in that estate, usually without anyone responsible for it. The costs show up as renewals signed because no alternative was looked at, as the same tool built three times by three agencies, as security exposure in dependencies nobody tracks, and as civic software New York could share with other cities — or adopt from them — left on the shelf. An OSPO turns an unmanaged fact into a managed programme.

### What peer governments have done

Munich moved roughly fifteen thousand desktops to Linux and LibreOffice starting in 2003, reversed course under new leadership in 2017, and then came back smarter: a 2023 council motion created an Open Source Hub, and in 2024 the city opened an Open Source Program Office under an explicit “public money, public code” mandate. Paris has run an open source policy since 2002 around Lutèce, the platform behind more than three hundred city services, and in 2022 opened Europe’s first city-level OSPO; Lutèce has since been piloted by a community organization in Baltimore with Paris’s own staff supporting it. Barcelona’s Decidim participation platform has run since 2016, is recognized as a Digital Public Good, and is the software New York’s own participatory budgeting runs on; in November 2025 Barcelona became the first city to endorse the UN Principles and committed to an OSPO, a citizen digital-rights agreement and an open source fund. France endorsed in May 2025 and maintains a national catalogue of approved free software across its public bodies. The pattern is consistent: the durable form is an office with a mandate, not a one-time migration.

### Three ways to structure it

**A central office.** One team inside OTI holds the policy, the inventory and the procurement review for the whole City. Strongest on consistency; weakest on reach into agencies that do not report to OTI.

**A federated network.** Each agency names an open source lead and a council of those leads sets shared policy, with a small secretariat. Strongest on agency buy-in; weakest on follow-through, because no one owns the outcome.

**A hybrid — our recommendation.** A central office inside OTI, reporting to the CTO, with named liaisons in the largest agencies and a standing council that meets quarterly. The office owns policy, the inventory and the procurement step; the liaisons own adoption inside their agencies. This is the shape Munich and Paris converged on, and it fits an organization of New York’s size.

### Charter and governance

The charter should be short and adopted by OTI, naming the office’s purpose, its authority and its limits. Authority: to set the City’s open source publishing policy and licence guidance; to maintain the inventory of software the City builds, uses and releases; to review technology procurements above a threshold for an open source alternative and record the evaluation; and to represent the City in open source communities and standards bodies. Limits: the office advises on procurement and does not approve it; it sets publishing policy and agencies decide what to release within it. The director reports to the CTO and reports publicly once a year. Writing the charter down is what makes the office survive a change of administration.

### Staffing and budget

Peer offices run as small central teams, and New York’s should start that way: a director, a policy and licensing lead, an engineer responsible for the inventory and the City’s public repositories, and a community and communications lead, with security review drawn from the City’s existing cyber command rather than duplicated. Agency liaisons are existing staff with a portion of their time assigned. The budget is a handful of positions and a modest programme line for memberships, events and contributions upstream — small against a City technology budget measured in billions, and recoverable many times over through a single avoided renewal. The brief deliberately gives no dollar figure here; sizing it is the first task of the director.

### Year-one roadmap

**Quarter one — stand up.** OTI endorses the UN Open Source Principles by name; the charter is adopted; the director is appointed; the agency liaisons are named.

**Quarter two — baseline.** The office inventories what agencies build, use and depend on; publishes the City’s open source publishing policy and licence guidance; and establishes the City’s public code repositories under one set of rules.

**Quarter three — put it to work.** The procurement evaluation step is piloted with a few agencies on live contracts; the City makes its first deliberate open source releases; the office joins the TODO Group and the OSPO Alliance and takes a visible role at UN Open Source Week.

**Quarter four — report.** A public report on what was published, what was reviewed and what it saved; the first set of measures; and a plan and budget for year two.

### Risks and how to manage them

**Security.** The worry is that open source means exposure; the OSPO is the answer to it, not the cause — it is the office that tracks the dependencies the City already relies on and brings security review to them. **Vendor resistance.** An evaluation step is not a ban on proprietary software; it is a documented question, and the office should say so plainly and early. **Capacity.** A central office can become a bottleneck; the hybrid model and the advisory (not approval) role in procurement are the guard against that. **Procurement rules.** The evaluation step is designed to sit inside existing procurement process as a documented consideration, not a new approval gate; the office should confirm the fit with the City’s procurement authority in quarter one. **Durability.** Munich’s first effort ended with an election; the charter, the public report and the agency council exist so New York’s does not.

### How we’ll know it’s working

The office should report, in public, once a year: the number of agencies with a named liaison and an active inventory; the software the City has published, and what other governments have adopted from it; the software the City has adopted from others instead of building or buying; the procurements that completed an open source evaluation and how the decisions went; the contributions City staff made upstream; and the spending avoided. These are the measures the peer offices report, and they are the measures New Yorkers can check.
