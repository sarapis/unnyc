# Continue here — UNNYC, after the 2026-09-10/11 session

Written from the repo, not from memory. Every number below has the command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

Supersedes the two earlier 2026-09-10 handoffs.

---

## 1. The trap that produced a live defect — FIXED, but read it anyway

**For about a day the homepage rendered readers the literal text
`<span>Endorse</span>`** in the open-letter headline. Fixed in #88, merged and
verified on production 2026-09-11:

```bash
curl -s https://un.opensource.nyc/ | grep -c "&lt;span&gt;"   # -> 0
```

`src/app/page.js:139` passes `sign.title` as the `headline` prop.
`content/sign.md`'s title carries HTML (`<span>` marks the underlined phrase,
the same convention `home.md` and `principles.md` use), and
`UnnycHomeStoryscroller` renders `headline` as **plain text** — so React
escapes the markup and the reader sees the tags.

It was NOT introduced by this session's work and was not noticed by it either,
across several passes over that page — which is the lesson: *a
content field that carries HTML is not interchangeable with one that doesn't,
and nothing in the type system or the build says so.* The general rule this
repo already had — `sections.*.html` goes in a `<div>`, `inlineMd()` goes in a
`<p>` — now has a third case: **a raw-HTML field passed to a text prop renders
its tags.**

---

## 2. State — verified 2026-09-11

```bash
cd /Users/devin/Antigravity/unnyc
git fetch origin && git log --oneline origin/main -1   # e6029fa
gh pr list --state open --json number,title,author
```

- **`origin/main` is at `e6029fa`** — "Merge PR #87".
- **PR #88 (Olivia's) is MERGED** — `bc3bc51`. Reviewed and browser-verified
  before merging. It fixed the `<span>` bug above plus four other homepage
  issues, and **three of its five files were ones this session created or
  changed** — see §3. The contrast numbers are worth keeping: against the
  homepage's `rgba(11,31,58,0.84)` section the marker text had been
  `--wg-brand` at **1.21:1** (effectively invisible) and `--wg-text-secondary`
  at 3.00:1 (below AA); it is now 14.81:1 and 16.52:1.
  ⚠ One non-blocking note, recorded in the merge commit: `letterAskList` in
  `page.js` strips the ask block's lead paragraph with an anchored regex over
  rendered HTML. Commented and fails safe, but it couples `page.js` to the
  shape of `sign.md`'s Take Action block — if that block ever starts with
  something other than a `<p>`, the strip silently no-ops and the sentence
  returns as a duplicate.
- **Six PRs merged across the two sessions**: #82 (Olivia's `/resources`
  scrollbar), #84 (the atlas snapshot, catalogue counts, Leaflet deletion),
  #85/#86 (name New York City), #87 (the sign-form layout fix). #83 and earlier
  belong to the previous handoff.
- **Branches are clean**: `origin` has `main` plus the two merged branches from
  #86/#87 that were never deleted, and Olivia's `fix/map-legend-contrast`.
  55 merged remote branches and 46 local ones were pruned on 09-10 — verified
  first that every one was an ancestor of `origin/main` and that no local branch
  held a commit absent from `origin`. The record with tip SHAs is at
  `.git/deleted-remote-branches-2026-09-10.txt` (never committed). Recovery
  doesn't need it: every commit is reachable from `main`, and each merged PR
  page still has its "Restore branch" button.
- **Production is healthy apart from §1.** All 13 routes 200.

---

## 3. What this session shipped, and what it cost

Four items plus two bugs. All verified in a browser, because `UnnycWorldMap` is
`dynamic(..., { ssr: false })` and **none of the map is in the prerendered
HTML** — `curl` structurally cannot see it.

1. **The world atlas is a repo snapshot** (`content/world-atlas.json` +
   `scripts/fetch-world-atlas.mjs`), not a runtime jsdelivr fetch. It was the
   last third-party runtime dependency on `/` and `/start`. Verified on
   production: 62 requests on a page load, **all same-origin**.
