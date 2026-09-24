# Continue here — UNNYC, after the 2026-09-19/20 and 09-24 sessions

Written from the repo, not from memory: every number below has a command that
produced it. If a claim here disagrees with the code, **the code is right and
this file is stale** — fix it.

Supersedes the 2026-09-14/15 handoff (in git; nothing else references it).

---

## 1. The one idea

**Four bugs shipped or nearly shipped in this stretch. A green build, a passing
lint and a correct-looking diff certified every one of them. Each was caught
only by measuring the real thing in the condition that breaks it.**

- `@layer` — 86% of the CSS silently discarded on any pre-March-2022 engine.
  The site had rendered unstyled there for an unknown period. **Found by a human
  looking at geopeeker.com**, not by any check we had.
- The reveal backstop **shipped in #102 and did nothing**, because its guard
  keyed off "has IntersectionObserver ever fired" — which is true in exactly the
  renderers it existed for. Local passed, production didn't; same code.
- The flex-gap probe set `height: 0` on the box it was measuring, so it reported
  "unsupported" **everywhere** and doubled every gap on the site.
- A generated fallback applied a child combinator to only the last part of a
  comma selector.

The transferable rule: **"the API is alive" is not "the API will tell me what I
need", and an environment that passes is not the environment that fails.** If a
fix targets a condition, reproduce that condition before believing the fix.

---

## 2. State — verified 2026-09-24

```bash
export DEVELOPER_DIR=/Library/Developer/CommandLineTools   # ⚠ see §6
cd /Users/devin/Antigravity/unnyc
git status --short && git branch --show-current   # clean, main
git log --oneline origin/main..HEAD               # empty
gh pr list --state open --json number -q length   # 0
npm run build                                     # runs all three lints
```

- **`origin/main` at `726b52a`** when this was written. ⚠ Don't trust that hash
  — run the block above. A handoff cannot pin its own HEAD; the previous one
  was wrong the moment its own PR merged.
- Clean tree, **nothing unpushed**, `main` the only branch, one worktree,
  **zero open PRs**.
- **All 17 production endpoints 200** (13 routes + `robots.txt`, `sitemap.xml`,
  `llms.txt`, `/data/index.json`).
- `lint:content` ✓ `lint:css` ✓ (2 warnings, expected) `lint:tokens` ✓ `build` ✓.
- Production CSS: **0 `@layer`**, 76,519 bytes, 210 `.no-flexgap` rules.
- **Six PRs merged:** #101 (drop cascade layers), #102 + #103 (reveal backstop —
  #102 did not work, #103 fixed it), #104 (flex-gap fallback), #105 (govoss.cat
  on /resources), #106 (GovOSS refresh + credit URL).

**The browser floor moved from March 2022 to roughly early 2020.** Three
`lint:css` checks hold it there.

---

## 3. Invariants — break these and something already fixed re-breaks

Tested ones are one line naming the check; `npm run lint:css` runs all four.

1. **No `@layer` / `@container` / `@scope`** — `lint:css` check 1. A pre-2022
   engine discards the whole block and the site renders unstyled.
2. **No `text-decoration: none` below (0,1,1)** — `lint:css` check 2. base.css's
   `a:hover` underline beats a single-class rule; a `:hover` regression is
   invisible to a rendered-output diff.
3. **`flex-gap-fallback.css` must not go stale** — `lint:css` check 4. Add a
   flex `gap`, run `npm run gen:flex-gap`, commit the result.
4. **Content must never depend on IntersectionObserver firing to be visible.**
   The backstop gates on `document.visibilityState`, not on whether IO fired.
   See the long comment in any storyscroller; 8 files carry it.
5. **base.css's nav/footer rules need the component root** —
   `.unnyc-page .unnyc-nav .unnyc-nav__link` (0-3-0). unnyc.css has its own
   (0-2-0) rules for `.unnyc-footer__logo` and `.unnyc-btn` and is imported
   later, so (0-2-0) loses the tie. This regressed when the layers came out:
   the footer wordmark turned `flex`, and flex drops whitespace-only children,
   so its text lost the spaces in "UN + NYC".
6. **The font token override wins by IMPORT ORDER now**, not by being unlayered.
   `layout.js` must import `base.css` (which `@import`s the design tokens)
   before `unnyc.css`, or the fonts silently stop loading.
