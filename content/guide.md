---
meta:
  title: "The UN System & NYC Government Technology — UNNYC"
  description: "A guide to the UN programs, events and frameworks NYC's technology and operations leaders can participate in — most of them a subway ride from City Hall."
  ogTitle: "The UN System & NYC Government Technology"
  ogDescription: "How NYC's technology and operations leaders can participate in, learn from, and contribute to the United Nations' digital ecosystem — all from a subway ride away."
eyebrow: "Guide for NYC Technology Leadership"
title: "The UN System & NYC Government Technology"
subtitle: "How NYC's technology and operations leaders can participate in, learn from, and contribute to the United Nations' digital ecosystem — all from a subway ride away."
byline: "Prepared by [WeGovNYC](https://wegov.nyc), a program of [Sarapis](https://sarapis.org)"
date: "February 2026"
# Jump menu (UnnycSectionNav) — short labels; the section headings are far too
# long for a one-line bar. `id` must match a `slug` below, which is what the page
# renders as the section id.
sectionNav:
  - id: summary
    label: "Summary"
  - id: open-source-principles
    label: "Principles"
  - id: open-source-week
    label: "Open Source Week"
  - id: ospo
    label: "OSPO"
  - id: gam4dc
    label: "GAM-4-DC"
  - id: wuf13
    label: "WUF13"
  - id: additional
    label: "More Opportunities"
  - id: calendar
    label: "Calendar"
  - id: first-steps
    label: "First Steps"
# NOT `sections:` — getContent returns `{...frontmatter, sections}` and the parsed
# body sections would silently overwrite a frontmatter key of that name.
outline:
  - slug: summary
    title: "Executive Summary"
  - slug: open-source-principles
    number: 1
    title: "UN Open Source Principles"
  - slug: open-source-week
    number: 2
    title: "UN Open Source Week — June 22–26, 2026"
    badge: "📍 In NYC — UN Headquarters"
  - slug: ospo
    number: 3
    title: "Open Source Program Office (OSPO)"
  - slug: gam4dc
    number: 4
    title: "UN-Habitat: Global Alliance of Mayors for Digital Cooperation"
  - slug: wuf13
    number: 5
    title: "World Urban Forum 13 — Baku, May 17–22, 2026"
  - slug: additional
    title: "Additional Opportunities"
  - slug: calendar
    title: "Calendar Summary"
  - slug: first-steps
    title: "Recommended First Steps"
foot:
  text: "This guide sits alongside the campaign's own resource directory."
  ctas:
    - href: /resources
      label: "← Back to resources"
      style: outline
    - href: /campaign
      label: "Sign the open letter →"
      style: primary
---

<!-- Ported from old-unnyc.wegov.nyc/guide.html on 2026-08-11. The prose was
     lifted mechanically, not retyped, and diffed word-for-word against the
     original. `## <slug>` starts a section; `### Label` a sub-block. -->

## summary

New York City hosts the headquarters of the United Nations and dozens of its agencies — yet the technology teams running city government rarely interact with the digital innovation happening a few miles uptown at UN Plaza.

This guide maps out specific UN programs, events, and frameworks that NYC government technology and operations leaders can participate in, learn from, and contribute to.

### Three Categories of Opportunity

1. **Open source & digital infrastructure** — The UN is building a global open-source ecosystem that NYC can both leverage and lead within
2. **Urban governance & smart cities** — UN-Habitat and allied programs are creating frameworks for data-driven, digitally inclusive cities
3. **Events & convenings** — Multiple annual events take place *in NYC*, requiring zero travel investment

## open-source-principles

### What it is

A set of principles for open-source software development, use, and distribution adopted by the UN Chief Executive Board's Digital Technology Network (DTN). As of mid-2025, **over 60 organizations** have endorsed them, including the Open Source Initiative (first endorser, Feb 2025) and the Government of France.

### Why it matters for NYC

- **Signal leadership** — NYC would be among the first U.S. municipal governments to endorse, joining France at the national level
- **Align with existing practice** — NYC already publishes code on GitHub and contributes to open-source projects
- **Create a bridge** — Endorsement opens a formal relationship with the UN's digital technology network

### How to participate

