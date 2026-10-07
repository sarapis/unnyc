---
# ⚠ THE `foot:` BLOCK THAT WAS HERE IS GONE (2026-09-14, owner's call).
# /resources was the last page running its own copy of the "keep going" band —
# its own wording ("Looking for something else?") and a shorter list missing
# /principles. It now renders the SHARED band with the other four storyscroller
# routes; the destinations and the heading live once, in content/keep-going.md,
# and the component drops the row pointing at the page it is on.
# ⚠ Two visible changes to this page, both intended: the heading now reads
# "Let's keep going", and the band gained a link to /principles.
# ⚠ `title` and `lede` render as the page's <h1> and intro paragraph. /resources
# was the ONLY route with no header at all, so it had no <h1> — an outline that
# opens at <h2> reads to a crawler and a screen reader as a page with no subject.
# The title is the page's own `meta.title` minus the site suffix; the lede just
# names the sections already on the page. Deliberately claim-free and number-free
# — counts belong in the components that derive them, never in prose that can
# drift. Reword freely, but don't delete them.
# `title` carries its own <span> for the underlined word, same convention as
# content/start.md's `title` and content/principles.md's `heroTitle`.
title: "Related <span>Resources</span>"
# Storyscroller hero eyebrow (UnnycResourcesStoryscroller).
heroKicker: "Resources"
lede: "Where to read further, and who to call — primary sources from the UN and the City, the communities doing this work, and a directory of public sector open source programme offices."
meta:
  title: "Related Resources — UNNYC"
  description: "Primary sources from the UN and the City, communities of practice, funders, and a directory of public sector open source programme offices."
  ogTitle: "Related Resources — UNNYC"
  ogDescription: "Primary sources, communities of practice, who to call, and a directory of public sector open source programme offices."
# Jump menu (UnnycSectionNav) — `id` must match an id rendered on the page.
# ⚠ The bar hides itself below 3 items; there are now 4, so one could be removed
# without it vanishing — but two could not.
sectionNav:
  - id: resources
    label: "Primary Sources"
  - id: contacts
    label: "People to Call"
  - id: ospos
    label: "Find an OSPO"
  - id: open-data
    label: "Open Data"
# The published datasets (PrimerOpenData). Only the words are here: every ROW —
# name, description, record count, licence, URL — is read from
# src/lib/datasets.js, the same place /data/*.json is built from. ⚠ Do not list
# the datasets or their counts here. A count in prose is a number that goes
# stale the next time a snapshot is refreshed, which is why the endorser
# directory derives its own.
openData:
  title: "Open Data"
  lede: "Everything the map and the directories are built from, published as JSON with its provenance and licence attached."
  # Rendered after the rows, as one line.
  # ⚠ NO COUNTS IN THIS STRING. It read "two are this site's own work, two are
  # redistributed" until 2026-09-14, when the OSPO directory turned out to be the
  # FLOSS-PSO Network's CC0 list rather than ours — so the split was 1/3, not 2/2,
  # and the sentence had been wrong for as long as it had been specific. Each row
  # already states its own licence and whose credit it carries, derived from the
  # payloads; this line only says that they DIFFER, which stays true however the
  # mix changes. Same rule as the endorser directory's counts and the map's
  # catalogue label: don't type a number into copy that data already knows.
  note: "Licences differ by who compiled each set — some are this site's own work, others are redistributed and credit their upstream source. Each file states its own terms."
  indexLabel: "All four, catalogued"
  llmsLabel: "What this site is, in one file"
