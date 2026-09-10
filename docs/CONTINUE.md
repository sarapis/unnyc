# Continue here — UNNYC, after the 2026-09-10 storyscroller session

Written from the repo, not from memory. Every number below has the command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

---

## 1. The one idea

**A green build and a correct `curl` prove less than you think, and this session
had both while shipping two visible defects.**

The homepage went live reading `NaN OPEN SOURCE APPLICATIONS…` and, below it,
`World map — coming soon`. The build was green. The server-rendered HTML was
*correct* — I grepped it, found `2,789`, and passed the check. The `NaN` was
introduced by **hydration**: the count-up animation reads
`Number(el.dataset.count)`, and `Number("2,789")` is `NaN`, so the client
overwrote a right answer with a wrong one. No error, no console warning, nothing
for CI to catch.

The same shape appeared three more times today:

- **CARTO** put its free basemap behind an API key and kept returning **HTTP 200
  with a valid PNG** — every tile just arrived stamped `API KEY REQUIRED`.
  Defacing production for an unknown period. Only a human looking at the page
  caught it.
- **Merging seven individually-green PRs** produced two defects present in none
  of them: duplicated `rentCard:` YAML (both PRs added it at different lines, so
  git merged both *cleanly* and YAML then failed) and a lost thousands separator.
- **I wrote a false claim into `CLAUDE.md`** — that the map's accessible marker
  list "could not be found in the DOM" — because a browser selector looking for
  `li` children returned 0. The list is there; the rows are `div`s. **A selector
  that returns 0 is not evidence of absence.** Corrected in this session's last
  commit.

So: for anything client-side, use a browser. For anything you're about to write
down as *missing*, read the source first.

---

## 2. State — verified 2026-09-10

```bash
cd /Users/devin/Antigravity/unnyc
git branch --show-current && git status --short     # main, clean
gh pr list --state open --json number -q 'length'   # 0
```

- **Branch `main`, clean tree, nothing unpushed** once this handoff's own PR (#81,
  these docs) is merged. Everything before it is already on `main`.
- **Eleven PRs merged 2026-09-10**: #71–#77 (Olivia's seven storyscrollers,
  auto-closed by the integration merge), #78 (the integration branch), #79 (docs),
  #80 (the NaN + map fix), #81 (this handoff). #65 was closed as superseded
  earlier. **~20 stale local branches** remain from that stretch — all merged,
  none load-bearing, prune when convenient.
- **Production is healthy.** All 13 routes 200. `/`, `/start`, `/principles`,
  `/crosswalk`, `/success`, `/resources`, `/campaign/sign` checked directly.
  `curl https://un.opensource.nyc/start | grep -c cartocdn` → **0** (the
  watermark is gone). `curl https://un.opensource.nyc/ | grep -c NaN` → **0**.
- **Seven pages are storyscrollers**, each with its own
  `Unnyc<Page>Storyscroller` component and `unnyc-<page>-story__` class prefix.
  `#75` also added a site-wide `BackToTop`.
- **The `/start` Leaflet map is gone**; `/` and `/start` both render
  `UnnycWorldMap` (static d3-geo + topojson SVG, no tile server, no API key).
- **Derived data survived the rewrite** — checked, not assumed: homepage stats
  read `18 / 2,789 / 150` from the OSPO directory, the GovOSS snapshot and the
  endorser snapshot; the six `/crosswalk` reason titles are byte-equal on `/` and
  `/crosswalk`; 150 of 150 endorser names are server-rendered on `/principles`.
- **New runtime deps** from #75: `d3-geo@^3.1.1`, `topojson-client@^3.1.0`.
- **No dev server left running.** The session's one on port 3100 was stopped;
  `lsof -ti tcp:3100` returns only the desktop app's own network-service socket,
  not a server. Start a fresh one with the `unnyc-dev` launch config.