7. **Provenance is read, never written.** `source`, `licence`, `licenceUrl`,
   `licenceCheckedFrom/On` live in `content/`; the map credit, `/resources` and
   `/data/*.json` all read the same fields. ⚠ Two literals remain by necessity:
   GovOSS's licence and its domain, both in `scripts/fetch-govoss-catalogues.mjs`,
   whose header tells you to re-read the footer and move the date on every
   refresh. Do that.
8. **Never collapse the four datasets' licences into one constant.** One is ours
   (endorser transcription, CC BY 4.0); CTFG and GovOSS are CC BY 4.0 *today*;
   the OSPO list is **CC0**. They have already disagreed twice.
9. **`Dataset` JSON-LD only for data this site made** — now just `/principles`.
10. **`data-count` takes a RAW number; the element's CHILDREN take the formatted
    one.** `Number("2,789")` is `NaN` and hydration overwrites a correct figure.
11. **Never type a count or a teaser title into `content/home.md`** — all
    derived in `page.js`. The GovOSS figure is now **3,054**.
12. **Scope any rule styling `a`, `button`, `ul`, `ol` with `.unnyc-page`.**
13. **One owner per class, imported by every route that needs it.**
14. **On `/campaign/sign` below 899px the form stays above the letter.**
15. **Never sum the GovOSS country counts** — use `countryAttributedEntries`
    (2,893) or `totalEntries` (3,054), never arithmetic on the fills.

---

## 4. Waiting on the human

1. ⚠ **Nobody has watched the storyscrollers scroll since the reveal backstop
   landed.** Load `/`, `/start`, `/success` and confirm sections still fade in
   on scroll rather than being visible up front. If they're all visible
   immediately, the backstop is firing when it shouldn't — revert #103. The
   logic is verified from both sides (Chromium 98 with a live observer kept 61
   of 64 hidden; a stubbed dead observer revealed all 64), but a headless engine
   is not a reader.
2. **Hub `168a959d` — the CTFG link question.** Blocked on *you asking CTFG for
   a stable public profile URL*; `app.civictech.guide` addresses records in a
   different id space with no public slug lookup. Commented 2026-09-24 with the
   three stale facts in its own `more_info` corrected.
3. **`endorsers.lede` in `content/principles.md` is dead copy.** Rendering it
   would *add* a sentence `/principles` does not show today. A decision.
4. **Real Safari 13.1 is untested.** Chromium 83 has the same missing feature
   and is the closest thing runnable here, but it is Blink, not WebKit. Settling
   it needs BrowserStack or an old Mac — both need your account or hardware.
5. ⚠ **The host's `git` is broken** (§6). The permanent fix needs your password.
6. **`CLAUDE.md` is 733 lines against a 300 budget.** Down from 1,012 today (the
   map sections moved to `docs/MAP-LAYERS.md`), but still 2.4x over. Cutting
   further means deleting trap documentation, which is an owner's call.

---

## 5. Candidates, ranked

1. **Nothing is broken; the next move is yours.** Six PRs merged and verified in
   this stretch and there is no known defect outstanding.
2. **Flatten the remaining above-floor CSS** if Safari 13.1 matters: `:has()`
   (8 files, scrollbar tint only) and `text-wrap: pretty` (7 files). Both
   degrade invisibly, so this is polish, not a fix.
3. **Refresh the CTFG snapshot.** GovOSS was refreshed 2026-09-24; CTFG is still
   the 62-project curated one from August, and its licence is now read rather
   than hardcoded, so a refresh is safe. Read the diff.
4. **Prune `CLAUDE.md` properly** (§4.6) — the same move that just worked:
   lift conditional detail into `docs/` and leave a pointer, rather than delete.

---

## 6. Traps

### ⚠ The host's `git` is broken — read this first

`/usr/bin/git` is Xcode's shim and the licence is unaccepted, so git **and
`gh`** fail. No-password workaround, needed in every shell:

```bash
export DEVELOPER_DIR=/Library/Developer/CommandLineTools
```

Permanent fix needs the user: `sudo xcodebuild -license accept`.

### Looks broken, is fine

- **`grep '@layer' src/**/*.css` returns 6 hits.** All are explanatory comments;
  `lint:css` blanks comments and is authoritative. Trust the lint, not the grep.