2. **The GovOSS per-country counts are reachable** — a native `<details>` under
   the map, 13 countries with counts and catalogue links. Not only an a11y fix:
   replacing Leaflet had dropped the popups, and with them those counts and
   links, for *every* reader.
3. **Leaflet deleted** — 483 lines, the dependency, 163 lines of dead CSS.
4. **Three `#ffffff` literals** → `var(--wg-surface)`; `wg-lint-tokens` clean.
5. **The homepage map was unstyled on every fresh load of `/`** — found while
   doing (1). Fixed by extracting the rules into `src/app/world-map.css`,
   imported by both routes.
6. **The `/campaign/sign` form was 80% down the page on phones** — reported by
   the owner, fixed with `order: -1` at the existing breakpoint.

### ⚠ Item 5 created the problem Olivia's #88 is now fixing

Moving the map's rules into a stylesheet **shared by `/start` and `/`** was the
right call for the bug it fixed — but those rules were written for `/start`'s
**light** `--wg-surface-warm` page, and the homepage section behind them is
**dark**. So `--wg-brand` navy text and a `--wg-warm-gray` border, correct on
one page, became low-contrast text and a stray light bar on the other.

**The general lesson, worth more than the incident:** *extracting shared CSS
de-duplicates the rules and silently merges their assumptions about context.*
One owner for a class is still right; just check what each consumer's background
is before assuming the values travel. #88 adds `home.css`-scoped overrides and
leaves `/start` untouched, which is the correct shape.

---

## 4. Invariants — break these and something already fixed re-breaks

1. **`data-count` takes a RAW number; the element's CHILDREN take the formatted
   one.** `Number("2,789")` is `NaN`, and hydration overwrites a correct
   server-rendered figure with it.
2. **Never type a count or a teaser title into `content/home.md`.** Every
   homepage figure and teaser is derived in `page.js` from the file its target
   page renders.
3. **The map's markers/legend/credit are READ from `content/start.md`** by both
   `/` and `/start`.
4. **Scope any `@layer unnyc` rule that styles `a`, `button`, `ul` or `ol` with
   `.unnyc-page`.** Six bugs so far.
5. **`src/app/world-map.css` has ONE owner and two importers.** Never fix a gap
   by copying its rules into `home.css` — two stylesheets owning one class is
   how the principles rail broke. Override deliberately and page-scoped instead,
   the way #88 does.
6. **Attribution is a licence term for GovOSS and CTFG.** Both CC BY 4.0
   *today*; that is a coincidence, not an invariant. Keep the strings per-source.
7. **On `/campaign/sign` below 899px the form must stay above the letter.**
   The rule and its trade-off are documented in `sign.css`; don't delete it to
   "fix" the tab order.

---

## 5. Waiting on the human

1. ⚠ **NOBODY HAS STILL WATCHED THE STORYSCROLLERS SCROLL.** Seven scroll-driven
   pages, verified only by build, rendered text and invariants. Confirmed again
   why an agent cannot: `document.visibilityState` is `"hidden"` in these tools,
   so IntersectionObserver never fires and **all 74 `[data-reveal]` elements sit
   at `opacity: 0`**. Still the largest untested surface on the site.
2. **The third orphan**: `UnnycEndorserDirectory.js`, its 25 `unnyc-endorsers__`
   rules in `primer.css` and one in `principles.css`. Nothing imports it —
   `UnnycPrinciplesStoryscroller` reimplemented the directory with its own
   markup (verified against production). Labelled dead in the code, not deleted.
   **Delete all three together or none.**
3. **Rename `unnyc-start-story__map*`.** The component draws on both routes; the
   prefix claims otherwise, and that misnomer is *why* the CSS looked like it
   belonged in `start.css`. The cause of item 5 above is still in the code.
4. **The Databook Mapbox token** — Hub `7d5fdeef`, owner-only first step.
5. Three copy decisions on Hub `841ee0a9` (the declaration's
   two-sections-vs-the-UN's-three, "Hundreds" over a countable 150, retiring
   `old-unnyc.wegov.nyc`) and `168a959d` (CTFG de-indexed linking).

---

## 6. Traps

**Looks fine, isn't:**

