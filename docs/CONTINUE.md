# Continue here — UNNYC, after the 2026-09-11/14 sessions

Written from the repo, not from memory. Every number below has the command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

Supersedes the 2026-09-10 and 2026-09-10/11 handoffs.

---

## 1. State — verified 2026-09-14

```bash
cd /Users/devin/Antigravity/unnyc
git fetch origin && git log --oneline origin/main -1   # d8f4062
gh pr list --state open --json number
```

- **`origin/main` is at `d8f4062`** — "Merge PR #94".
- **All 13 routes 200.** Everything below was verified **live on production, in
  a browser** — see §2 for why `curl` cannot see the map at all.
- **Eight PRs merged across this stretch:** #86 and #87 (name New York City; the
  sign-form layout), #88 (Olivia's homepage readability), #89 (docs), #90
  (interactive map pins), #91 (the "Let's keep going" band), #94 (the maps keep
  a legend and nothing below it), #92 (this handoff).
- **#93 was CLOSED, not merged** — it added an OSPO text list under the map, and
  the owner then decided there should be no lists under the maps at all. Its two
  independent fixes (the shared `ospoOffices()` and the credit-line contrast)
  were carried into #94. ⚠ Don't mine it for the list; that part is rejected.

---

## 2. What shipped, and the thing that nearly hid it

⚠ **`UnnycWorldMap` is `dynamic(..., { ssr: false })`, so its chunk is not in
the initial HTML's script list.** Grepping the page's chunks for the popup
markup returns **0** — a FALSE NEGATIVE, not an absence. Only a browser sees it.
That is the third zero-result-nearly-became-a-fact of the session; see §5.

### Interactive map pins (#90)

Three of the four layers open a popup on click/Enter/Space, on `/` and
`/start`: policy markers (8), OSPO points (12), the 13 shaded catalogue
countries. **CTFG's 62 dots stay decorative** — owner's call, and the right one:
they are the densest layer, where overlapping hit areas would fight each other.

- **The data was already there and was being thrown away.** `ospoDots` was
  `.map(([x, y]) => ({ x, y }))`, discarding the city, the country and the
  offices themselves; country centroids were never computed. Both kept now.
- ⚠ **`role="img"` had to go.** It makes the whole subtree presentational, so a
  focusable child inside one is a focus stop with NO accessible name — which is
  exactly why an earlier version put all detail in text and recorded that the
  shapes could not carry it. Now `role="group"`, decorative children
  `aria-hidden`, pins are `role="button"` + `tabIndex` + `aria-expanded` with an
  `aria-label` that states what the popup says.
- ⚠ **Hit areas are transparent circles UNDER the visible dots.**
  `fill: transparent`, never `fill: none` — `none` is not hit-testable.
- **Two clipping bugs, found only by measuring:** the panel is
  `overflow: hidden`, so a card on a top-half pin rendered 123px above it and
  was cut off (pins above the midline now open downward), and a rim pin pushed
  half the card out sideways (centre clamped to 20–80%).
- The popup is HTML over the panel, not `<foreignObject>` — it needs links,
  wrapping text and normal focus, and JSX escapes third-party content for free
  where Leaflet's HTML strings needed a hand-written `esc()`.

### The maps keep a legend and nothing below it (#94, 2026-09-14)

**Owner's decision.** `/` and `/start` carry the four layers, the legend and the
credit line. Deleted: `__marker-list` (8 rows), the `__catalogues` `<details>`
(13 countries), `mapSource.cataloguesLabel`, ~160 lines of `world-map.css` and
the `home.css` overrides that existed only for them. **−362 / +157.**

⚠ **This area has now been rebuilt on a DECISION twice in five days** — the
lists were added 09-10 and removed 09-14. Don't reintroduce one as a
side-effect of fixing something else; ask.

- ⚠ **The pins no longer meet WCAG 2.5.8 and nothing covers them.** 19–21px at
  1440px, ~7px at 375px. The lists were 2.5.8's "equivalent control on the same
  page" exception, so it now applies to **no layer**. Accepted cost, written
  into `UnnycWorldMap.js` and `CLAUDE.md` so it reads as a decision.
  ⚠ **Do NOT inflate the hit circles** — 24px at phone scale makes neighbouring
  European pins overlap, trading a size failure for pins that activate each
  other. The options are a text equivalent (just removed) or a bigger/zoomable
  map. Both are owner calls.
- **What makes it survivable:** the pins are real controls — `role="button"`,
  in the tab order, with an `aria-label` stating what the popup says. Verified
  intact: all 8 marker one-liners, the per-country counts, the OSPO offices.
  **Those labels are load-bearing now.** ⚠ Popups gone AND no lists is the state
  that was a genuine defect on 09-10.