1. Review the principles at [unopensource.org](https://unopensource.org)
2. Submit a formal endorsement through the UN's Digital Technology Network
3. Announce the endorsement at UN Open Source Week

## open-source-week

### What it is

An annual week-long event at **UN Headquarters in New York City**, organized by ODET and OICT.

| Day | Focus |
|---|---|
| Monday, June 22 | Community Hackathon |
| Tuesday, June 23 | **Open Source × AI** (new for 2026) |
| Wednesday, June 24 | Digital Public Infrastructure Day |
| Thursday, June 25 | OSPOs for Good |
| Friday, June 26 | Community-led side events |

### Why it matters for NYC

This event happens *in your city*. It brings together hundreds of technologists, policymakers, and open-source leaders — a 15-minute subway ride from City Hall.

- **Present NYC's open-source work** — Showcase tools NYC has built
- **Participate in the hackathon** — Send developers to collaborate on Digital Public Goods
- **Host a side event** — Friday is reserved for community events
- **Recruit talent and ideas** — Connect with the UN's global developer community

### How to participate

1. Register at [unopensource.org](https://unopensource.org)
2. Contact ODET to propose a city-led side event or panel
3. Send a delegation of 5–10 from OTI, Cyber Command, and agency IT leads

## ospo

### What it is

A dedicated unit within an organization that guides open-source adoption, manages licensing, develops digital skills, and coordinates contributions to the open-source ecosystem. The UNDP has integrated OSPOs into its strategy, and the "OSPOs for Good" initiative focuses on public-sector OSPOs.

### Why NYC should establish one

- **Centralize governance** — Coordinate licensing, security audits, and contribution policies across 130+ agencies
- **Adopt Digital Public Goods** — Leverage UN-vetted open-source tools from the [DPG Registry](https://digitalpublicgoods.net) instead of buying proprietary alternatives
- **Join a global network** — Connect with OSPOs at the UN, EU Commission, and France
- **Support the UN Common Policy Framework** (released Nov 2024 by ITU) — the blueprint for this kind of institutional setup

### How to participate

1. Attend "OSPOs for Good" sessions at UN Open Source Week (June 25, 2026)
2. Connect with UNDP's digital team to learn from their implementation
3. Pilot a lightweight OSPO within OTI — start with an inventory of existing open-source usage

## gam4dc

### What it is

Launched in 2023 by the UN Secretary-General's Envoy on Technology and UN-Habitat, the GAM-4-DC brings together mayors worldwide to collaborate on using digital technologies to advance the SDGs and improve urban governance.

**NYC is already connected.** The city is a founding member of the related **Cities Coalition for Digital Rights** (co-founded by NYC, Amsterdam, and Barcelona in 2018, now 45+ cities). The GAM-4-DC extends this into operational digital cooperation.

### Why it matters for NYC

- **Peer learning** — Direct exchange with Barcelona, Amsterdam, Seoul, and Helsinki on digital service delivery and AI governance
- **Influence global standards** — NYC's experience with 311, open data, and digital equity can shape UN guidance to other cities
- **Mayoral visibility** — Positions the Mayor's tech agenda on a global stage

### How to participate

1. The Mayor's Office for International Affairs is the natural liaison
2. Request formal engagement through the UN Secretary-General's Envoy on Technology
3. Propose a NYC-hosted convening during UN General Assembly week

## wuf13

### What it is

The world's largest conference on sustainable urbanization, organized by UN-Habitat. WUF13 focuses on *"Housing the World: Safe and Resilient Cities and Communities"* with significant programming on digital transformation, data-driven governance, and smart city infrastructure. The Smart Cities Council is organizing a formal delegation.

### Why it matters for NYC

- **Digital governance track** — Sessions on data-driven cities match NYC's analytics infrastructure
- **Housing × tech** — HPD and NYCHA face the same challenges discussed at WUF
- **Smart city showcase** — NYC's 311, LinkNYC, and open data portal are world-class examples
- **10,000+ urban leaders** from 160+ countries

### How to participate

1. Register a delegation at [wuf.unhabitat.org](https://wuf.unhabitat.org)
2. Submit abstracts for side sessions showcasing NYC tech
3. Join the Smart Cities Council delegation for structured introductions
4. Coordinate with the Mayor's Office for International Affairs

## additional

Our research surfaced several more high-value collaboration points:

### Digital Public Goods Alliance (DPGA)

A multi-stakeholder initiative (UNDP, UNICEF, Norway) maintaining a registry of vetted open-source software, data, AI models, and standards. In 2025, DPGA launched **"DPI Essentials for Public Sector Leaders"** — short courses designed for this exact audience.

**NYC action:** Nominate NYC-built tools to the DPG Registry. Survey the registry for tools NYC could adopt. Enroll OTI leadership in DPI Essentials courses.

[digitalpublicgoods.net](https://digitalpublicgoods.net)

### GovStack — Modular Digital Government

A UN-backed initiative (ITU, GIZ, Estonia) providing reusable "building block" specifications for common government digital services — identity, payments, data exchange, registries, consent management.

**NYC action:** Use GovStack's building-block approach to inform how the city standardizes shared services across 130+ agencies.

[govstack.global](https://govstack.global)

### UN Global Compact Leaders Summit — NYC, Sept 22–23, 2026

📍 In NYC

A major summit on sustainable business and climate-resilient growth during UNGA week. Directly intersects with Local Law 97 compliance and NYC's green economy plan.

**NYC action:** Send procurement and sustainability leads. Connect with vendors committed to sustainable practices.

[unglobalcompact.org](https://unglobalcompact.org)

### Internet Governance Forum (IGF)

In December 2025, member states voted to make the IGF a permanent UN forum. Covers digital inclusion, AI governance, cybersecurity, and human rights online.

**NYC action:** Present NYC's digital equity programs and influence how internet governance frameworks address municipal priorities.

## calendar

| Date | Event | Location | NYC Action |
|---|---|---|---|
| May 17–22, 2026 | World Urban Forum 13 | Baku, Azerbaijan | Send delegation, present NYC tech |
| June 22–26, 2026 | UN Open Source Week | **UN HQ, NYC** | Present, hackathon, side event |
| Sept 9–25, 2026 | UNGA 81 + Science Summit | **UN HQ, NYC** | Align city events with UNGA week |
| Sept 22–23, 2026 | UN Global Compact Summit | **NYC** | Procurement + sustainability leads |
| Ongoing | DPI Essentials courses | Online | Enroll OTI leadership |
| Ongoing | GAM-4-DC | Virtual + events | Formalize NYC membership |

## first-steps

### 1. Endorse the UN Open Source Principles

Low effort, high signal. Position NYC as a leader among U.S. municipal governments.

### 2. Send a delegation to UN Open Source Week

June 22–26, 2026. It's in your city — no flights needed.

### 3. Establish a lightweight OSPO

Start with an inventory of what NYC already uses and contributes to open source.

### 4. Enroll leaders in DPI Essentials

Quick professional development win for OTI staff and agency CIOs.

### 5. Propose a NYC side event during UNGA

Tech-focused, co-hosted with the Mayor's Office for International Affairs.
