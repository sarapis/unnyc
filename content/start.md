---
lede: "Many of the world’s best performing national, regional and local governments have realized that to meet the needs of the 21st century they must transition from licensing proprietary technical systems from corporations to owning and controlling their own systems built on open source technology."
next:
  text: "Now that you know the basics —"
  href: /principles
  label: "Learn about the UN Open Source Principles →"
meta:
  title: "The Global Movement in Government Open Source — UNNYC"
  description: "New to government open source? Learn the key vocabulary, the eight UN Open Source Principles, how the movement reached the UN, and who has already signed on."
  ogTitle: "The Global Movement in Government Open Source — UNNYC"
  ogDescription: "The vocabulary, the principles, the history, and the map — everything you need to follow the UNNYC campaign from the beginning."
title: "A Movement for Government Use of Open Source"
# Jump menu (UnnycSectionNav). Short labels on purpose — these sit in a one-line
# bar, where the section headings ("How the UN Came to Champion Open Source")
# are far too long. `id` must match an id rendered on the page.
# Order matches the page: vocabulary, then who is already doing it, then how the
# UN got here. "The Eight Principles" left this bar on 2026-08-13 with the
# section itself — the principles are their own top-level page now (/principles).
sectionNav:
  - id: concepts
    label: "Vocabulary"
  - id: going-open-source
    label: "World Going Open Source"
  - id: movement
    label: "UN’s Timeline"
basicsLink: "Are you entirely new to open source? [Start with the basics ↗](https://en.wikipedia.org/wiki/Open-source_software)"
concepts:
  title: "The Vocabulary of the Movement"
  lede: "Over 50% of the open source technologies used by governments all over the world were developed in the United States, and yet US government technologists are much less familiar with the terms and concepts of the global open source government movement than their counterparts around the world."
  terms:
  - slug: "open-source-foss"
    term: "Open Source (FOSS)"
    def: "Software whose source code anyone can inspect, use, modify, and share. It’s about freedom and public auditability, not price."
    nyc: "A handful of NYC agencies already publish code on GitHub on their own initiative. Endorsement would turn that scattered habit into a citywide standard."
    link:
      url: "https://en.wikipedia.org/wiki/Free_and_open-source_software"
      label: "Wikipedia"
  - slug: "un-principles"
    term: "UN Open Source Principles"
    def: "Eight commitments adopted by the UN’s Digital and Technology Network in 2025 defining how the UN system approaches software."
    nyc: "Endorsement is a signature plus a roadmap, not a procurement overhaul — the entry ticket to a global community of practice."
    link:
      url: "https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles"
      label: "unite.un.org"
  - slug: "ospo"
    term: "OSPO — Open Source Programme Office"
    def: "A small team that coordinates an institution’s open source strategy: what to use, what to publish, how to contribute, and how to stay secure doing it."
    nyc: "Paris, Munich, and the UN itself run OSPOs. NYC’s Office of Technology & Innovation is the natural home for one."
    link:
      url: "https://en.wikipedia.org/wiki/Open_Source_Program_Office"
      label: "Wikipedia"
  - slug: "dpi"
    term: "Digital Public Infrastructure (DPI)"
    def: "The shared digital rails a society runs on — identity, payments, data exchange. Like roads or the power grid, it works best as interoperable public infrastructure, not walled gardens."
    nyc: "Platforms like Decidim and X-Road are built by one government and reused by dozens. NYC can join that exchange instead of buying its own silo."
    link:
      url: "https://en.wikipedia.org/wiki/Digital_public_infrastructure"
      label: "Wikipedia"
  - slug: "digital-sovereignty"
    term: "Digital Sovereignty"
    def: "A government’s ability to control its own digital destiny — to run, audit, and change the systems it depends on rather than being locked into any single vendor."
    nyc: "Every proprietary contract renewal NYC can’t walk away from is a sovereignty question. Open source is the strongest structural answer."
    link:
      url: "https://en.wikipedia.org/wiki/Digital_sovereignty"
      label: "Wikipedia"
  - slug: "open-standards"
    term: "Open Standards & Interoperability"
    def: "Publicly documented formats and protocols that let systems from different makers work together — the difference between an ecosystem and a lock-in."
    nyc: "Writing open standards into procurement is the single highest-leverage clause NYC’s buyers control."
    link:
      url: "https://en.wikipedia.org/wiki/Open_standard"
      label: "Wikipedia"
  - slug: "public-money-public-code"
    term: "\"Public Money, Public Code\""
    def: "The principle that software paid for by the public should be available to the public as open source — adopted as policy by cities like Munich."
    nyc: "A slogan NYC’s civic tech community already believes in; endorsement would make it official posture."
    link:
      url: "https://publiccode.eu/"
      label: "FSFE"