- **Two live production defects fixed on the way**, both found by looking rather
  than by a check: the **credit line at 1.84:1** on the homepage (§5), and
  **"Échirolles Échirolles"** in the OSPO popup, live since the pins shipped —
  `resources.md` names an office "… (DSCN), Échirolles" with `city: Échirolles`
  and the note appended it again. The new shared `ospoOffices()` drops a city
  note the name already carries; Saint-Mandé and every `(HQ)` are untouched,
  because those add what the name does not say.

### The "Let's keep going" band (#91)

`/start`, `/principles`, `/crosswalk` and `/success` each end with 5 buttons to
the other sections, never linking to themselves.

- **One list, not four**: `content/keep-going.md` holds every destination and
  the heading; the component drops the row matching the current page.
- **One stylesheet, four importers**: verified all four routes link the *same*
  hoisted chunk, and the rules appear in exactly **one** chunk.
- A **server** component rendered as a *sibling* after each storyscroller — it
  reads its own copy via `getContent` (server-only) and the storyscrollers are
  `'use client'`. That keeps each call site to one line.

---

## 3. Waiting on the human

⚠ **THIS LIST IS NEARLY EMPTY NOW — 2026-09-14.** Everything that was sitting
here was either actioned or answered in #94, #95 and #96. Read the decisions
before proposing any of them again.

**Settled — do not re-open as bugs or cleanups:**

1. ✅ **Storyscroller scroll behaviour has been SEEN BY A HUMAN** (Devin,
   2026-09-14: "it looks great"). This was the largest untested surface on the
   site for four sessions and no agent could ever close it —
   `document.visibilityState` is `"hidden"` in these tools, so
   IntersectionObserver never fires and every `[data-reveal]` sits at
   `opacity: 0`. Still true for any *new* scroll work: only a human can check it.
2. ✅ **Map pin target size (WCAG 2.5.8): LEFT AS AN ACCEPTED GAP**, owner's
   choice from three options. The pins are 19–21px desktop / ~7px phone and
   nothing covers them since the text lists went. ⚠ Do NOT "fix" it by inflating
   the hit circles — 24px at phone scale overlaps neighbouring European pins. The
   options if revisited: a text equivalent, or a larger/zoomable map.
