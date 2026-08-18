# UNNYC

> Standalone campaign site: make NYC the first city in the Americas to endorse the
> UN Open Source Principles. Next.js on Vercel, live at **https://unnyc.wegov.nyc**.

Read [README.md](README.md) first — routes, the two form paths, env, CSS layers.
Read [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md) before changing any copy.
This file is the agent-specific delta.

## Repo shape

Next app is at the **repo root** (no `frontend/` subdirectory — unlike its parent
repo `wegovnyc_front`). Vercel's defaults work unchanged.

## ⚠️ Pushing to `main` deploys to production

Git integration was connected 2026-08-04. **A push to `main` goes live at
unnyc.wegov.nyc immediately** — there is no manual gate. Push deliberately.

`vercel deploy --prod` still works if you need to force a deploy without a commit
(e.g. after a CMS change), but it's no longer required.

**A fresh clone can't deploy manually until it's linked** — `.vercel/` is
gitignored, so run `vercel link --yes --project unnyc-campaign` first.

**This repo is PUBLIC**, and had to be: Vercel's Hobby plan refuses git
integration for *private* org-owned repos (409, "Upgrade to Pro"). Public
org-owned is fine — which is why the sibling `wegovnyc_front` always worked. Its
history was audited clean before flipping (no secret-shaped file has ever existed
in it; `.env.example` is placeholders only). Secret scanning + push protection are
ON. **Keep real secrets in Vercel env vars, never in a commit.**

Vercel project is `unnyc-campaign` (not `unnyc` — that name belongs to the older
Vite site, now at `old-unnyc.wegov.nyc`). Don't "fix" the name by taking `unnyc`;
that would collide with a live site.

## ⚠️ Another session may be working in this checkout

More than one Claude session gets run against `~/Antigravity/unnyc` at a time.
On 2026-08-07 that cost real effort three times in one afternoon: files from a
concurrent session appeared **staged** in the middle of another session's
commit, and a second session committed its work **on top of** an unpushed
commit, so the two could not be shipped separately without a rebase.

**Assume you are not alone in this working tree.**

1. **Never `git add -A`, `git add .`, or `git commit -a`.** Stage the paths you
   actually edited, by name. This is the single rule that would have prevented
   all three incidents.
2. **Read `git diff --cached --name-only` immediately before every commit** and
   confirm every path is one you touched this session. If something unfamiliar
   is staged, `git restore --staged <path>` — do not commit it, and do not
   revert it either; it is someone's work in progress.
3. **`git status` before you start** and again before you commit. Files you did
   not write, or a HEAD that moved under you, mean another session is live.
4. **Never rewrite a branch you did not create** (rebase, reset, amend,
   force-push) without: a backup ref first, and afterwards proving the patch is
   unchanged — `git show <old> --format="" > /tmp/a; git show <new> --format=""
   > /tmp/b; diff /tmp/a /tmp/b`. Say what you did and where the backup is.
5. **Doing substantial parallel work? Use a worktree** (below) rather than
   sharing this one.

### Worktrees

One repo, several checked-out directories, each on its own branch. Git refuses
to check the same branch out twice, which is precisely the protection wanted.

```bash
git -C ~/Antigravity/unnyc worktree add ~/Antigravity/unnyc-<task> -b <branch>
git -C ~/Antigravity/unnyc worktree list
git -C ~/Antigravity/unnyc worktree remove ~/Antigravity/unnyc-<task>
```

Four things are NOT inherited, all because they are gitignored:

| | |
|---|---|
| `node_modules` | needs its own `npm install` — **350 MB**, and `@wegovnyc/design-tokens` is a git dep so it needs network |
| `.vercel` | `vercel link --yes --project unnyc-campaign` before any manual deploy |
| `.next` | cold first build; fine, just expected |
| dev server port | `.claude/launch.json` uses 3100 — give a second worktree its own |

Commits and branches ARE shared instantly (one object store), so the other
worktree's work shows up in `git log` with no fetching. Remove a worktree when
its branch merges; stale ones accumulate 350 MB apiece.

## All copy is in `content/*.md`

One file per page, frontmatter for structure + markdown body for prose, rendered at
build time by `src/lib/content.js`. **To change wording, edit the markdown — never
the JSX.** Page components are layout only.

