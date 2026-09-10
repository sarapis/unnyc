# Continue here — UNNYC, after the second 2026-09-10 session

Written from the repo, not from memory. Every number below has the command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

Supersedes the earlier 2026-09-10 handoff. That one's §1 lesson is still the
most useful paragraph in this repo; it is restated below because this session
found a fourth instance of it.

---

## 1. The one idea, again, with a new instance

**A thing can look correct every single time you check it, because of *how* you
check it.**

The homepage world map shipped this morning and has been rendering **unstyled
on every fresh load of `/`** ever since. Not subtly — no panel gradient, no
border radius, no padding, no shadow, and the marker list as a plain block
instead of a two-column grid.

Nobody caught it, and the reason is the interesting part: everyone who looked at
it arrived from `/start`. Next keeps a route's stylesheet in the DOM after a
client-side navigation, so the map's rules were still loaded and the page looked
right. Only a cold load of `/` reveals it.

```js
// production, fresh load of "/", before the fix
getComputedStyle(document.querySelector('.unnyc-start-story__map-panel')).backgroundImage
// -> "none"
```

This is the **same cross-route stylesheet trap** CLAUDE.md already documented for
`.unnyc-principles__rail` — **with the two cases exactly reversed.** There, a
fresh load was always fine and only nav-click broke. Here, nav-click is fine and
only a fresh load breaks. Knowing the first case did not prevent the second.

The three earlier instances from this morning still stand: the `NaN` that only
hydration could produce, CARTO's watermarked tiles returning HTTP 200, and two
defects born from merging seven individually-green PRs. Add a fourth pattern to
the list: **verify the cold path, not the path you happen to be on.**

---

## 2. State — verified 2026-09-10, second session

```bash
cd /Users/devin/Antigravity/unnyc
git fetch origin && git log --oneline origin/main -1
gh pr list --state open --json number,title
```

- **`origin/main` is at `9eb00ca`** — "Merge PR #82: dark scrollbar track on
  /resources instead of transparent".
- **PR #82 is MERGED.** Olivia's `/resources` scrollbar fix. Reviewed against the
  five other storyscroller stylesheets (the pattern matches all of them,
  including `principles.css`'s own note on why `--wg-brand-deep` is the
  variant-safe token), then **main was merged in locally and built before
  merging** — its green checks had run against a base three commits old.
- ⚠ **PR #84 is OPEN and is this session's work.** Seven commits, +710/−877,
  20 files. All three checks pass, `MERGEABLE` / `CLEAN`.
  **Not merged: merging deploys to production and that was not authorised.**
  If you are reading this file on `main`, it merged — check
  `gh pr view 84 --json state`.
- ⚠ **The main checkout is one commit behind `origin/main`** (at `da137e9`). It
  was left alone deliberately — another session may be live in it, and this
  session worked in a throwaway worktree instead. `git pull` it when you know
  you are alone.
- **Production is healthy.** All 13 routes 200. `curl … / | grep -c NaN` → 0,
  `curl … /start | grep -c cartocdn` → 0.

### What PR #84 contains

1. **The world atlas is a repo snapshot, not a runtime CDN fetch.**
   `content/world-atlas.json` (104 KB, 177 countries) +
   `scripts/fetch-world-atlas.mjs`, imported directly by `UnnycWorldMap`. This
   was the last third-party runtime dependency on `/` and `/start`.
   Browser-verified: **40 requests on a page load, all same-origin, none to
   jsdelivr.**
2. **The homepage-unstyled-map fix** (§1). Rules moved to
   `src/app/world-map.css`, imported by both routes, hoisted by Next into one
   shared chunk. Verified both routes link the same file.
3. **The GovOSS per-country counts are reachable** — a native `<details>` under
   the map: 13 countries, entry counts, a link to each government's own
   catalogue.
4. **Three `#ffffff` literals** in `home.css` → `var(--wg-surface)`.
   `wg-lint-tokens` is now clean across 14 stylesheets.
5. **Leaflet deleted** — see §3.
6. A one-character a11y fix, found only by reading `innerText` in a browser.
7. **CLAUDE.md reconciled** — eight falsified claims corrected, two new entries.