- **The board carries today's work.** Hub `841ee0a9` (unnyc) has a comment
  (`72ea15ff`) recording the eleven merges, the CARTO failure and the two new
  owner decisions; Hub `7d5fdeef` (Databook2) holds the Mapbox token finding.
  Both read back after writing — verified, not assumed. Neither task's status
  moved: everything left on them is a human decision.

### Not mine, but you'll see it
`~/Antigravity/map1` and `~/Antigravity/Databook2` show dirty trees
(`.claude/`, `handoffs/`, an `.env.backup` dated 09-04). **Pre-existing** — this
session only ran read commands (`git show`, `grep`) in both. Databook2 is on
branch `feat/capital`, not `main`.

---

## 3. Invariants — break these and something already fixed re-breaks

1. **`data-count` takes a RAW number; the element's children take the formatted
   one.** Formatting the attribute reintroduces the `NaN` above. Documented on
   `Stat` in `UnnycHomeStoryscroller.js`. Pass numbers from `page.js`, not
   strings.
2. **Never type a count or a teaser title into `content/home.md`.** Every figure
   and list on the homepage is derived in `src/app/page.js` from the file its
   target page renders. Olivia's PRs briefly hardcoded them and the homepage
   contradicted `/crosswalk` about three reason titles within a day.
3. **The map's markers/legend/credit are READ from `content/start.md`** by both
   `/` and `/start`. Copy them and the two maps drift.
4. **Scope any `@layer unnyc` rule that styles `a`, `button`, `ul` or `ol` with
   `.unnyc-page`.** Six bugs so far; the most recent was `ul { margin: 0 }`
   silently zeroing a list's bottom margin and parking a CTA button on the text.
