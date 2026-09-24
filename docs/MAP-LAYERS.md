# The map and its four data layers

> Moved out of `CLAUDE.md` on 2026-09-24. That file is auto-loaded into EVERY
> session in this workspace, and 309 lines about one component is the most
> expensive kind of content to keep there. Nothing was cut — this is the same
> text, one file away.
>
> ⚠ Read this BEFORE touching `UnnycWorldMap`, `world-map.css`, any of the four
> snapshots in `content/` (`ctfg-gov-open-source.json`, `govoss-catalogues.json`,
> `govoss-countries.geo.json`, `world-atlas.json`), their fetch scripts, or the
> credit line under the map. It carries the licence terms, the stacking-order
> argument, the ISO_A2 `-99` trap and the never-sum-the-counts rule.

## The CTFG map layer (MERGED and live as of `7faaf97`, 2026-08-07)

`/start#going-open-source` has a second, deliberately quieter map layer: **62 government-built
open source programs across 24 countries**, sourced from the Civic Tech Field Guide, each dot linking
to its CTFG profile. ⚠ This section said "Toggleable, default on" long after the toggles were
removed (owner decision 2026-08-17 — see "The four map layers"). **There are no toggles;
every layer is simply on.**

> ⚠ This section previously said "built but held — local-only on that branch." That stopped being
> true when the branch was merged and deployed. If the open question about linking into the CTFG
> directory while it is de-indexed pre-launch still matters, it is **live now** and needs deciding,
> not deferring.

- **It is a SUPPORTING layer, not a replacement.** The section's argument is the curated policy
  markers (who endorsed; that NYC hasn't). Replacing them with project data undercuts it — NYC lights
  up with dots. So CTFG dots are drawn small and *beneath* the policy markers. (They were 9px teal
  and switchable off; in the SVG renderer they are `r=3` in `--wg-accent-strong`, and nothing is
  switchable.)
- **`content/ctfg-gov-open-source.json` is a curated SNAPSHOT, not a live fetch** — refresh with
  `node scripts/fetch-ctfg-projects.mjs` and read the diff. Reasons: the map can't go half-empty if
  the CTFG API is slow, and CTFG's `orgType` tagging has noise (6 entries are excluded there with
  reasons — nonprofits, an advocacy coalition, a private LLC, a dead Wayback URL).
- `getCtfgProjects()` in `src/lib/content.js` is **fail-soft on purpose**, unlike `getContent()`: a
  missing snapshot costs the dots, never the page.
- **CTFG data no longer reaches any markup, so there is nothing to escape** (changed
  2026-09-10). This said "CTFG popup fields are escaped (`esc()` in `PrimerMapInner.js`)";
  that file is deleted and its `esc()` with it. `UnnycWorldMap` draws CTFG as plain dots
  with no popups and no `dangerouslySetInnerHTML` anywhere, so React escapes everything by
  default. ⚠ The underlying rule still stands and will bite whoever adds a CTFG popup or
  tooltip back: **this is third-party data, unlike the hand-authored markers beside it** —
  hand-built HTML strings need escaping, JSX does not. (The surviving `esc()` in
  `src/lib/api.js` is unrelated.)
- **Attribution is a licence term**, not a courtesy: CTFG content is **CC BY 4.0**, so the credit +
  `civictech.guide` link render under the map, counts read from the snapshot so they can't drift.
  Wording lives in `content/start.md` (`mapSource`) per the copy-in-markdown rule.
  ⚠ **It was CC BY-NC-SA until CTFG relicensed between 2026-07-03 and 2026-07-25**, and this repo
  went on claiming NC-SA — on the live page — until 2026-08-21, because the value was a HARDCODED
  LITERAL in the fetch script. `detectLicence()` now reads it off `civictech.guide` (the
  `rel="license"` anchor, cross-checked on two pages) and **throws** on anything unexpected, so a
  refresh can no longer re-stamp a stale claim. The snapshot records `licenceUrl` and
  `licenceCheckedFrom` beside it. **A licence is the licensor's fact, not ours — read it, don't
  recall it.**