---

## 3. Decisions you made this session, and what they cost

- **Delete the Leaflet map: DONE.** `PrimerMapInner.js` (361 lines),
  `PrimerMovementNow.js` (122), `leaflet@^1.9.4`, 163 lines of dead CSS in
  `unnyc.css`, `.unnyc-pr-map__source` in `primer.css`. Orphanhood was
  re-verified rather than taken from the handoff.
  ⚠ **What is genuinely lost:** pan/zoom, and per-country keyboard focus on the
  geography. The counts came back as text (§2.3); the *shapes* did not, and
  cannot without a different renderer. CLAUDE.md now says there is nothing to
  restore and the history is in git — **that bullet had been wrong in both
  directions**, so it should not be reopened a third time.
- **Merge #82: DONE**, live.

---

## 4. Waiting on the human — not mine to decide

1. **Merge PR #84**, or don't. It is the only thing standing between the repo and
   a clean board, and it carries a live production fix.
2. **⚠ NOBODY HAS STILL WATCHED THE STORYSCROLLERS SCROLL.** Unchanged, and
   confirmed again from the other direction this session: in these tools
   `document.visibilityState` is `"hidden"`, so IntersectionObserver never fires
   and **all 74 `[data-reveal]` elements sit at `opacity: 0`**. Seven
   scroll-driven pages are in production verified only by build, rendered text
   and invariants. Still the largest untested surface on the site. Needs a human
   with a real browser — not a better check.
3. **A THIRD ORPHAN: `UnnycEndorserDirectory.js`.** Found while tracing
   Leaflet's consumers. Nothing imports it —
   `UnnycPrinciplesStoryscroller` reimplemented the directory with its own
   `unnyc-pr-story__endorsers*` markup (verified against production: that is what
   `/principles` serves). So the component, **25 `unnyc-endorsers__` rules in
   `primer.css`** and one in `principles.css` are all dead. Deliberately **not**
   deleted — same class of decision as Leaflet. The primer.css block is now
   *labelled* dead rather than left looking alive. Delete all three together or
   none.
4. **The Databook Mapbox token** — Hub `7d5fdeef`, unchanged. First step is
   owner-only: can you sign into the `soundpress` Mapbox account?
5. Three older content decisions on Hub `841ee0a9`: the declaration's
   two-sections-vs-the-UN's-three (matters before it goes to OTI), "Hundreds"
   over a countable 150, retiring `old-unnyc.wegov.nyc`. Plus `168a959d`, the
   CTFG de-indexed-linking question.

---

## 5. Candidates, ranked

0. **Merge #84** (§4.1). *Why now:* it fixes a visible production defect and
   nothing else can land cleanly on top of a seven-commit open PR.
1. **Rename `unnyc-start-story__map*` → something route-neutral.** The component
   draws on `/` and `/start`; the prefix claims otherwise, and the misnomer is
   what made the CSS look like it belonged in `start.css` in the first place.
   Touch the component and `world-map.css` together. *Why now:* the cause of §1
   is still in the code, only documented.
2. **Decide the third orphan** (§4.3) and delete all three pieces or none.
3. **Give the SVG geography keyboard access**, if it is wanted back. The counts
   are text now; the shapes are not focusable. This is the one capability the
   Leaflet deletion actually cost.
4. **Prune ~20 stale local branches** from the storyscroller stretch. All merged,
   none load-bearing.

---

## 6. Traps — looks broken but isn't, and looks fine but isn't

**Looks fine, isn't:**

- **A page checked by nav-click is not a page checked.** §1. Page CSS is
  per-route; Next keeps the previous route's sheet in the DOM.
- **A green `curl` proves nothing about client behaviour.** `UnnycWorldMap` is
  `dynamic(..., { ssr: false })`, so **none** of the map is in the prerendered
  HTML. Everything about it needs a browser.
- **A selector returning 0 is not evidence of absence.** Cost a false a11y claim
  in CLAUDE.md this morning; cost me ten minutes again this session when my own
  stylesheet-introspection helper returned `null` for a rule that was demonstrably
  applying.
