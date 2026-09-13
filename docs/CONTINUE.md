# Continue here — UNNYC, after the 2026-09-11/12 session

Written from the repo, not from memory. Every number below has the command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

Supersedes the 2026-09-10 and 2026-09-10/11 handoffs.

---

## 1. State — verified 2026-09-12

```bash
cd /Users/devin/Antigravity/unnyc
git fetch origin && git log --oneline origin/main -1   # f773df7
gh pr list --state open --json number                  # 0
```

- **`origin/main` is at `f773df7`**, and the local checkout is on it, clean.
- **Zero open PRs. One branch — `main` — locally and on origin**; every merged
  branch pruned, including Olivia's.
- **All 13 routes 200.** Both of this session's features verified **live on
  production, in a browser** — see §2 for why `curl` cannot see one of them.
- **Six PRs merged across this stretch:** #86 and #87 (name New York City; the
  sign-form layout), #88 (Olivia's homepage readability), #89 (docs), #90
  (interactive map pins), #91 (the "Let's keep going" band).

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

1. ⚠ **STILL NOBODY HAS WATCHED THE STORYSCROLLERS SCROLL.** Unchanged across
   three sessions and now more load-bearing: seven scroll-driven pages plus a
   new interactive map. `document.visibilityState` is `"hidden"` in these tools,
   so IntersectionObserver never fires and every `[data-reveal]` element sits at
   `opacity: 0`. Needs a human with a real browser, not a better check.
2. ⚠ **The OSPO pins have no on-page text equivalent.** Pins measure 19–21px at
   1440px and ~7px at 375px, under WCAG 2.5.8's 24px. What carries markers and
   countries is 2.5.8's "equivalent control on the same page" exception —
   `__marker-list` and the `__catalogues` disclosure. **OSPOs have neither**: the
   credit line points at `/resources#ospos`, a different page, which does not
   satisfy it. The fix is an OSPO text list beside the other two, **not** bigger
   hit circles. Written into `UnnycWorldMap.js`.
3. **`/resources` was not migrated to the shared band.** It keeps its own older
   `foot:` block, its own wording ("Looking for something else?") and a shorter
   list without `/principles`. **Two implementations of one band**, labelled as
   such in `UnnycKeepGoing.js` and `keep-going.css`. Unifying is a one-line
   change plus a deletion, but it changes that page's wording and adds a link it
   does not have — a decision, not a tidy-up.
4. **The third orphan**: `UnnycEndorserDirectory.js` — **0 importers**, 27
   `unnyc-endorsers__` rules in `primer.css` and 1 in `principles.css`, all dead,
   because `UnnycPrinciplesStoryscroller` reimplemented the directory with its
   own markup. Labelled, not deleted. **Delete all three together or none.**
5. **Rename `unnyc-start-story__map*`.** The component draws on both routes; the
   prefix claims otherwise, and that misnomer is *why* the CSS looked like it
   belonged in `start.css` and shipped the homepage map unstyled. The cause is
   still in the code, only documented.
6. **The Databook Mapbox token** — Hub `7d5fdeef`, owner-only first step.
7. Three copy decisions on Hub `841ee0a9` (the declaration's
   two-sections-vs-the-UN's-three, "Hundreds" over a countable 150, retiring
   `old-unnyc.wegov.nyc`) and `168a959d` (CTFG de-indexed linking).

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
6. **Extracting shared CSS merges assumptions about context, not just rules.**
   `world-map.css` carried `/start`'s light-page styling onto the dark homepage
   and needed `home.css` overrides (#88).
7. **On `/campaign/sign` below 899px the form stays above the letter.**
8. **Attribution is a licence term for GovOSS and CTFG.** Both CC BY 4.0
   *today*; a coincidence, not an invariant. Keep the strings per-source.
9. **Never sum the GovOSS country counts.**

---

## 5. Traps

**A zero result is not evidence — three times this session:**

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

## Coverage — what this session did NOT do

- **Never watched a storyscroller scroll**, and never exercised the map's
  reveal-gated states, for the structural reason in §3.1.
- **Never dispatched a trusted keypress** at a map pin or the catalogue
  disclosure. The handlers are plain code with nothing intercepting them, and
  click activation is confirmed.
- **Never photographed the desktop map, hero or sign layout** — blank at those
  scroll offsets. All verified by DOM measurement instead.
- **Did not review #88 line by line.** It was reviewed against this repo's known
  traps and its contrast claim was measured (1.21:1 → 14.81:1), not read line by
  line.
- **Did not add the OSPO text list** (§3.2), **did not migrate `/resources`**
  (§3.3), **did not delete the third orphan** (§3.4), **did not rename the map
  classes** (§3.5).