resourceGroups:
  title: "Primary Sources"
  lede: "Read the frameworks, browse the registries, join the communities."
  groups:
  - title: "Start Here"
    links:
    - text: "The UN System & NYC Government Technology"
      url: "/resources/guide"
      internal: true
      desc: "Our long-form briefing for city technology leadership — the programs, events and frameworks NYC can join, and what to do first."
    - text: "UN Open Source Week"
      url: "https://www.unopensource.org/"
      desc: "The annual convening at UN HQ — agenda, recordings, and community."
    - text: "The UN Open Source Principles"
      url: "https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles"
      desc: "The eight principles and the launch announcement."
    - text: "Global Digital Compact"
      url: "https://www.un.org/global-digital-compact"
      desc: "The member-state framework naming DPGs and DPI as shared priorities."
  - title: "Directories & Registries"
    links:
    - text: "GovOSS (Sarapis)"
      url: "https://govoss.cat/"
      desc: "Government open source registers from around the world, harvested first-hand onto one schema, with a free JSON API."
    - text: "DPI Map (UCL IIPP)"
      url: "https://dpimap.org/"
      desc: "Interactive world map of the digital ID, payment, and data-exchange systems in use across 210 countries."
    - text: "DPG Standard & Registry (DPGA)"
      url: "https://www.digitalpublicgoods.net/registry"
      desc: "The vetted registry of digital public goods, filterable by SDG and searchable by deployment."
    - text: "Universal DPI Safeguards"
      url: "https://www.dpi-safeguards.org/"
      desc: "The rights-by-design framework for public digital infrastructure."
    - text: "GovStack"
      url: "https://www.govstack.global/"
      desc: "Building-block specifications for government digital services."
    - text: "X-Road"
      url: "https://x-road.global/"
      desc: "The open source data exchange layer run by 20+ countries."
  - title: "Communities of Practice"
    links:
    - text: "TODO Group"
      url: "https://todogroup.org/"
      desc: "The practitioner community for running an OSPO — guides and templates."
    - text: "OSPO Alliance"
      url: "https://ospo-alliance.org/"
      desc: "European-rooted alliance with an OSPO onboarding handbook."
    - text: "EU Open Source Observatory (OSOR)"
      url: "https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor"
      desc: "Case studies and news on public-sector open source across Europe."
    - text: "Code for America"
      url: "https://codeforamerica.org/"
      desc: "The US civic tech network — the domestic ally ecosystem."
  - title: "Money & Maintenance"
    links:
    - text: "Sovereign Tech Agency"
      url: "https://www.sovereign.tech/"
      desc: "Germany’s public fund for maintaining critical open source infrastructure."
    - text: "Digital Public Goods Alliance"
      url: "https://www.digitalpublicgoods.net/"
      desc: "Pathways to fund, certify, and scale DPGs."
    - text: "MOSIP"
      url: "https://www.mosip.io/"
      desc: "The open source ID platform — a study in sustainably governed DPI."
contacts:
  title: "People to Call"
  lede: "Outward-facing organizations — with public contact channels — whose job is helping governments adopt open source, DPGs, and DPI."
  note: "All channels listed are the organizations’ own public contact points."
  groups:
  - title: "UN System"
    items:
    - org: "UN Office for Digital and Emerging Technologies (ODET)"
      role: "Stewards the Global Digital Compact follow-up; led by USG Amandeep Singh Gill, the UN’s top digital official."
      helps: "Connecting city digital policy to UN processes and the GDC."
      url: "https://www.un.org/digital-emerging-technologies/"
    - org: "UN Open Source Week organizers (OICT)"
      role: "The team behind the annual convening at UN Headquarters."
      helps: "Getting NYC officials into the room every June — the single easiest first step."
      url: "https://www.unopensource.org/"
  - title: "Global Institutions"
    items:
    - org: "Digital Public Goods Alliance (DPGA)"
      role: "The multi-stakeholder body that maintains the DPG Standard and registry."
      helps: "Certifying NYC-built tools as DPGs; finding vetted open solutions to adopt."
      url: "https://www.digitalpublicgoods.net/"
    - org: "Centre for Digital Public Infrastructure (CDPI)"
      role: "Advisory center (co-founded by India Stack architects) that runs a help desk for governments building DPI."
      helps: "Free architectural guidance for any DPI effort NYC takes on."
      url: "https://cdpi.dev/"
    - org: "TODO Group"
      role: "The global community of OSPO practitioners, hosted at the Linux Foundation."
      helps: "Playbooks, templates, and peer mentors for standing up an NYC OSPO."
      url: "https://todogroup.org/"
    - org: "OpenForum Europe"
      role: "Policy think tank on open technologies; among the sixteen endorsers of the UN Principles."
      helps: "Policy language and precedent from European open source legislation."
      url: "https://openforumeurope.org/"
    - org: "Sovereign Tech Agency"
      role: "Germany’s public investor in open source maintenance — and an endorser of the UN Principles."
      helps: "The blueprint for public funding of critical open infrastructure."
      url: "https://www.sovereign.tech/"
  - title: "New York City"
    items:
    - org: "NYC Office of Technology & Innovation (OTI)"
      role: "The city’s central technology agency — the campaign’s primary addressee and the natural home of an NYC OSPO."
      helps: "The decision. Endorsing the Principles starts here."
      url: "https://www.nyc.gov/content/oti/pages/"
    - org: "Mayor’s Office for International Affairs"
      role: "NYC’s bridge to the UN and diplomatic community; ran the first-ever Voluntary Local Review."
      helps: "The city-to-UN channel — the office that makes an endorsement diplomatic reality."
      url: "https://www.nyc.gov/site/international/index.page"
    - org: "WeGovNYC / Sarapis"
      role: "The civic tech organizers behind this campaign."
      helps: "Briefings, introductions, and the open letter itself — we’re the local convener."
      url: "/campaign"
      internal: true