- **A page checked by nav-click is not a page checked.** Page CSS is per-route;
  Next keeps the previous route's sheet in the DOM after a client-side
  navigation. This is how the homepage map shipped unstyled and looked correct
  to everyone who arrived from `/start`.
- **A green `curl` proves nothing about client behaviour.** `ssr: false` means
  the map isn't in the HTML at all.
- **A selector returning 0 is not evidence of absence.** Cost a false a11y claim
  in CLAUDE.md, and cost time again this session when a stylesheet-introspection
  helper returned `null` for a rule that was demonstrably applying.
- **A raw-HTML content field passed to a text prop renders its tags.** §1.
- **Extracting shared CSS merges assumptions, not just rules.** §3.

**Tooling limits — check these before believing a measurement:**

- ⚠ **`innerWidth` reports `0` until you set an explicit viewport, and every
  layout number measured in that state is garbage.** It bit this session twice:
  `/campaign/sign` reported a 12,748px document that was really 3,297px, and
  every element reported as wrapped. **Call `resize_window` with explicit
  `width`/`height` — never the `desktop` preset — before measuring anything.**
- **Screenshots come back blank at deep scroll offsets** (~990px was already too
  far on a 1440x900 desktop viewport; a 375px mobile capture at 930px worked).
- ⚠ **Nothing with `data-reveal` is visible in a screenshot**, because
  IntersectionObserver never fires. To photograph a section, inject
  `[data-reveal]{opacity:1 !important;transform:none !important}` — an
  `!important` rule, because an inline `style.opacity` loses to the existing
  one. Debug-only; never a source change.
- **A synthetic `KeyboardEvent` does not run default activation** — correct
  browser behaviour for untrusted events, not a page bug. A trusted Enter/Space
  cannot be dispatched from here. Use `element.click()` to prove a control's
  activation path, and say plainly that the hardware keypress is unverified.
- **Don't string-compare computed pixel values.** `634.664px` vs `634.656px` is
  sub-pixel rounding, not a regression; an equality check reported a false
  "desktop changed".
- ⚠ **`.claude/` is NOT inherited by a git worktree**, `launch.json` included, so
  `preview_start` silently starts a dev server on the MAIN checkout and verifies
  code that is not yours. Add a second entry to the main `.claude/launch.json`
  with `runtimeExecutable: "sh"` and `runtimeArgs: ["-c", "cd <worktree> && npm
  run dev -- --port 3101"]`, and put it back when you finish.
- **`cp -Rc <main>/node_modules <worktree>/`** clones ~290 MB in seconds on APFS.

**Looks broken, is deliberate:**

- **`"World map — coming soon"` still exists in `UnnycHomeStoryscroller.js`** —
  the fallback branch if `worldMap` isn't passed.
- **`ssr: false` on the map is now a BYTES decision**, not a technical necessity.
- **The atlas snapshot is imported, not loaded fail-soft** — a missing snapshot
  fails the BUILD, which is the louder and cheaper failure.
- **`unnyc.css` shows a naive brace imbalance (currently 208/207).**
  Pre-existing and benign: `@layer unnyc {` at line 39 is never closed, so
  everything to EOF is inside it — which is the intent, and parsers auto-close.
- **`localhost` can't submit any form.** Not in Payload's CORS allowlist.

---

## Coverage — what this session did NOT do

- **Reviewed and merged PR #88**, including measuring the contrast ratios and
  confirming `/start` was untouched — but did NOT review the scroll/reveal
  behaviour it interacts with, for the structural reason below.
- **Never watched a storyscroller scroll**, for the structural reason in §5.2.
- **Never dispatched a trusted keypress** at the new catalogue disclosure. Its
  native `<summary>` behaviour is intact and nothing overrides it (checked: no
  global keydown `preventDefault`), and `element.click()` toggles correctly.
- **Never opened a Vercel preview** — SSO-gated for an agent.
- **Did not delete the third orphan**, did not rename the misnamed map classes.
- **Did not photograph the desktop hero or the desktop sign layout** — blank at
  those scroll offsets. Both were verified by DOM measurement instead.
