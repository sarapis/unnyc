---
meta:
  title: "The UN Open Source Principles — UNNYC"
  description: "The eight UN Open Source Principles, and what each one would mean for New York City."
  ogTitle: "The UN Open Source Principles"
  ogDescription: "Eight commitments adopted by the UN in 2025 — what each means, and what each would change for New York."
title: "The UN Open Source Principles"
lede: "Adopted by the UN’s Digital and Technology Network in 2025, these eight commitments articulate a global consensus around how institutions should adopt and interact with open source software."
# The grid opens straight on the lead principle as of 2026-08-14. It used to
# carry two framing lines — `gridIntro` ("The software built for the city ought
# to be:") and `gridCommitted` ("As leaders in the global open source movement,
# we are committed to the following:") — both cut to let the eight principles
# read as a scannable list rather than a prose preamble. The component still
# renders either key if it comes back, so restoring one is a content edit.
detailTitle: "What each principle would mean for New York"
detailLede: "The same eight, paired with the city’s own reality — what NYC already does, and what endorsement would change."
# Copy for the sticky side rail beside the detail sections
# (UnnycPrinciplesRail). The rail's LABELS are not here — it uses each
# principle's `titleCanonical`, so there is no ninth wording variant to keep
# in step. Only the heading and the accessible name live here.
railTitle: "The eight"
railLabel: "The eight principles"
# The endorsing organizations. They close this page rather than sitting under
# /start's map, because they endorsed *these* principles (moved here from
# content/start.md on 2026-08-14).
#
# Replaced the 17 hand-maintained entries on 2026-08-14 with the
# 150-organization snapshot in content/un-endorsers.json, rendered by
# UnnycEndorserDirectory. Only the COPY lives here now; the list itself is
# data. Four of the source's 154 are excluded, each with a reason in the
# JSON's `excluded` array.
#
# ⚠ 10 organizations this page used to name are NOT in that snapshot — Open
# Knowledge Foundation, OpenInfra, Matrix, Sovereign Tech Agency, ZenDiS,
# Nextcloud, Rocket.Chat, Linagora, Linux Professional Institute and the
# European Open Source Academy. They were checked for by name, by the UN's
# own alt-text slugs and by source URL, and appear under none of them. If they
# belong in the directory they need a second source; do not re-add them here,
# because this key no longer holds a list.
#
# Do NOT state a count in this copy. The component derives every number from
# the data, so an authored total is the one thing that can go stale.
endorsers:
  title: "These Organizations have Endorsed the Principles"
  # ⚠ "Hundreds" is the client's wording, kept as given. The directory shows
  # 150, and 68+36+32+8+6 is countable from the chips, so a reader can check
  # it. If that matters, "150 organizations" or "More than 150 organizations"
  # is accurate and no weaker — the count is derived, so it cannot go stale.
  lede: "Hundreds of organizations that have publicly endorsed the UN Open Source Principles."
  allLabel: "All sectors"
  filterLabel: "Filter endorsing organizations by sector"
  unitOne: "organization"
  unitMany: "organizations"
  # Pagination copy. 16 per page was asked for; the component derives the page
  # count, so changing PAGE_SIZE there needs no edit here.
  prevLabel: "Previous"
  nextLabel: "Next"
  pageLabel: "Page"
  paginationLabel: "Endorsing organizations, pages"
  showingLabel: "Showing"
  ofLabel: "of"
  note: "Snapshot of the UN's endorsement page taken 6 August 2026; endorsements are still being added. The UN publishes these as logos without names, so the names here are transcribed and may contain errors — tell us about any you spot."
  # The citation renders as a real link after the note. Kept as separate keys
  # rather than markdown inside `note`, because the component is a client
  # component and inlineMd() is server-only — it reads the filesystem.
  sourceLabel: "Source: United Nations Open Source Principles"
  sourceUrl: "https://opensource.un.org/en/news/united-nations-open-source-principles"
foot:
  text: "Ready to ask the city to adopt them?"
  ctas:
    - href: /campaign
      label: "Sign the open letter →"
      style: primary
    # outline-dark, NOT outline: `.unnyc-btn--outline` is white text on a white
    # border, built for the dark hero/CTA bands. On this page's light foot it was
    # invisible — white on white. outline-dark is the light-background variant.
    - href: /crosswalk
      label: "Why this matters to NYC"
      style: outline-dark