- **A third-party freebie can degrade without failing.** CARTO returned HTTP 200
  the whole time it was serving watermarked tiles.
- **"CLEAN mergeable" is not "both sides survived",** and a PR's green checks may
  have run against an old base. #82's had. Merge main in locally and build.
- **Naive brace-counting on `unnyc.css` reports an imbalance (208 open / 207
  close) and that is PRE-EXISTING and benign** — `@layer unnyc {` at line 39 is
  never closed, so everything to EOF is inside it, which is the intent, and CSS
  parsers auto-close at EOF. Don't "fix" it in a panic; it was 229/228 before
  this session's deletions removed a balanced 21/21.

**Looks broken, is deliberate:**

- **`"World map — coming soon"` still exists in `UnnycHomeStoryscroller.js`** —
  the fallback branch if `worldMap` isn't passed, not the shipped state.
- **`ssr: false` on the map is now a BYTES decision, not a technical necessity.**
  There is no async work left. 176 country paths belong in a content-hashed JS
  chunk the CDN caches immutably, not inlined into every HTML response. Both call
  sites say so; don't "simplify" it away.
- **The atlas snapshot is imported, not loaded fail-soft** like
  `getCtfgProjects()`. A bundler import in a client component means a missing
  snapshot fails the **build** rather than a reader's page. That is the louder,
  cheaper failure and it is on purpose.
- **`localhost` can't submit any form.** Not in Payload's CORS allowlist.
- **`opensource.nyc` is a 307 while the other two hosts are 308.** The apex rule
  is meant to be deleted, not promoted.

**Tooling limits worth knowing before you waste time on them:**

- **Screenshots come back blank at deep scroll offsets.** The map sits ~2,208px
  down `/`; a screenshot there is a white rectangle. Use DOM measurement.
- **`resize_window` to the `desktop` preset can report `innerWidth: 0`.** Pass
  explicit `width`/`height`.
- **A synthetic `KeyboardEvent` does not run default activation** — that is
  correct browser behaviour for untrusted events, not a bug in the page. So a
  trusted Enter/Space keypress **cannot be dispatched** from here. Use
  `element.click()` to prove a control's activation path, and say plainly that
  the hardware keypress is unverified.
- **⚠ `.claude/` IS NOT INHERITED BY A GIT WORKTREE**, `launch.json` included. So
  `preview_start` finds only the *main* checkout's config and **silently starts a
  dev server on the main checkout**, serving code that is not yours. Writing a
  `launch.json` inside the worktree does not help — the tool resolves it from the
  project root. What works: add a second entry to the main
  `.claude/launch.json` with `runtimeExecutable: "sh"` and
  `runtimeArgs: ["-c", "cd <worktree> && npm run dev -- --port 3101"]`, then put
  the file back when you finish. (This session did, and restored it.)
- **`cp -Rc <main>/node_modules <worktree>/`** clones 291 MB in seconds on APFS —
  much better than a 350 MB install that needs network for the git-dep tokens.

---

## Coverage — what this session did NOT do

- **Never saw the storyscrollers scroll.** Same structural reason as this
  morning, now measured from the other side: `visibilityState: "hidden"`, 74
  elements stuck at `opacity: 0`.
- **Never dispatched a trusted keypress** at the new disclosure. Its native
  `<summary>` behaviour is intact and nothing overrides it (checked: no global
  keydown `preventDefault` anywhere — the nav's only key handler attaches when
  its drawer is open and reacts to Escape alone), and `element.click()` toggles
  correctly. But the hardware path is unverified.
- **Never opened a Vercel preview.** SSO-gated for an agent, as before.
- **Did not review the seven storyscrollers' scroll logic.** Unchanged from this
  morning's coverage note: the scroll math, carousels and reveal timing remain
  unreviewed.
- **Did not delete the third orphan** (§4.3), did not rename the misnamed map
  classes (§5.1), did not prune the stale branches.
- **Did not touch the main checkout** beyond restoring the `launch.json` entry it
  had temporarily added, and did not pull it forward one commit.