## ⚠ THE MAP RENDERER CHANGED 2026-09-10 — read this before the three sections below

**`/start` AND `/` both draw `UnnycWorldMap`**: a static d3-geo + topojson SVG, no tile
server at all. The homepage shipped a literal `<p>World map — coming soon</p>` placeholder
for a day; it now renders the same component, reading `mapMarkers`/`mapLegend`/`mapSource`
from `content/start.md` rather than copying them, so the two maps cannot drift apart. The
placeholder survives only as the fallback branch if `worldMap` is not passed.

Everything in the three sections that follow about WHICH
data layers exist, WHY they stack in that order, what the licences require and why the
per-country counts must never be summed **is still true** — the new map carries the same
four sources. What is no longer true is anything about Leaflet, tiles, popups, toggles or
keyboard-navigable GeoJSON paths.

**Why it changed, and the lesson worth keeping: CARTO put their free basemap behind an API
key, and the failure was SILENT.** Their `light_all` tiles still returned HTTP 200 with a
valid PNG — no error, no console warning, no failed request — but every tile arrived with
"API KEY REQUIRED / carto.com/basemaps/apikey" stamped diagonally across it. It was
defacing production for an unknown period and only a human looking at the page caught it.
Verified by fetching a tile directly and viewing it. **A third-party freebie can degrade
without failing; monitoring for errors would never have seen this.**

Two consequences of the swap, both real:

- **⚠ THERE ARE NO TEXT LISTS UNDER THE MAP — owner's decision, 2026-09-14.** The map
  carries its four layers, a legend and the credit line, and nothing else. Deleted that
  day: `.unnyc-start-story__marker-list` (8 rows), the `.unnyc-start-story__catalogues`
  `<details>` (13 countries), `mapSource.cataloguesLabel`, and their rules in
  `world-map.css` + `home.css`. This area has now been rebuilt on a DECISION twice in
  five days — don't reintroduce a list to fix something else without asking.
  ⚠ Two earlier versions of this bullet claimed the marker list was missing, then that it
  existed; the first was wrong because a browser query for `li` children matched `div`s.
  **A selector that returns 0 is not evidence that a thing is missing** — check the
  component source. That lesson is why this bullet keeps being edited, and it still holds.
- **⚠ THE PINS ARE NOW THE ONLY PATH TO THE MAP'S DETAIL, and they DO NOT meet WCAG
  2.5.8.** Hit circles are `r=11`/`r=12` in SVG user units but the SVG scales to its
  container: measured **19-21px at 1440px and ~7px on a 375px phone**. Until 2026-09-14
  the text lists were 2.5.8's *"equivalent control on the same page"* exception; with them
  gone the exception applies to **no layer**, not just OSPOs. This is an accepted cost,
  recorded in `UnnycWorldMap.js`, not an oversight.
  ⚠ **DECIDED 2026-09-14: LEFT AS AN ACCEPTED GAP.** The owner was offered the three
  options and chose to leave it. This is settled, not open — don't reopen it as a bug.
  ⚠ **Do NOT "fix" it by inflating the hit circles** — 24px at phone scale makes
  neighbouring European pins overlap, trading a size failure for pins that activate each
  other. The options that were live were a text equivalent (removed the same week) or a
  larger/zoomable map; both remain available if this is ever revisited.
  ⚠ The credit line's `/resources#ospos` link has never satisfied 2.5.8 and still doesn't:
  it is attribution, and it points at a **different page**.
  What makes this survivable is that the pins are real controls — `role="button"`, in the
  tab order, with an `aria-label` that states what the popup says (all 8 marker
  one-liners, the per-country counts, the OSPO offices). **Those labels are load-bearing
  now.** The geography itself still carries nothing: you cannot tab a country's shape.
  ⚠ If the popups are ever removed, the lists are not optional — popups gone AND no lists
  is the state that was a real defect on 2026-09-10.