5. **`content/crosswalk.md`'s lede is the Aug-13 version by owner decision**
   (PR #70). It reintroduces an unsourced "$2 billion a year" where the replaced
   text had two Databook contract links — that was the owner's call, so don't
   "fix" it back.
6. **Attribution is a licence term for GovOSS and CTFG.** Both are CC BY 4.0
   *today* — that's a coincidence, not an invariant. Keep the strings per-source.

---

## 4. Waiting on the human — not mine to decide

1. **The Databook Mapbox token** — Hub task **`7d5fdeef`** (Databook2, `Idea`).
   One hardcoded `pk.` token for an account called **`soundpress`** appears in six
   places in Databook2 and is served publicly at
   `https://databook.nyc/js/script.js`. It works today (tested: HTTP 200 for
   styles and tiles). **First step is owner-only: can you sign into that Mapbox
   account?** Everything downstream branches on the answer, and both branches are
   written into the task. Note `map1` already does this correctly via
   `PUBLIC_MAPBOX_TOKEN`, so the house pattern exists — it just isn't applied
   consistently.
2. **Delete the orphaned Leaflet map, or keep it?** `PrimerMapInner.js` (15,869
   bytes) has **zero** non-comment references outside itself; `PrimerMovementNow.js`
   (5,933 bytes) has only two comment mentions. `leaflet@^1.9.4` is still in
   `dependencies`. Kept deliberately because it is the working implementation of
   the pan/zoom and per-country keyboard access the SVG gives up — but restoring
   it means restoring the CARTO watermark. **Decide; don't leave it as folklore.**
3. **Nobody has watched the storyscrollers scroll.** Seven scroll-driven pages
   are in production verified only by build, rendered text and invariants,
   because the tools here deliver **no scroll events at all**. This is the
   largest untested surface on the site.
4. Three older content decisions still open on Hub `841ee0a9`: the declaration's
   two-sections-vs-the-UN's-three question (matters before it goes to OTI),
   "Hundreds" over a countable 150, and retiring `old-unnyc.wegov.nyc`.

---

## 5. Candidates, ranked

1. **Snapshot the world atlas locally.** `UnnycWorldMap` fetches
   `cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json` (39 KB, measured
   in-browser) at runtime, on **both** `/` and `/start` now. That contradicts this
   repo's own snapshot doctrine, and if jsdelivr is blocked the map has no
   countries. `content/govoss-countries.geo.json` already proves the pattern —
   the fetch script that produced it could emit a world file.
   *Why now:* it's the last third-party runtime dependency on the two most
   important pages, and the CARTO episode is exactly the risk it carries.
2. **Fix the three colour literals** `wg-lint-tokens` reports in `home.css`
   (`#ffffff` ×3, lines 236/744/750 — `stroke` and `fill`). Non-blocking
   (`|| true` in prebuild) but invisible to the brand-variant mechanism, which is
   the failure the two-tier token system exists to prevent.
   *Why now:* three lines, and the warning will be ignored into permanence.
3. **Decide the Leaflet deletion** (see §4.2) and, if deleting, drop the
   `leaflet` dependency with it.
4. **Add per-country keyboard access to the SVG**, if §4.2 says the old map goes.
   The markers are already reachable as text; the GovOSS country counts are not.

---

## 6. Traps — looks broken but isn't, and looks fine but isn't

**Looks broken, is deliberate:**

- **`"World map — coming soon"` still exists in `UnnycHomeStoryscroller.js`.** It
  is the fallback branch if `worldMap` isn't passed, not the shipped state. The
  real map renders.
- **`content/home.md` still references `SDGs01.jpeg`** while the storyscrollers
  use `SDGs01.png`. Both are real: the `.jpeg` is the journey-era photo, still
  rendered once in the built homepage; the `.png` is the transparent cutout. Both
  have CREDITS rows.
- **`localhost` can't submit any form.** Not in Payload's CORS allowlist, by
  design. To test the live origin without creating a record, POST an
  intentionally invalid body and confirm Payload answers `400 "invalid: Email"`.
- **`opensource.nyc` is a 307 while the other two hosts are 308.** The apex rule
  is meant to be *deleted* when that domain becomes its own project; a cached 308
  would strand it.
- **`unnyc-campaign.vercel.app` serves the site (200).** A fifth host outside the
  redirect map — it correctly declares `un.opensource.nyc` as canonical.

**Looks fine, isn't:**

- **A green `curl` of a page proves nothing about client behaviour.** See §1. The
  `NaN` was invisible to SSR checks for the entire time it was live.
- **"CLEAN mergeable" on a PR is not "both sides survived".** Two PRs adding the
  same YAML block at different line positions merge cleanly into a duplicate key
  and a broken build. Merging parallel page rewrites needs a build *after* the
  merge, not just green checks on each.
- **A third-party freebie can degrade without failing.** CARTO returned HTTP 200
  the whole time. Error monitoring would never have seen it.
- **Vercel preview URLs are SSO-gated**, so an agent gets a 302 and cannot see
  them; only the account owner can. Fork PRs get no preview at all (that's what
  #76's "Vercel fail — Authorization required" was, not a broken build).
- **Screenshots come back blank at deep scroll offsets**, and `resize_window` to
  the `desktop` preset has returned `innerWidth: 0`, which makes *every* element
  report as overflowing. Verify a deep section on a short page instead.

---

## Coverage — what this session did NOT do

- **Never saw the storyscrollers scroll.** No scroll events in these tools. Seven
  pages shipped on that basis.
- **Never opened a Vercel preview.** SSO-gated; all preview verification was
  indirect (build output, local dev server, production after merge).
- **Did not review the seven PRs line by line.** The review was targeted at this
  repo's known traps (derived counts, `.unnyc-page` scoping, class-prefix
  collisions) plus post-merge invariants. Storyscroller *logic* — the scroll
  math, the carousels, the reveal timing — is unreviewed.
- **Did not touch `map1` or `Databook2`** beyond reading. The Mapbox token
  finding is recorded in Hub `7d5fdeef`; no code was changed there.
- **Left the orphaned Leaflet components and the `leaflet` dependency in place**
  pending the decision in §4.2.