# ============================================================================
# THE EIGHT UN OPEN SOURCE PRINCIPLES — THE SINGLE SOURCE
# ----------------------------------------------------------------------------
# Three surfaces render these. Until 2026-08-06 each kept its OWN copy and they
# had drifted: the open letter said "Foster inclusion" and a bare "RISE", and an
# Oxford comma had crept into the declaration. Editing one changed one page.
#
#   /principles (the grid)       grouped, `title`
#   /principles/document         grouped, `titleDocument || title`,
#                                `descDocument || desc`, group `titleDocument`
#   /campaign/sign (the letter)  flat 1-8 by `n`, `titleCanonical`, `descShort`
#   /campaign/endorse/document   grouped, `titleCanonical`, `descCity || desc`
#
# So each principle carries every surface form it needs. These are VARIANTS ON
# PURPOSE, which is a different thing from the drift they replaced:
#
#   n               The UN's own number. Drives the icon AND the letter's order
#                   (the groups deliberately reorder them: 3,5,6 / 4,7 / 2,8).
#   title           The GRID's wording, and the grid's alone. Was the gerund form
#                   ("Contributing back") because the group headings used to
#                   demand it — "Building Good Software that is… Well
#                   documented". The headings were shortened on 2026-08-14
#                   ("Build software that is:"), so these are now the plain
#                   forms and mostly match `titleCanonical`. They are still a
#                   SEPARATE field: #6 reads "Well documented" in the grid but
#                   is canonically "Provide documentation", and collapsing the
#                   two would silently retitle it on three other surfaces.
#   titleCanonical  The UN's own name for the principle. Used anywhere the
#                   principle is named on its own, with no heading to agree with.
#   desc            The full description.
#   descShort       Terse one-liner for the letter's numbered list, where the
#                   full description would swamp the line.
#   descCity        OPTIONAL. NYC-facing rewording for the declaration, where
#                   the City is the one committing rather than the UN. Only #8
#                   needs it today ("the City" not "the UN system"). Falls back
#                   to `desc`.
#   titleDocument   OPTIONAL. /principles/document only. Falls back to `title`.
#   descDocument    OPTIONAL. /principles/document only. Falls back to `desc`.
#                   The printable document was rewritten into the IMPERATIVE on
#                   2026-08-14 ("Make security a priority", not "Making") and
#                   retitles four principles. Those two fields are why that did
#                   not also rewrite the grid, the letter and the endorsement
#                   declaration, which all still read the gerund forms.
#                   The document's GROUPING is separate again — see
#                   `groupsDocument` at the top of principlesDoc.
#
# ⚠ To change a principle's wording, change it HERE. Nothing else holds a copy.
# ============================================================================
principlesDoc:
  # ------------------------------------------------------------------------
  # THE PRINTABLE DOCUMENT'S OWN GROUPING (/principles/document only).
  #
  # It is TWO groups, not the UN's three: "Participate in the community" was
  # dropped on 2026-08-14 and its two principles redistributed — #8 to the end
  # of Build software, #2 to the end of Create community.
  #
  # It lives here, as slugs, rather than by rearranging `groups` below, because
  # that array is read by FOUR surfaces: the /principles grid, the endorsement
  # declaration (via principlesDeclaration), the open letter and the detail
  # sections (both via a flatten). Moving items between groups there would
  # restructure the grid and the declaration too — and would break the grid
  # grammatically, since its headings still read "Build software that is:",
  # which does not lead into "Sustain and scale".
  #
  # ⚠ This means the document presents a DIFFERENT structure from the rest of
  # the site and from the UN's own published grouping, under a footer citing
  # the UN as source. That was asked for; it is worth re-reading before print.
  #
  # Slugs resolve against every principle below. An unknown one FAILS THE
  # BUILD rather than silently dropping a principle from the printed page.
  # ------------------------------------------------------------------------
  groupsDocument:
  - title: "Build software"
    items: [secure-by-design, design-for-reusability, provide-documentation, sustain-and-scale]
  - title: "Create community"
    items: [foster-inclusion, rise, contribute-back]
  lead:
    n: 1
    slug: open-by-default
    icon: unlock
    title: "Open by default"
    titleCanonical: "Open by default"
    # The printable document capitalises it. Grid and letter do not.
    titleDocument: "Open by Default"
    # Grid copy only. The letter uses `descShort`, the declaration `descCity` —
    # both still carry the full "vendors ought to justify why their solutions
    # should be closed" argument that this line no longer states.
    body:
    - "Make open source the standard approach for projects."
    # ⚠ REVERSES the 2026-08-14 decision to keep the full burden-of-proof
    # argument on the printable document. Asked for explicitly later the same
    # day, so the document now carries the same one-liner as the grid. The long
    # form is still on /campaign/endorse/document via `descCity`, and in git.
    descShort: "Open source as the standard approach for projects"
    # The declaration states this as the City's own commitment, in one paragraph.
    descCity: "Using open source software components to build solutions for the city is the standard and default approach to creating software. There are very few scenarios when open source isn’t appropriate."
  groups:
  - title: "Build software that is:"
    titleDeclaration: "We Build Good Software"
    items:
    - n: 3
      slug: secure-by-design
      icon: shield-check
      title: "Secure by design"
      titleCanonical: "Secure by design"
      titleDocument: "Secure by Design"
      desc: "Making security a priority in all software projects."
      descDocument: "Make security a priority in all software projects."
      descShort: "Security as a priority in all software projects"
    - n: 5
      slug: design-for-reusability
      icon: recycle
      title: "Design for reusability"
      titleCanonical: "Design for reusability"
      titleDocument: "Designed for reusability"
      desc: "Designing projects to be interoperable across various platforms and ecosystems."
      descDocument: "Design projects to be interoperable across various platforms and ecosystems."
      descShort: "Interoperable across platforms and contexts"
    - n: 6
      slug: provide-documentation
      icon: book-open
      title: "Well documented"
      titleCanonical: "Provide documentation"
      desc: "Providing thorough documentation for end-users, integrators and developers."
      # titleDocument omitted — "Well documented" is already the `title`.
      descDocument: "Provide thorough documentation for end-users, integrators and developers."
      descShort: "Thorough documentation for end users"
  - title: "Create solutions that:"
    titleDeclaration: "Our Solutions are Cocreated with our Users"
    items:
    - n: 4
      slug: foster-inclusion
      icon: users
      title: "Foster inclusive participation and community building"
      titleCanonical: "Foster inclusive participation and community building"
      titleDocument: "Foster inclusive participation"
      desc: "Enabling and facilitating diverse and inclusive contributions."
      descDocument: "Enable and facilitate diverse and inclusive contributions."
      descShort: "Inclusive participation and community building"
    - n: 7
      slug: rise
      icon: award
      title: "RISE (recognize, incentivize, support and empower)"
      titleCanonical: "RISE (recognize, incentivize, support and empower)"
      titleDocument: "RISE (recognize, incentivize, support, empower)"
      desc: "Empowering individuals and communities to actively participate."
      descDocument: "Empower individuals and communities to actively participate."
      descShort: "Recognize, incentivize, support, and empower communities"
  - title: "Be collaborative:"
    titleDeclaration: "Collaborating globally to deliver locally"
    items:
    - n: 2
      slug: contribute-back
      icon: git-pull-request
      title: "Contribute back"
      titleCanonical: "Contribute back"
      desc: "Encouraging active participation in the Open Source ecosystem."
      descShort: "Active participation in the open source ecosystem"
      descDocument: "Encourage active participation in the open source ecosystem."
    - n: 8
      slug: sustain-and-scale
      icon: trending-up
      title: "Sustain and scale"
      titleCanonical: "Sustain and scale"
      desc: "Supporting the development of solutions that meet the evolving needs of the UN system and beyond."
      descShort: "Solutions that meet evolving needs over time"
      descCity: "Supporting the development of solutions that meet the evolving needs of the City and beyond."
      # Trailing period added — the supplied line had none, and every sibling
      # in the printed list ends with one.
      descDocument: "Support the development of solutions that meet evolving needs."
---

<!-- Per-principle prose MOVED here from content/crosswalk.md on 2026-08-13.
     `## <slug>` matches the `slug:` on each principle above, which is what the
     clickable grid jumps to. `### The Gap` renders the highlighted panel. -->

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
