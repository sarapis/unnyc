# Session continuation prompt

Paste the block below into a new session. Everything above the line is context for
whoever is maintaining this file.

**Last updated 2026-08-20.** The stretch from #28 to #46 rebuilt `/principles`,
added the endorser directory and both rails, and moved the site onto a new domain
twice. This file is the one doc guaranteed to be read first,
so it is the one most damaging to leave stale — it spent 2026-08-19 describing a
homepage, a principles grid and a hostname that had all changed, which is exactly
the failure its own header warns about. **Rewrite it whenever something lands.**

---

I'm continuing work on the **UNNYC campaign site**. Start by querying the Hub
(`get_workspace_detail("unnyc")`, `list_tasks(workspace="unnyc")`,
`search_knowledge(query="wegovnyc design system")`) and reading
`~/vault/workspaces/unnyc.md`, then this repo's `CLAUDE.md`, `README.md` and
`docs/EDITING-CONTENT.md`.

## Where the site lives — CHANGED 2026-08-20

**The campaign is at `https://un.opensource.nyc`.** A subdomain, deliberately, so
the apex is free for a future `opensource.nyc` homepage that does not exist yet.

    un.opensource.nyc     200, serves the campaign
    opensource.nyc        307 -> un.opensource.nyc
    www.opensource.nyc    307 -> un.opensource.nyc
    unnyc.wegov.nyc       307 -> un.opensource.nyc

All four are on the ONE Vercel project `unnyc-campaign`, so the folding happens in
`next.config.mjs` host rules, not at DNS. DNS is Cloudflare (same account as
wegov.nyc), **DNS-only / grey cloud** — proxying in front of Vercel is not how any
of these are set up.

**Every redirect is a 307, not a 308, on purpose.** The apex moved twice in two days
(08-19 it became primary, 08-20 it became a redirect); a permanent redirect would
have been cached hard and painful both times. The apex rule in particular is
expected to be DELETED rather than promoted — when opensource.nyc becomes its own
site it will be a different Vercel project and apex DNS repoints at it.

## Read this part before you touch anything

1. **Pushing `main` deploys to production.** No gate, no preview step.
2. **You are probably not the only session in this checkout.** Never `git add -A`,
   `git add .`, or `git commit -a` — a PreToolUse hook refuses them. Stage by name
   and read `git diff --cached --name-only` before every commit.
3. **Olivia Croteau works IN THIS REPO, not a fork.** `CLAUDE.md` and this file both
   said "PRs from a fork" for weeks; `gh pr view --json isCrossRepository` returns
   false. It matters: you can push straight to her branches, which is the
   difference between "comment and wait" and "fix it in place".
4. **The CMS at next.sarapis.org is production.** Self-hosted Docker on Hetzner
   `178.156.248.253`, image `sarapis-site:r43`, `--env-file /opt/sarapis/.env`.
   ⚠ Its own workspace `CLAUDE.md` claims it "serves wegov.nyc + databook.nyc" —
   IT DOES NOT. wegov.nyc is Vercel, databook.nyc is Cloudflare + PHP 7.4. They
   READ from it. A container recreate is a measured ~1.5-2s 502 on next.sarapis.org
   only. The user approves go-live.
5. **CORS is the most expensive mistake available here.** A missing origin fails
   INVISIBLY — the browser blocks the POST and the form shows a generic error.
   unnyc.wegov.nyc was missing for two days in August and every submission was
   silently dropped. All four campaign hosts are allowlisted, and the three that
   only redirect are NOT redundant: a redirect does not help a cross-origin POST,
   because the browser preflights the ORIGINAL host.
   The allowlist is in code as of 2026-08-20 (`sarapis-website` PR #1, merged).
   ⚠ But `CORS_ORIGINS` in `/opt/sarapis/.env` is ALSO still set, and the running
   image is `r43` — which predates the code change, so the env var is what is
   actually serving it today. Both produce the same result. When r44 ships, drop
   the env var so one place owns this; dropping it BEFORE r44 breaks the live
   domain.
6. **`localhost` is not in the CORS allowlist**, so every form fails locally with
   the generic error. That is expected, not a bug.

## How to verify anything here

This project keeps producing bugs that fail *silently* and look like "no data yet"
or "working fine". Ranked by how much time each has cost:

- **Selector matching is ground truth; computed styles in the preview pane are
  not.** Post-interaction `getComputedStyle` comes back stale — it reported an
  endorser chip as white text when it was rendering dark blue, and the screenshot
  the user sent was the only thing that caught it. `el.matches(selector)` and the
  shipped CSS text are reliable.
- **IntersectionObserver DOES NOT RUN in the preview pane, or in any page these
  tools drive.** `document.visibilityState` is `hidden`, and a fresh observer with
  no rootMargin fires ZERO callbacks — verified against production, not just the
  dev server. So scroll-spy state cannot be exercised at all. Verify the CSS and
  the class logic; ask the user to confirm the highlight tracks.
- **Measure the whole set, never one element.** A rail was designed against "571px
  of empty gutter" measured from a single paragraph; all eight sections actually
  had a float panel there. Check every instance.
- **A "CLEAN" mergeable status is not "both changes survived".** Two PRs touching
  the same file on different lines merge without conflict and can still drop one
  side's intent. Merge main in locally and grep for both.
- **Read the rendered DOM, not the source you just wrote**, and `curl` the page to
  see which tag wraps the text.
- **Poll for a string unique to the NEW version** when waiting on a deploy.
- **A green build is not a working page**, and a green CI check may have run
  against an older base.

## Page structure as of 2026-08-20

Thirteen routes. Reader path and nav order: `/` -> `/start` -> `/principles` ->
`/crosswalk` -> `/success` -> `/resources`, plus `/campaign*` and `/contact`.

- **`/` has four cards matching the nav's first four** (`/start`, `/principles`,
  `/crosswalk`, `/success`), left-to-right then top-to-bottom, no numbers.
  ⚠ Resources has NO card, and is NOT in the footer — the top nav is its only
  link from the homepage. ⚠ Card 1 still shows the favicon-as-logo placeholder;
  it has moved three times and is now the most prominent it has been.