- **The world geometry is a SNAPSHOT IN THE REPO as of 2026-09-10** —
  `content/world-atlas.json`, refreshed by `node scripts/fetch-world-atlas.mjs`, imported
  directly by `UnnycWorldMap`. ⚠ It used to be fetched from
  `cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json` at runtime on **both** `/`
  and `/start`, which contradicted this repo's own snapshot doctrine and carried exactly
  the CARTO risk described above. Verified in a browser: 40 requests on a page load, all
  same-origin, none to jsdelivr.
  - A **static import**, not a fail-soft server read like `getCtfgProjects()`: it is a
    bundler import in a client component, so a missing snapshot fails the BUILD rather
    than a reader's page. Louder and cheaper.
  - The fetch script **throws** rather than writing something plausible, and the check
    that matters is the **name join**: the fill matches Natural Earth's
    `properties.name` against GovOSS's 13 catalogue countries, so an upstream rename
    would silently unshade a country. Same shape as the `ISO_A2 = -99` trap the GovOSS
    script guards. It also checks the country count is in band, that every geometry has a
    name, and that Antarctica is still called Antarctica (the render filters it BY NAME).
  - ⚠ `ssr: false` stays on both call sites, but the REASON CHANGED: there is no async
    work left, so it is purely about bytes. 176 country paths belong in a content-hashed
    JS chunk the CDN caches immutably, not inlined into every HTML response. Both
    comments say so.
  - The snapshot is ~104 KB and **not reviewable in a diff**, so `countryCount` and
    `sha256` are lifted into named fields at the top of the file — same reasoning as
    GovOSS writing its counts to a separate file.

- **⚠ `src/app/world-map.css` OWNS THE MAP'S LOOK, AND BOTH `/` AND `/start` IMPORT IT.**
  A trap worth knowing, because it shipped: those rules lived in `start.css`, the homepage
  started drawing the same component on 2026-09-10, and page CSS in the App Router is
  scoped to its own route segment — so a **fresh load of `/` linked no stylesheet defining
  `.unnyc-world-map__panel`** (then named `.unnyc-start-story__map-panel`) and the map
  rendered with no panel gradient, no radius, no padding, and the marker list as a plain
  block instead of a two-column grid. Confirmed
  in a browser against production: `getComputedStyle(panel).backgroundImage` was `none`.
  **It looked fine every time anyone checked by clicking through from `/start`**, because
  Next keeps that route's sheet in the DOM after a client-side navigation. This is the same
  cross-route stylesheet trap as `.unnyc-principles__rail` (below) **with the cases
  reversed** — there a fresh load was always fine and only nav-click broke.
  ⚠ Never fix a future gap here by copying rules into `home.css`: two stylesheets owning
  one class at equal specificity is a latent bug even when the rules are identical, which
  is how the rail broke. One owner, imported twice — Next hoists it into one shared chunk
  (verified: both routes link the same file).
  ⚠ **THE CLASSES ARE `unnyc-world-map__*` AS OF 2026-09-14** — renamed from
  `unnyc-start-story__map-*`, which was a misnomer: the component emits them on BOTH
  routes, not from the /start storyscroller, and that misnomer is exactly *why* the rules
  looked like they belonged in `start.css`. The name now matches the component and the
  file. 55 occurrences across `UnnycWorldMap.js`, `world-map.css` and `home.css`.
  ⚠ It was safe only because all 15 of those classes are emitted by `UnnycWorldMap`
  **alone** — checked against `UnnycStartStoryscroller` first, zero overlap.
  `unnyc-start-story__*` still exists and still belongs to that storyscroller; **don't
  sweep the prefix.**