Markers an editor can place on their own line: `{{stats}}` (success.md, the stats
row mid-case-study) and `{{principles}}` (sign.md, the eight-principles list).

`scripts/validate-content.mjs` (`npm run lint:content`) guards these files. It
runs in `prebuild` **and** as the `Validate content` GitHub Action on every push
and PR — the PR run is the one that matters, since a push to `main` deploys with
no gate. It checks YAML validity, unterminated quotes, frontmatter slugs missing
their `## slug` section, duplicate `### Label` keys, and unknown `gloss:` refs
(that last one warns only). Errors exit 1.

## The CTFG map layer (MERGED and live as of `7faaf97`, 2026-08-07)

`/start#going-open-source` has a second, deliberately quieter map layer: **62 government-built
open source programs across 24 countries**, sourced from the Civic Tech Field Guide, each dot linking
to its CTFG profile. Toggleable, default on.

> ⚠ This section previously said "built but held — local-only on that branch." That stopped being
> true when the branch was merged and deployed. If the open question about linking into the CTFG
> directory while it is de-indexed pre-launch still matters, it is **live now** and needs deciding,
> not deferring.

- **It is a SUPPORTING layer, not a replacement.** The section's argument is the curated policy
  markers (who endorsed; that NYC hasn't). Replacing them with project data undercuts it — NYC lights
  up with dots. So CTFG dots are 9px teal, drawn *beneath* the policy markers, and switchable off.
- **`content/ctfg-gov-open-source.json` is a curated SNAPSHOT, not a live fetch** — refresh with
  `node scripts/fetch-ctfg-projects.mjs` and read the diff. Reasons: the map can't go half-empty if
  the CTFG API is slow, and CTFG's `orgType` tagging has noise (6 entries are excluded there with
  reasons — nonprofits, an advocacy coalition, a private LLC, a dead Wayback URL).
- `getCtfgProjects()` in `src/lib/content.js` is **fail-soft on purpose**, unlike `getContent()`: a
  missing snapshot costs the dots, never the page.
- **CTFG popup fields are escaped** (`esc()` in `PrimerMapInner.js`) — third-party data, unlike the
  hand-authored markers beside it.
- **Attribution is a licence term**, not a courtesy: CTFG content is CC BY-NC-SA 4.0, so the credit +
  `civictech.guide` link render under the map, counts read from the snapshot so they can't drift.
  Wording lives in `content/start.md` (`mapSource`) per the copy-in-markdown rule.

## The four map layers (rescoped 2026-08-17)

`/start#going-open-source` carries, bottom to top: the **GovOSS country fill**, the
**CTFG programs**, the **public sector OSPOs**, and the curated **policy markers**.

**No toggles, no counts in the key, one line per row** (owner decision). The legend is
a key, not a control panel: the three checkboxes and their `useState`/`useEffect`
pairs are gone, every layer is simply on, and counts live in the popups where a
reader asking for a number already is. Two consequences worth knowing:

- **The country fill is ONE flat tone** (`FILL_OPACITY`), not the four-step ramp it
  shipped with. A single-colour key over a graded map would make the legend disagree
  with the map, so the grading went with it. The fill now says *this government
  publishes a catalogue*; how many is in the popup. Real information lost at a
  glance, deliberately — the layer is ground for the markers, not the subject.
- **The legend column is `max-content`, not a fixed 220px.** `white-space: nowrap`
  makes a label one line by pushing it OUT of a box it does not fit, which is worse
  than wrapping — two labels overflowed the card that way before the column was
  allowed to size to its content. "Fits one line" is now structural rather than a
  number to re-tune whenever a label changes. The mobile breakpoint still drops to
  one column and wraps the key into a row; checked at 375px, no overflow.

**Removed the same day, by owner decision:** the crimson **NYC "the ask"** marker and
both **UN system** markers. ⚠ Nothing is drawn on New York by the policy layer any
more, so *the map no longer states the ask* — the surrounding copy carries it alone.
If that copy is ever cut, the section loses its point entirely. (The UNDP's OSPO does
put a violet pin on New York. That is the OSPO layer being correct, not the ask
marker returning.)