- **`/principles` is two named sections**, each opening on one principle as a
  full-width card then three in columns: **Software Principles** (Open by default
  + Secure by design / Design for reusability / Well documented) and **Community
  Principles** (Contribute back + Foster inclusive participation / RISE / Sustain
  and scale). No sub-headings. Below that, the eight NYC arguments with a
  **sticky side rail**, then the **endorser directory**.
- **`/crosswalk` is six numbered reasons** with its own sticky reasons rail,
  reusing the same component. Dollar figures link to Databook.NYC records.
- **`/principles/document`** and **`/campaign/endorse/document`** are printables.

## The principles are single-sourced, and the variants are the whole design

`content/principles.md` holds every principle ONCE. Four surfaces render them and
each wants different words, so each principle carries its surface forms explicitly.
There were three drifted copies before 2026-08-06; do not make a fourth.

    title           the /principles grid
    titleCanonical  the UN's own name — letter, endorse doc, detail headings, rail
    desc            full description
    descShort       the letter's numbered list
    descCity        NYC-facing, the endorsement declaration
    titleDocument   /principles/document ONLY
    descDocument    /principles/document ONLY
    body            the line shown when a principle is a full-width lead card
    bodyDocument    (removed 08-20 — the document now uses `body`)

**Groupings are slug references, not rearrangements**, because `groups` holds the
objects and is FLATTENED by `principlesFlat()` for the letter and by `/principles`
for its detail sections and rail. Moving objects between groups is how a principle
vanishes from a surface that only flattens.

    groupsGrid      /principles + the endorsement declaration (two sections)
    groupsDocument  /principles/document (its own two groups)

`principlesResolve()` in `src/lib/content.js` resolves either and **throws** on an
unknown slug — `lint:content` does not check these refs.

⚠ Both printables now present TWO sections where the UN publishes THREE, and give
#2 Contribute back a lead treatment the UN reserves for #1. Owner decisions, but
the endorsement declaration is the document intended for OTI and it cites the UN
as its source.

## The endorser directory