## The four map layers (rescoped 2026-08-17 — data still current, renderer replaced)

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
these.** Both are **CC BY 4.0** as of 2026-08-21: GovOSS ("Catalogue data CC BY 4.0;
code MIT", its own footer) and the Civic Tech Field Guide, which relicensed off
CC BY-NC-SA in July 2026. They agreeing today is a coincidence, not an invariant —
keep the strings per-source, never collapse them into one. Source name, link and
licence stay for both. Everything after
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

⚠ **THE LIST IS NOT OURS.** All 18 entries come from the **FLOSS-PSO Network**
(`floss-pso.network`, OSPO Alliance), which aggregates each body's own YAML; the
list is **CC0 1.0** and the licence is read from their footer and recorded in
`ospoDirectory` (`source`, `sourceUrl`, `licence`, `licenceUrl`,
`licenceCheckedFrom`, `licenceCheckedOn`), never written into JSX. The map credit,
`/resources`' source line and `/data/public-sector-ospos.json` all read those
fields. What is ours is the geocoding. ⚠ Their entry for Échirolles is named
"Direction de la stratégie et de la culture numériques (DSCN)"; ours appends
", Échirolles" — a local edit, and the one that produced the "Échirolles
Échirolles" popup bug. Check upstream before "fixing" a name here.

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
list, from **GovOSS** (`govoss.cat` — it moved off `govoss-catalog.vercel.app`,
which still 301s there, on 2026-09-24). **14 countries, 19 catalogues, 2,893
country-attributed projects** as of the 2026-09-24 refresh. Click or tab a country
for its count and a link to each catalogue.

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
- **Each layer's licence is its own fact.** GovOSS is **CC BY 4.0** (its footer:
  "Catalogue data CC BY 4.0; code MIT"); CTFG is **CC BY 4.0** too since it relicensed
  off CC BY-NC-SA in July 2026. Same string today, still two independent facts — the
  credit line keeps them separate and per-source. Boundaries are Natural Earth, public
  domain.
- ⚠ **Never render the sum of the country counts.** It matches neither total, in
  both directions at once: 256 entries sit under `GLOBAL`/`EU` and get no polygon,
  while an entry listed by catalogues in two countries counts under each. 2,893
  summed against GovOSS's actual 3,054. Use `countryAttributedEntries` (what the
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
- **The fill's counts are keyboard-reachable, but not the geography.** ⚠ This bullet
  used to describe Leaflet's tabindex/aria wiring on GeoJSON paths; that code was
  DELETED 2026-09-10 with the Leaflet map. The counts now live in a `<details>` list
  under the map (see the renderer section); the shapes themselves take no focus and
  reveal nothing on hover. The transferable lesson from the old implementation is
  worth keeping: **counting `[tabindex]` in the rendered page is what caught** the
  wiring silently no-opping with a green build.
- **Stacking order is now a non-issue.** ⚠ Previously: Leaflet's panes (overlayPane 400
  vs markerPane 600) kept the fill under the markers. The static SVG has no panes — the
  layers stack in **document order**, so the fill is painted first simply because it is
  written first in `UnnycWorldMap`. Reorder the JSX and you reorder the map.

### Coverage audit vs CTFG (2026-08-07)
Every project/org/resource/OSPO on this site was cross-checked against the full CTFG directory:
**61 entities — 20 have CTFG profiles, 41 don't** (30 civic/gov-tech, 11 general FOSS). Largest gap:
**17 of 18 OSPOs** in `/resources` are absent from CTFG — so that directory is the better source
for public-sector OSPOs. ⚠ Credit for that belongs to the **FLOSS-PSO Network**, not to this
site: the list is theirs (CC0), as of a 2026-09-14 correction. This sentence read "this site's
OSPO directory" and was wrong about whose it was. Also: `/success` says "Sovereign Tech **Fund**"; it renamed to **Agency** in 2025.
⚠️ Method note if you redo it: match on homepage domain, but **exclude shared hosts**
(`un.org`, `nyc.gov`, `github.com`, `ec.europa.eu`) — a domain hit there proves nothing and produced
several false positives on the first pass.