Also removed: the **Finland** and **Germany** `nation` markers, because the country
fill already shows both. The other five stay — **Estonia, Iceland, India, Sierra
Leone, Jamaica** — precisely because GovOSS has no catalogue for them, so dropping
them would have deleted governments from the map rather than re-drawn them. Estonia's
X-Road is the case that makes the rule worth keeping.

### One credit line

The two credit paragraphs under the map became one (2026-08-17). They restated each
layer's counts; those now live in the popups and the key, so repeating them under the
map only gave a reader more numbers to reconcile. Two lines instead of six or so.

⚠ **What cannot be shortened away is attribution — it is a LICENCE TERM for two of
these, and the licences differ.** GovOSS is **CC BY 4.0**; the Civic Tech Field Guide
is **CC BY-NC-SA 4.0**. Source name, link and licence stay for both. Everything after
the lead-in is read from the snapshots (`licence`, `sourceUrl`, `generated`,
`boundariesShort`) so it cannot drift from the data it describes; only the lead-in is
copy, in `mapSource.creditLead`.

Dropping the counts also retired a caveat: the old line had to explain that 256
entries sit in cross-border catalogues no country can be shaded for, *because it
claimed a total*. Make no numeric claim and there is nothing to qualify.

The line is built from parts, so a missing snapshot drops its own clause rather than
the whole credit — the same fail-soft posture as the loaders.

### The OSPO layer

18 OSPOs → **12 map points**, built from `ospoDirectory` in `content/resources.md` —
the SAME list `/resources` renders, never a copy, because a second list drifts the
first time somebody adds an OSPO to one of them.

- **Coordinates are hand-placed on each item**, with `locationBasis`: `seat` where the
  body's own city is unambiguous, `hq` where it sits at the parent organisation's
  headquarters. The popup marks `(HQ)`, because "approximately here" and "here" are
  different claims. ⚠ Two were nearly placed wrong and the **domain** settled both:
  `pcll.ac-dijon.fr` is Dijon, not Paris; `echirolles.fr` is Échirolles, not Grenoble.
- **Grouped by city, then cities within 25 km merged** (`OSPO_MERGE_KM`). Four French
  OSPOs are in Paris and the IGN's is in Saint-Mandé 5 km away — at world zoom that is
  one pixel, so separate markers would have silently hidden four of five. Each entry
  keeps its real city in the popup: **merging changes what is drawn, never what is
  claimed.**
- **OSPO markers are squares**; every other layer is round. One city can hold five
  OSPOs and a policy marker at the same pixel, and shape separates them where colour
  alone would not — including for a red-green reader.
- The static `mapLegend` row for `ospo` is filtered out when the layer loads, or the
  legend would show it twice: once as a swatch, once as its checkbox.

## The GovOSS country fill (2026-08-17)

`/start#going-open-source` now has a THIRD layer, painted beneath the other two: a
choropleth of how many open source projects each country's own public catalogues
list, from **GovOSS** (`govoss-catalog.vercel.app`). 13 countries, 17 catalogues,
2,619 country-attributed projects. Click or tab a country for its count and a link
to each catalogue.

**The stacking order is the argument, not a style choice.** Running a public code
catalogue and endorsing the UN Principles are different claims and they disagree:
Italy has one of the largest catalogues here and is not in the policy layer at all;
Barcelona endorsed first and has no catalogue in GovOSS. Inventory as the ground and
endorsement as the figure is what makes that gap legible — which is the case for the
ask. Invert it and the page argues something else.

- **Snapshot, not a live fetch** — `node scripts/fetch-govoss-catalogues.mjs`, same
  three reasons as the CTFG layer. It writes **two** files on purpose:
  `content/govoss-catalogues.json` (counts — meant to be read in a diff) and
  `content/govoss-countries.geo.json` (19 KB of Natural Earth polygons — never
  readable in a diff, and burying the counts inside it would hide the reviewable
  half). `getGovossCatalogues()` loads them independently and fails soft on each.
- **Licence differs from the layer beside it.** GovOSS is **CC BY 4.0**; CTFG is CC
  BY-NC-SA 4.0. The two credit lines are not interchangeable. Boundaries are Natural
  Earth, public domain.