`/principles` closes on **150 organizations**, filterable by sector, paginated 16 a
page, from `content/un-endorsers.json` (a 2026-08-06 snapshot of the UN's page).

- **NO LOGOS, deliberately.** They are third-party trademarks and the UN showing
  them grants no onward rights. Names and sectors only; the file is 14 KB.
- **The names are a TRANSCRIPTION.** The UN page carries 154 logos and zero names —
  every card title element is empty. One error is already recorded in
  `corrections`: #143 was "RTÉ", the Irish broadcaster; the logo is RTE, the French
  grid operator.
- 154 raw -> 150: #121 unnamed, #114 a KDE duplicate, #3 and #21 unclassifiable.
- **Counts are DERIVED, never authored.** ⚠ The lede says "Hundreds" over a
  countable 150 — owner's wording, noted in the content.
- ⚠ **10 organizations the page used to name are absent** from the snapshot — Open
  Knowledge, OpenInfra, Matrix, Sovereign Tech Agency, ZenDiS, Nextcloud,
  Rocket.Chat, Linagora, LPI, European Open Source Academy. Checked by name, alt
  slug and source URL. Probably means the UN's logo wall is not the authoritative
  list; unresolved.

## CSS: the one rule that would have saved five bugs

**In `@layer unnyc`, scope any component rule that sets `color` on an `<a>` or
`<button>` with `.unnyc-page`.** The resets are TWO-part selectors —
`.unnyc-page a { color: inherit }` and `.unnyc-page button { border: none;
background: none }` are both (0,1,1) — so a single-class component rule (0,1,0)
LOSES to them in the same layer. Five collisions in two days, all this shape:

1. navy-on-navy sign-form tabs (the button reset)
2. endorser chips rendering as bare text (the button reset)
3. rail links all navy, muted/active indistinguishable (the anchor reset)
4. `:hover` (0,3,0) out-specifying `--active` (0,2,0), repainting the SELECTED
   chip dark-on-dark — the one the user caught in a screenshot
5. the same hover/active trap on the pagination buttons

**And a sixth of a different kind:** `/principles` and `/crosswalk` both styled
`.unnyc-principles__rail` in separate stylesheets at equal specificity. Next.js
keeps both sheets in the DOM after a client-side navigation, so source order won
and the rail landed 400px inside the prose — **only when arriving by nav click; a
fresh load was always fine.** Fixed by scoping each page's positioning to its own
wrapper, then Olivia consolidated the shared nav-look into `primer.css`.

## Other things that will bite you

- **`getContent()` is server-only and must be called inside the component or
  `generateMetadata`**, never at module scope.
- **A frontmatter key named `sections` is silently overwritten** by the parsed body.
- **`sections.*.html` goes in a `<div>`; `inlineMd()` goes in a `<p>`.** Block-level
  HTML inside a `<p>` splits the DOM and silently drops the page to client
  rendering.
- **`.unnyc-btn--outline` is white-on-white on light backgrounds** — use
  `--outline-dark`. A "missing" button is usually invisible, not misplaced.
- **Never write `*/` inside a CSS comment.** Turbopack fails confusingly.
- **`metadataBase` emits NOTHING on its own** — it only resolves the relative
  paths a page passes. Setting it without those is how the site ran for weeks with
  no canonical tag on any route. Fixed 2026-08-20: every route builds its metadata
  through `pageMetadata(meta, path)` in `src/lib/seo.js`, which sets
  `alternates.canonical` AND `openGraph.url` from ONE hand-written path.
  **`/campaign/endorse/document` is the deliberate exception** — it is `noindex`,
  and a self-canonical on a noindex page contradicts itself, so that page keeps a
  hand-written block with a comment saying so. A new route that hand-rolls its
  metadata is how the next missing canonical happens.
- **Adding a domain to Vercel does not bind it to the existing production
  deployment.** `un.opensource.nyc` was verified with a valid certificate, TLS
  completed, ALPN negotiated — and Vercel never answered. A no-op `vercel deploy
  --prod` of unchanged `main` fixed it instantly. A verified domain that hangs on
  HTTP means "no deployment bound", not DNS or TLS.
- **Content edits should go through a PR** so `lint:content` runs before deploy.
- **`public/images/CREDITS.md` is a licence record** — update it in the same commit
  as any image change, including when a card's "Used on" column moves.

## Open work

Nothing is blocking.

**SEO / AI discoverability: see [SEO-PLAN.md](SEO-PLAN.md)** — audited
2026-08-20, phase 1 shipped (canonicals on all 12 indexable routes, real
`robots.txt` + `sitemap.xml` from one route table, `og:site_name` restored,
`/resources` given the `<h1>` it never had, two host redirects flipped to 308).
Phase 2's link-preview images shipped the same day: twelve generated
`/og/<slug>.png` cards, built from the same `ROUTES` table as the canonicals and
the sitemap, with `twitter:card` raised from `summary` to `summary_large_image`.
`/principles/document` also got its own metadata block (`metaDocument:` in
`content/principles.md`, reached via `metaKey` on the route entry), so it no
longer shares a title, description, preview image or breadcrumb leaf with
`/principles`. Phase 3 shipped too: ten JSON-LD graphs across eight routes (`Organization` +
`WebSite`, a `DefinedTermSet` for the glossary, `ItemList`s for the 150 endorsers
and the 18 OSPOs, `Article` on the guide, breadcrumbs on the four nested routes),
all built from the content files. Phase 2's length pass is done as well: eleven title/description fields across
six content files, none now over the length a search result or social card shows,
with a **new `lint:content` warning** (check 6) to catch the next drift.
Phases 4-6 are open — the citable-datasets bet, off-site presence, performance.
The only decision still outstanding is phase 4's licence question; the other two
from that list are resolved.

1. **A photo for homepage card 1** — still the favicon placeholder, now first.
   `public/images/success/tokyo.jpeg` is paid-for and unused but has been rejected
   twice: a skyline beside card 4's Barcelona reads as a case study.
2. **Decide the two-sections-vs-the-UN's-three question** for the endorsement
   declaration before it goes to OTI.
3. **Resolve the 10 missing endorsers** — union of both lists, or leave as is.
4. **"Hundreds" vs 150** in the endorser lede.
5. **Retire `old-unnyc.wegov.nyc`** whenever wanted; nothing depends on it.
6. **The CTFG directory question** — Hub task `168a959d`.
7. **A shared component package** — Hub task `7656df36` (Backburner).
8. **Exposed keys in `wegovnyc_front` history** — Hub task `51968fc0`.