ospoDirectory:
  title: "Find an OSPO"
  lede: "Public-sector Open Source Program Offices already running elsewhere."
  intro: "Researchers interviewed representatives of sixteen public-sector OSPOs across the EU, Norway, Liechtenstein and Iceland and sorted them into six archetypes. The diagram below is their summary of what those offices are made of and what they do. On the left, the structural choices every one of them had to make: who sponsors it, which entities support it, how it is budgeted, where it sits in the organization, and how it is staffed. On the right, the work itself — setting open source strategy, overseeing compliance, writing the policies, driving contributions upstream, collaborating with outside projects, tracking whether any of it is working, practising inner source between agencies, growing and keeping people with these skills, advising colleagues, and running the open source infrastructure the organization already depends on."
  diagram:
    src: "/images/resources/ospo-archetypes.jpg"
    alt: "Diagram of public-sector OSPO archetypes. Structure (RQ1) is fed by five choices — sponsor, supporting entities, budget, organization, and staffing. Responsibilities (RQ2) branch into ten activities: develop and execute OSS strategy, oversee OSS compliance, establish and improve OSS policies and processes, prioritize and drive OSS upstream development, collaborate with OSS organizations, track performance metrics, implement inner source practices, grow and retain OSS talent inside the organization, provide advice and support on OSS, and manage open source IT infrastructure"
    creditText: "Diagram: Linåker, Nummelin Carlberg & O’Riordan, “Public sector open source program offices — Archetypes for how to grow (common) institutional capabilities”, Journal of Systems and Software 241 (2026) 112998 — CC BY 4.0"
    creditHref: "https://doi.org/10.1016/j.jss.2026.112998"
  # ⚠ PROVENANCE — the offices are NOT our compilation, and since 2026-10 they are
  # not kept here at all. They come from content/govoss-ospos.json, a snapshot of
  # the FLOSS-PSO Network's public-sector OSPO list (run by the OSPO Alliance) as
  # GovOSS republishes it at https://govoss.cat/ospos.json — refreshed by
  # `node scripts/fetch-govoss-ospos.mjs`, read by getOspoDirectory() in
  # src/lib/content.js. Only the prose above stays in this file.
  # ⚠ LICENCES ARE READ, NOT RECALLED. The list is CC0 1.0 (FLOSS-PSO's own
  # footer distinguishes "OSPO list CC0" from "Website content CC-BY-SA"; we use
  # the LIST). The placements — lat/lng, city, seat/hq — are GovOSS's, also CC0,
  # and most were copied from this site's own earlier hand placements. Both
  # strings are read from GovOSS's file and matched verbatim by the fetch script,
  # which throws on anything new. CC0 requires no attribution, so crediting
  # FLOSS-PSO is a decision worth writing down rather than a term we comply with.
  # A correction to an office goes to FLOSS-PSO; a placement correction to GovOSS.
  # ⚠ OVERRIDES ARE PINNED, NOT FREE EDITS. Each one names the office by its
  # GovOSS id and quotes the EXACT upstream text it replaces; getOspoDirectory()
  # fails the build the moment upstream's text stops matching, so a fix upstream
  # announces that the override is obsolete instead of being silently masked.
  # Keep this list for data DEFECTS only — upstream's wording is the claim the
  # page makes. Report each one to FLOSS-PSO so it can be deleted.
  descriptionOverrides:
    - id: "floss-opentech-auth-gr"
      upstream: "Το promote and harness the transformative potential of open technologies — technologies defined by their openness to free use, analysis, modification, and redistribution by any user"
      text: "To promote and harness the transformative potential of open technologies — technologies defined by their openness to free use, analysis, modification, and redistribution by any user"
      reason: "Upstream begins with Greek Tau-Omicron (Το) where the Latin \"To\" is meant. Only those two letters change."
---