- ⚠ **Never render the sum of the country counts.** It matches neither total, in
  both directions at once: 256 entries sit under `GLOBAL`/`EU` and get no polygon,
  while an entry listed by catalogues in two countries counts under each. 2,619
  summed against GovOSS's actual 2,772. Use `countryAttributedEntries` (what the
  polygons cover) or `totalEntries` (GovOSS's headline), never arithmetic on the
  fills.
- ⚠ **Natural Earth's `ISO_A2` is `-99` for several countries, France among them.**
  Matching on it alone silently drops the LARGEST catalogue here (676) and looks
  like a rendering bug. The fetch script falls through `ISO_A2_EH → ISO_A2 → WB_A2 →
  ADM0_A3` and **throws** if any country ends up without a polygon.
- **France is trimmed to metropolitan + Corsica** (`TRIM` in the fetch script).
  Natural Earth includes French Guiana and is correct to — Guiana is France — but a
  shaded patch in South America reads as an error on a map about European
  catalogues. An editorial call, so it is named per-country with its reason and the
  dropped part is recorded in the snapshot's `trimmed[]`, beside the counts, rather
  than hidden in the polygon file.
  ⚠ **Never generalise this into a "drop distant parts" rule.** It would gut the
  map: Canada is 30 parts and 27 sit >15° from the mainland — the Arctic
  archipelago, Newfoundland, Nova Scotia, Vancouver Island — and Italy's outliers
  are Sicily and Sardinia. The threshold that trims Guiana also trims most of
  Canada, and would look like a rendering glitch rather than a decision.
- **The fill is keyboard-reachable, and that took work.** Leaflet makes *markers*
  focusable but GeoJSON paths are bare SVG. The tabindex/aria/Enter wiring must run
  on the layer's **`add`** event — inside `onEachFeature` the path has no DOM element
  yet, `getElement()` returns null, and the whole block silently no-ops with a green
  build. Counting `[tabindex]` in the rendered page is what caught it.
- **Leaflet panes already keep the fill under the markers** (overlayPane 400 vs
  markerPane 600, measured). The `bringToBack()` call orders it against future vector
  layers; it is not what protects the dots.

### Coverage audit vs CTFG (2026-08-07)
Every project/org/resource/OSPO on this site was cross-checked against the full CTFG directory:
**61 entities — 20 have CTFG profiles, 41 don't** (30 civic/gov-tech, 11 general FOSS). Largest gap:
**17 of 18 OSPOs** in `/resources` are absent from CTFG — this site's OSPO directory is the better
source. Also: `/success` says "Sovereign Tech **Fund**"; it renamed to **Agency** in 2025.
⚠️ Method note if you redo it: match on homepage domain, but **exclude shared hosts**
(`un.org`, `nyc.gov`, `github.com`, `ec.europa.eu`) — a domain hit there proves nothing and produced
several false positives on the first pass.

## Page structure as of 2026-08-14

Thirteen routes. The reader path is `/` → `/start` → `/principles` → `/crosswalk`
→ `/success` → `/resources`, which is also the nav order.

Two restructures landed this day and the docs above/below assume them:

- **`/principles` is a top-level page** (was the `#principles` section of `/start`).
  It pairs the plain-English grid — now eight jump links — with the per-principle
  NYC argument that used to be the *body of `/crosswalk`*. That prose MOVED; it is
  not duplicated. `/start/principles` (the printable one-pager) moved to
  `/principles/document` behind a 308.
- **`/crosswalk` is six numbered reasons**, not a principle-by-principle
  crosswalk. It kept only what is its own: what vendor reliance costs, and why NYC
  is central. Its dollar figures link to Databook.NYC contract records — keep new
  claims checkable the same way.

`/resources/guide` is the long-form UN-system briefing, ported from the retired
`old-unnyc.wegov.nyc` hub. **That host is no longer load-bearing.**

## Non-obvious things that will bite you

- **`getContent()` must be called inside the component or `generateMetadata`, not
  at module scope.** The markdown isn't a module dependency, so a module-level call
  is evaluated once per dev-server process and edits won't appear until a restart.
  This was a real bug; don't "optimise" it back.
- **`getContent()` is server-only** (uses `node:fs`). Never import it in a
  `"use client"` file.
- **`.unnyc-page button` is a 0-1-1 reset that beats every single-class component
  rule.** `unnyc.css` resets `border: none; background: none` on every button under
  `.unnyc-page`. A component rule like `.unnyc-cmp-form__tab--active` is 0-1-0, in
  the SAME `@layer`, so the reset wins. On 2026-08-14 that made the sign-form's
  active tab render navy text on the navy panel — dark blue on dark blue — because
  only `color` survived (the reset doesn't set it) while the background and border
  were stripped. **Scope any styled `<button>` with `.unnyc-page` (0-2-0)**, the way
  `.unnyc-page .unnyc-btn` already does. Symptom to recognise: a control whose text
  colour is right and whose background/border silently isn't.
- **`--outline` is for DARK backgrounds; `--outline-dark` is for light ones.**
  `.unnyc-btn--outline` is white text on a white border. On a light section it is
  invisible, not misplaced — a button that looks "missing" from a layout is usually
  this. Bit `/principles`' foot on 2026-08-14.
- **A frontmatter key is not proof the value reaches the page.**
  `endorsers.title` sat in `content/start.md` for months reading "Who Has Already
  Signed On" while the component hardcoded its own `<h3>`. Rendering the "real"
  value would have silently retitled a section. Grep the component first.
- **`getContent()` returns `{...frontmatter, sections}` — so a frontmatter key
  named `sections` is silently overwritten** by the parsed body. `content/guide.md`
  calls its section list `outline:` for exactly this reason.
- **Contain third-party z-indexes; don't escalate ours.** Leaflet ships panes at
  400-700, controls at 800 and `.leaflet-top`/`.leaflet-bottom` at 1000. The nav is
  50. The map painted over the header until `.unnyc-map-wrapper` got
  `isolation: isolate`, which confines Leaflet's ordering to one box. Raising the
  nav's z-index would have worked until the next widget.
- **`animation: none` under `prefers-reduced-motion` is only half a fix if the
  container is `overflow: hidden`.** `/success`'s marquee track is `max-content`
  (3340px); stopping it clipped every card past the first with no way to reach
  them, so reduce-motion users lost the section entirely. That media query now also
  makes the viewport scrollable. Check reachability, not just stillness.
- **A card link needs `padding: 4px 0` to be a legal tap target.** The four
  card-link rules (`.unnyc-pr-ospo__links a`, `.unnyc-pr-contact__link`,
  `.unnyc-pr-concept__link`, `.unnyc-pr-case__link`) are `display: block` with a
  22px line box, under WCAG 2.5.8's 24px minimum for a NON-INLINE target. All
  four carry the padding now and cross-reference each other; copy the pattern for
  a new one. Inline links in prose are exempt, so do not "fix" those.
- **next/image `fill` writes position/inset/width/height as INLINE styles**, so a
  class cannot override them. To inset or shrink a filled image, use `transform`
  (see `.unnyc-pr-path__image--logo`) — not `padding`, `inset` or `width`.
- **`sections.*.html` goes in a `<div>`; `inlineMd()` goes in a `<p>`/`<h*>`/`<li>`.**
  `sections.*.html` is block-level output — it already carries its own `<p>`. Put it
  inside a `<p>` and you get `<p><p>…</p></p>`, which is invalid: the browser closes
  the outer `<p>` and splits it into siblings, the parsed DOM stops matching what
  React rendered, and **the entire page silently falls back to client rendering**.
  `/campaign/sign`'s signoff did exactly this until 2026-08-11, and the only symptom
  was a dev-console hydration error — the page looked correct, because React
  re-rendered it correctly on the client. `inlineMd()` exists precisely for the
  phrasing-element case; every other consumer in the repo already uses it.
  To check a page: `curl` it and look for a block tag inside a `<p>`. Reading the
  JSX will not show you this.
- **CSS layer order `reset < components < unnyc < site` must be preserved.** The
  nav sits inside `.unnyc-page` to inherit its tokens, so `.unnyc-page a { color:
  inherit }` in `@layer unnyc` will paint nav links navy-on-navy if `site` stops
  being last.
- **An unterminated `"` in frontmatter is the failure mode to know.** YAML reads
  on into the following lines hunting for the closing quote. Sometimes that
  fails the build pointing several lines *below* the real mistake (this is what
  broke `cab57e1`); sometimes it parses cleanly and silently eats a key or
  renders a stray `"`. `lint:content` catches both — don't weaken the
  odd-quote-count check, it is the only one that sees the silent variant.
- **The per-page section subnav has rules about where it goes.**
  `UnnycSectionNav` renders a sticky jump menu directly under the header on
  **/start, /success and /resources only**. Not on short pages, and *not* on
  /crosswalk — that page's sections ARE the eight principles, so the bar could
  only list all eight, which restates the page instead of navigating it. The
  guard is `items.length < 3`, but the real rule is not to mount it.
  **Section scroll offsets have exactly one owner:** the bar measures itself into
  `--pr-subnav-h` and primer.css's existing `scroll-margin-top` rules add it,
  defaulting to `0px` where there is no bar. Do not add a competing rule in
  unnyc.css — one was tried, lost the source-order tie at equal specificity, and
  left every section 21px behind the bar.
- **`HeaderHeightVar` measures `.unnyc-nav`, not `.site-header`.** It looked for
  the latter until 2026-08-07 — a class only the MARKETING site has — so
  `--pr-header-h` was never set on any of the six pages that mount it and every
  hash jump used the 130px fallback against a ~68px header. If anchors start
  landing wrong, check this first.
- **Content images go through `next/image`, never a CSS `background-image`.**
  A background image gets no WebP conversion, no responsive srcset and no lazy
  loading. Three of them shipped that way once and cost 2.4MB; converting to
  `fill` + `object-fit` reproduces `cover`/`background-position` exactly. When
  you swap an image, **update the `width`/`height` props to the new file's real
  ratio** — they size the reserved box, and CSS `height: auto` hides a mismatch
  in the final render while still shifting layout on the way there.
- **`public/images/CREDITS.md` is a licence record, and attribution is a term,
  not a courtesy.** Every image under `public/images/` must have an entry, in the
  same commit that adds or replaces it. Check the licence BEFORE using anything
  from a publisher CDN: the `/resources` OSPO figure is reusable only because
  that specific article is hybrid open access under CC BY 4.0, confirmed from
  Crossref and OpenAlex — the journal is otherwise subscription. Where a licence
  requires credit, the credit must actually RENDER (the figcaption on
  /resources), not merely sit in CREDITS.md.
- **Icons are inline SVG, one set, themeable** — `src/components/unnyc/UnnycIcon.js`,
  paths verbatim from Lucide v1.30.0 (ISC), 24×24 canvas, 2px stroke. Content
  refers to them by name (`icon: shield-check` in `content/principles.md` and
  `content/crosswalk.md`), never by path. They replaced eight PNGs that were
  364 KB, four clashing art styles, and — the reason that actually mattered —
  **un-themeable**: a black raster is a colour literal, invisible to the brand
  variant, which is the exact failure the two-tier token system exists to stop.
  Colour now comes from `color:` on the CSS class. **Add new icons from Lucide
  on the same canvas**; mixing sets is the state this replaced.
- **Case-study images are self-hosted** in `public/case-images/` and served via
  `next/image`. They were hotlinked from each organisation's own server (~780 KB
  a visit, one 482 KB OG image, all able to change or 404 without warning).
- **Never write `*/` inside a CSS comment** (e.g. listing `--unnyc-*` families as
  `--unnyc-*/--un-*`). It closes the comment; Turbopack fails with a confusing
  `Unexpected token Delim('*')`.
- **Don't add a `title.template`** in `src/app/layout.js` — page titles already end
  in "— UNNYC" and a template double-suffixes them.
- **The contact form is the third Payload write path** (`/contact`, added
  2026-08-07). It posts to `contact-submissions` — a collection that already
  existed for sarapis.org, with exactly the `name`/`email`/`message` fields
  needed, so **no CMS change was required**. Two traps: its `website` field is a
  **honeypot** that makes Payload reject the submission, so `.unnyc-cmp-form__hp`
  must stay `display:none`; and the collection is **not brand-scoped** (no
  `sites` field), so UNNYC messages land in the same bucket as sarapis.org's —
  `ContactForm.js` appends a "Sent from unnyc.wegov.nyc" line to the message
  because that is the only thing distinguishing them.
- **`localhost` is NOT in Payload's CORS allowlist**, so *any* form on this site
  fails locally with a CORS error and the generic "Something went wrong" message.
  That is expected, not a bug — form submission can only be tested for real from
  the deployed origin.
- **One endorsement destination**, separated by `kind`. Individuals and formal
  organizations both land in Payload's `campaign-endorsements`. They used to be
  split, with orgs going to a Google Sheet via an Apps Script webhook — that is
  gone; do not reintroduce it.
- **The endorser wall needs published entries.** Payload read is `publishedOnly`
  and `published` defaults to false, so a submission is invisible until someone
  ticks it in the admin. If the wall looks broken, check that first — it read
  `authenticated` until CMS r42, which made every anonymous read 403 while the
  page silently fell back to an empty list.
- **No secrets are required.** `ENDORSEMENT_SHEET_WEBHOOK_URL` and the Google
  Sheet path were removed 2026-08-06 — formal organization endorsements post to
  Payload's `campaign-endorsements` with `kind: 'organization'`, the same
  collection and review step as an individual signature.
- **Leaflet is client-only.** The map loads via `dynamic(..., { ssr: false })` from
  `PrimerMovementNow.js`, which now receives `mapMarkers`/`mapLegend` as props from
  `content/start.md`. That relative dynamic import is invisible to `@/`-prefixed
  grep — don't delete `PrimerMapInner.js` as "unused".
- **Glossary definitions live once**, in `content/start.md` under `concepts.terms`.
  `src/lib/content.js` reads them so a `[term](gloss:slug)` link anywhere gets a
  hover definition. The old `GlossaryTerm` React component was deleted; re-adding a
  component-based tooltip means parsing HTML→React, not just re-importing data.
- `src/data/unnyc-primer.js` is **superseded** by `content/*.md` and **confirmed
  orphaned** — zero code imports as of 2026-08-04 (the only `@/data` import
  anywhere is `openSource`; the remaining "unnyc-primer" hits are JSDoc comments
  and docs prose). Kept as a migration reference; safe to delete.
- **The eight Principles ARE single-sourced** as of 2026-08-06 —
  `content/principles.md`, reshaped by `principlesFlat()` /
  `principlesDeclaration()` in `src/lib/content.js`. There were three
  hand-maintained copies and they had drifted (the letter said "Foster inclusion"
  and a bare "RISE"). Each principle now carries its surface variants explicitly:
  `title` (gerund, required by the group headings), `titleCanonical`, `desc`,
  `descShort` for the letter, optional `descCity` for the declaration. Variants
  on purpose, not drift. Change the markdown; nothing else holds a copy.
- **`src/data/` is GONE** (2026-08-06) — both files were fully orphaned once the
  letter stopped importing `openSource.principles`. 1,001 lines of
  authoritative-looking but unused data is what allowed the drift in the first
  place. Don't reintroduce a data module for content that belongs in `content/`.
- `src/lib/api.js` is intentionally larger than this site needs (inherited whole
  from the marketing site). `fetchAPI` *is* used by the endorser wall on
  `/campaign/sign` — don't prune it casually.

## Verifying content changes

The migration was verified by capturing the rendered text of all 10 routes from
production **before** converting, then diffing after. If you refactor content
plumbing again, do the same — it caught two real bugs (a whole section rendering
`null` because a component didn't get its new prop, and a paragraph split across
two text nodes). Note it will NOT catch things that only render on interaction:
the lost glossary tooltip was found by inspection, not by diff.

## Provenance

- Extracted from `wegovnyc/wegovnyc_front` (`/unnyc`) on 2026-08-04.
- Base was `oliviacroteau667/wegovnyc_front` @ `0e349a2` — the four-path
  restructure — merged with `wegovnyc/wegovnyc_front` `main`.
- **Fresh git history on purpose:** the parent repo has two unencrypted private SSH
  keys in its *public* history. Rebasing onto it would have replicated that
  exposure here. `.gitignore` blocks `*.pem`, `*.key`, `*.exp`, `ssh_key*`,
  `ssh.pub`. **If you ever sync files from the parent repo, do not bring those
  across.**
- Events/news were dropped in the restructure; this site has no CMS-driven page
  content as a result.

## Related

| | |
|---|---|
| `wegov.nyc/unnyc` | Now 308s to this site (`wegovnyc_front` @ `84a83de`). `/unnyc/guide` → `/resources`. |
| `old-unnyc.wegov.nyc` | The original Vite "UN meets NYC" hub. Live, untouched. |
| Vault workspace | `~/vault/workspaces/unnyc.md` (Hub reads this) |