movement:
  title: "How the UN Came to Champion Open Source"
  lede: ""
  timeline:
  - year: "2019–24"
    title: "The groundwork"
    desc: "The Digital Public Goods Alliance starts vetting open source solutions for the SDGs, the Secretary-General’s digital cooperation roadmap names digital public goods as essential, and \"OSPOs for Good\" convenes governments at UN Headquarters."
  - year: "Sept 2024"
    title: "Global Digital Compact adopted"
    desc: "At the Summit of the Future, member states commit to shared principles for an open, safe digital future — with explicit support for digital public goods and infrastructure."
  - year: "March 2025"
    title: "UN Open Source Principles adopted"
    desc: "The UN’s Digital and Technology Network adopts eight principles — \"open by default,\" \"contribute back,\" and more. Seventeen organizations endorse, from the Open Source Initiative to the Linux Foundation."
  - year: "Nov 2025"
    title: "Barcelona endorses — a city first"
    desc: "Barcelona becomes the first city in the world to endorse the Principles, pairing the signature with an OSPO, a citizen agreement, and a municipal open source fund."
  - year: "June 2026"
    title: "UN OSW draws 2,600+ from 120+ countries"
    desc: "UN Open Source Week fills UN Headquarters with themed days on AI, digital public infrastructure, and OSPOs — the movement’s annual gathering, in New York."
# The map section. Its title and lede were hardcoded in
# PrimerMovementNow.js until 2026-08-13 — the last copy this site kept in a
# component. Editing them needed a developer; now they don't.
movementNow:
  title: "The World is Going Open Source"
  lede: "Open source enables governments all over the world to create, strengthen and share solutions. Check out some of the open source catalogs, institutions and programs of the world’s leading governments."
mapMarkers:
- type: "ask"
  lat: 40.7489
  lng: -73.968
  label: "New York City — next?"
  desc: "Host of UN Open Source Week. The ask: become the first city in the Americas to endorse the Principles."
- type: "city"
  lat: 41.3874
  lng: 2.1686
  label: "Barcelona"
  desc: "First city in the world to endorse the UN Principles (Nov 2025), with an OSPO, citizen agreement, and open source fund."
- type: "city"
  lat: 48.8566
  lng: 2.3522
  label: "Paris"
  desc: "Pioneer city OSPO; its open source Lutèce platform runs 300+ city services."
- type: "city"
  lat: 48.1351
  lng: 11.582
  label: "Munich"
  desc: "City Council–mandated OSPO operating under \"public money, public code.\""
- type: "nation"
  lat: 59.437
  lng: 24.7536
  label: "Estonia (Tallinn)"
  desc: "Open sourced X-Road, the data exchange layer of its digital state."
- type: "nation"
  lat: 60.1699
  lng: 24.9384
  label: "Finland (Helsinki)"
  desc: "Federated its national data exchange with Estonia’s in 2018."
- type: "nation"
  lat: 64.1466
  lng: -21.9426
  label: "Iceland (Reykjavík)"
  desc: "Runs Straumurinn, its national X-Road environment."
- type: "nation"
  lat: 52.52
  lng: 13.405
  label: "Germany (Berlin)"
  desc: "Sovereign Tech Agency funds critical open source maintenance; ZenDiS builds openDesk. Both endorsed the UN Principles."
- type: "nation"
  lat: 12.9716
  lng: 77.5946
  label: "India (Bengaluru)"
  desc: "DPI at population scale — and home of MOSIP, the open source ID platform adopted internationally."
- type: "nation"
  lat: 8.4657
  lng: -13.2317
  label: "Sierra Leone (Freetown)"
  desc: "Ministerial voice at UN OSW 2026 — part of a wide Global South presence."
- type: "nation"
  lat: 17.9714
  lng: -76.7931
  label: "Jamaica (Kingston)"
  desc: "At the ministerial table at UN OSW 2026 as the Caribbean engages open source."
- type: "un"
  lat: 46.2044
  lng: 6.1432
  label: "Geneva — UN system"
  desc: "ITU, UNICC and the wider UN digital ecosystem driving open standards."
- type: "un"
  lat: 40.7505
  lng: -73.9682
  label: "UN Headquarters, NYC"
  desc: "Where the eight Principles were adopted — and where the world’s open source movement meets every June."
# Credit + legend label for the CTFG map layer. The layer's DATA is a snapshot at
# content/ctfg-gov-open-source.json (refresh with scripts/fetch-ctfg-projects.mjs);
# the counts, source name, link and licence come from that file so they can't drift
# from the dots. Only the wording lives here.
mapSource:
  ctfgLegendLabel: "Government open source programs"
  ctfgCredit: "Government open source programs on this map are drawn from the"
mapLegend:
- type: "city"
  label: "Cities leading"
- type: "nation"
  label: "National programs"
- type: "un"
  label: "UN system"
- type: "ask"
  label: "NYC — the ask"
---