- **`"World map — coming soon"`** still exists in `UnnycHomeStoryscroller.js` —
  the fallback branch if `worldMap` isn't passed.
- Comments naming `UnnycEndorserDirectory`, `PrimerMapInner` and `@layer` survive
  on purpose, recording what was removed and why.

### Looks fine, is not

- **Computed styles FREEZE in this repo's preview pane.** The tab is hidden, so
  CSS transitions never advance and rAF is throttled: an element whose inline
  style says `opacity: 1` still computes `0`, and the homepage count-ups read
  `0` forever. **Inline style and the SSR HTML are ground truth here.** This
  cost a wrong conclusion mid-session.
- **IntersectionObserver fires here sometimes and not others.** That
  inconsistency is exactly what made #102 look verified locally while doing
  nothing in production. If a fix concerns IO, stub it explicitly rather than
  relying on the pane's behaviour.
- **A `curl | grep` hit is not proof a string renders** — unused prop keys ship
  in the RSC flight payload. Check `document.body.innerText`.
- **A rendered-HTML check cannot see a hydration defect.** The mirror of the above.
- **A selector returning 0 is not evidence of absence.** Check the component.
- **Screenshots come back blank at deep scroll offsets**, and `innerWidth` is
  `0` in a fresh tab — set an explicit viewport before measuring anything.

### Testing on a genuinely old browser — the recipe that worked

Chromium runs here under Rosetta; snapshots live at
`https://storage.googleapis.com/chromium-browser-snapshots/Mac/<rev>/chrome-mac.zip`
(not every revision exists — `Mac/756071` = Chrome 83, `puppeteer@13.1.3` pulls
Chrome 98). Modern puppeteer **cannot** drive Chrome 83's CDP; use its own
headless CLI (`--headless --dump-dom`, `--screenshot`, `--virtual-time-budget`)
instead. ⚠ `timeout` does not exist on macOS. Screenshots are 2× DPI viewport
captures; GeoPeeker's tiles are full-page captures squished to 340px wide and
**judging them at that scale is misleading** — it cost two wrong conclusions.

### Method traps from the CTFG work

- **A bogus `recordId` on `app.civictech.guide` returns HTTP 200** — it is a
  client-rendered shell, so status codes prove nothing there. Only rendered text
  distinguishes a real record from a dead one.

---

## Coverage — what these sessions did NOT do

- **Never watched a storyscroller scroll** (§4.1). Structurally impossible here.
- **Never tested real Safari** — only Chromium 83/98, which is Blink.
- **Did not re-run the Chromium 83 visual test against production** after #104
  merged; it was verified against the identical local build, and production was
  confirmed to ship both halves (probe + 210 fallback rules).
- **Did not refresh the CTFG snapshot** — only GovOSS.
- **Did not fix the host's git** — needs the user's password.
- **Did not close Hub `168a959d`** — still the human's call; commented, not moved.

---

## Starting prompt for the next session

Paste this:

> I'm continuing work on the UNNYC campaign site (`~/Antigravity/unnyc`, live at
> https://un.opensource.nyc).
>
> ⚠ First: git on this machine is broken — run
> `export DEVELOPER_DIR=/Library/Developer/CommandLineTools` in every shell, or
> git and gh both fail.
>
> Read `/Users/devin/Antigravity/unnyc/docs/CONTINUE.md` — verified state,
> invariants, what's waiting on me, and the traps. That is the only file you
> need up front. Read `/Users/devin/Antigravity/unnyc/docs/MAP-LAYERS.md` ONLY
> if you touch the map, a `content/*` snapshot or a fetch script.
>
> Then query the Hub: `get_workspace_detail("unnyc")` and
> `list_tasks(workspace="unnyc")`. One task is open (`168a959d`) and its latest
> comment explains why it is blocked on me rather than forgotten.
>
> Three things before you touch anything: pushing `main` deploys to production
> with no gate; the map is `ssr: false` so curl cannot see it; and computed
> styles freeze in the preview pane, so inline style and SSR HTML are ground
> truth, not `getComputedStyle`.
>
> Do not write a handoff, continuation prompt, or session record unless I ask for
> `/handoff`. End your turn with what you did and what you recommend next.