3. ✅ **`/resources` uses the SHARED "keep going" band** (#96). There is no
   second implementation left.
4. ✅ **The third orphan is DELETED** (#96) — `UnnycEndorserDirectory.js`, 27
   `unnyc-endorsers__` rules, and the stale references.
5. ✅ **The map classes are RENAMED** to `unnyc-world-map__*` (#96). ⚠ Don't
   sweep the `unnyc-start-story__` prefix — it still belongs to that storyscroller.
6. ✅ **The declaration keeps its two-section structure**; ✅ the endorser lede is
   **"More than 150"** (⚠ unrendered — see below); ✅ **`old-unnyc.wegov.nyc` is
   KEPT.** All owner decisions, 2026-09-14.

**Genuinely still open:**

7. **The Databook Mapbox token** — Hub `7d5fdeef`. Different workspace,
   owner-only first step. Not this repo.
8. **Hub `168a959d`, the CTFG link question — premise void, follow-on blocked.**
   The map's CTFG dots stopped linking out on 2026-09-10, so nothing points at
   that directory. The ask to repoint them at `app.civictech.guide` cannot be
   done as specified: that app addresses profiles by an Airtable `recordId` in a
   *different id space* from the `airtable_id` CTFG's own API exposes (a real
   one renders "Record details can no longer be found"), there is no public
   slug→recordId lookup, and CTFG's `rel=canonical` still names
   `civictech.guide/projects/<slug>`. The only clean path is to ask CTFG for a
   stable public profile URL — one line in `scripts/fetch-ctfg-projects.mjs`.
9. **`endorsers.lede` in `content/principles.md` is dead copy.** Rendering it
   would ADD a sentence `/principles` does not currently show, and "More than
   150" reads off-by-one against a directory whose chips total exactly 150.
   A decision, not a bug.

---

## 4. Invariants

1. **`data-count` takes a RAW number; the element's CHILDREN take the formatted
   one.** `Number("2,789")` is `NaN`, and hydration overwrites a correct
   server-rendered figure with it.
2. **Never type a count or a teaser title into `content/home.md`** — every
   figure and teaser is derived in `page.js` from the file its target page
   renders.
3. **A content field carrying HTML is not interchangeable with one that
   doesn't.** `sign.md`'s `title` has a `<span>`; passed to a plain-text prop it
   showed readers the literal `<span>Endorse</span>` for a day.
4. **Scope any `@layer unnyc` rule styling `a`, `button`, `ul` or `ol` with
   `.unnyc-page`.** Six bugs so far.
5. **One owner per class, imported by every route that needs it** —
   `world-map.css` and `keep-going.css` both. Never copy rules into a page's own
   stylesheet to fix a gap.
6. **Extracting shared CSS merges assumptions about context, not just rules**,
   and ⚠ **it took THREE passes to finish here, which is the real lesson.**
   `world-map.css` carries `/start`'s light-page values onto the dark homepage.
   #88 fixed what was **visible** (the marker rows at 1.21:1, and the catalogue
   *summary*); the 13 catalogue rows behind that closed `<details>` stayed at
   **1.35:1** for four days; and the **credit line** — the CC BY attribution —
   sat at **1.84:1** until #94. **Enumerate every element the shared sheet
   colours and check each against the consumer's real background. Don't check
   what you happen to see.** Today `world-map.css` only styles the panel (dark
   on both routes) and the credit line (overridden in `home.css`); anything new
   below the panel needs an override the day it lands.
7. **On `/campaign/sign` below 899px the form stays above the letter.**
8. **Attribution is a licence term for GovOSS and CTFG.** Both CC BY 4.0
   *today*; a coincidence, not an invariant. Keep the strings per-source.
9. **Never sum the GovOSS country counts.**

---

## 5. Traps

**A closed disclosure hides its own defect.** The catalogue rows sat at 1.35:1
on the homepage for four days after #88 fixed everything around them, because
nobody opens a `<details>` on the page where it is broken — so "it looks fine"
survived every check that wasn't deliberate. The credit line lasted longer still:
four lines of small grey type look deliberate when they are unreadable.
**Contrast-check what a control REVEALS, not only what it shows.**

**A zero result is not evidence — three times in the 09-12 session:**

- Popup markup grepped from `/start`'s chunks → **0**, because the map chunk is
  `ssr: false` and lazily loaded. It is live.
- "We respectfully call on…" grepped on `/campaign/sign` → **0**, because it
  renders with `<strong>` inside it. It is there.
- A stylesheet-introspection helper returned `null` for a rule that was
  demonstrably applying.

**Tooling limits, all paid for:**

- ⚠ **MEASURE NOTHING UNTIL YOU SET AN EXPLICIT VIEWPORT.** `innerWidth` is `0`
  in a fresh tab and after the `desktop` preset, and numbers taken then are
  *plausibly* wrong, not obviously wrong — it reported `/campaign/sign` as a
  12,748px document that was really 3,297px.
- ⚠ **The hidden pane throttles timers, so `await` inside one `javascript_tool`
  call stalls and times out.** React state is async, so a click and its result
  must be **split across two tool calls** — click in one, read in the next.
- ⚠ **Nothing with `data-reveal` appears in a screenshot.** Inject
  `[data-reveal]{opacity:1 !important;transform:none !important}` — `!important`
  matters, an inline `style.opacity` loses to the rule already there. Debug
  only, never a source change.
- **Screenshots are blank at deep scroll offsets** (~990px+ on desktop).
- **A synthetic `KeyboardEvent` does not run default activation** — correct
  behaviour for untrusted events, not a page bug. Use `element.click()` and say
  plainly that the hardware keypress is unverified.
- **Don't string-compare computed pixel values.** `634.664` vs `634.656` is
  sub-pixel rounding; an equality check on it reported a false regression.
- ⚠ **`.claude/` is NOT inherited by a git worktree**, `launch.json` included, so
  `preview_start` silently serves the MAIN checkout instead of your worktree.

**Process:**

- ⚠ **A commit landed on local `main` instead of a branch this session.** Never
  pushed, so nothing deployed; it was moved onto a branch and `main` reset, with
  the patch proved byte-identical before and after. **Check
  `git rev-parse --abbrev-ref HEAD` before committing** — "push to main deploys"
  is what makes this the cheapest possible near-miss to keep cheap.

**Looks broken, is deliberate:**

- `"World map — coming soon"` still exists in `UnnycHomeStoryscroller.js` — the
  fallback branch if `worldMap` isn't passed.
- `ssr: false` on the map is now a **bytes** decision, not a technical one.
- The atlas snapshot is a static import, so a missing file fails the **build**.
- `unnyc.css`'s naive brace imbalance is pre-existing and benign: `@layer unnyc {`
  at line 39 is never closed, which is the intent, and parsers auto-close.
- `localhost` cannot submit any form — not in Payload's CORS allowlist.

---

## Coverage — what these sessions did NOT do

- **Never watched a storyscroller scroll** — four sessions now — and never
  exercised the map's reveal-gated states. Structural: see §3.1.
- **Never dispatched a trusted keypress** at a map pin. The handlers are plain
  code with nothing intercepting them, and click activation is confirmed.
- **Never photographed the desktop map, hero or sign layout** — screenshots come
  back blank at those scroll offsets (~990px+ on desktop; a 375px capture at
  2.6k worked). All verified by DOM measurement instead.
- **Did not review #88 line by line.** It was reviewed against this repo's known
  traps and its contrast claim was measured (1.21:1 → 14.81:1), not read line by
  line. ⚠ Its *residue* is what #94 then had to clean up — see §4.6.
- **Did not migrate `/resources`** to the shared band (§3.3), **did not delete
  the third orphan** (§3.4), **did not rename the map classes** (§3.5).
  ⚠ The rename is now cheaper than it was: `world-map.css` is 172 lines
  lighter, so there is far less carrying the misnamed prefix.
