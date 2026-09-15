# Continue here — UNNYC, after the 2026-09-14/15 sessions

Written from the repo, not from memory: every number below has the command that
produced it, and the absences were checked rather than assumed. If a claim here
disagrees with the code, **the code is right and this file is stale** — fix it.

Supersedes the 2026-09-11/12 handoff.

---

## 1. The one idea

**A licence, a source and a credit are the licensor's facts, not ours — and
this repo has now got each of them wrong at least once by writing the value
into code instead of reading it from the source.**

Three incidents, same shape:

- CTFG's licence was a hardcoded literal in a fetch script, so the site
  published **CC BY-NC-SA** for two weeks after CTFG relicensed to CC BY 4.0.
- The OSPO directory was declared **ours, CC BY 4.0** in a published dataset
  and on the map credit. It is the **FLOSS-PSO Network's CC0 list** — verified
  name-for-name, 18 for 18 — and `content/resources.md` had recorded their
  `sourceUrl` the whole time. Only `/resources` ever read it, so the map
  credited "this site" while the page below it credited them, and nothing in
  the build noticed the two disagreeing.
- `/resources` emitted `Dataset` JSON-LD naming **this site as `creator`** of
  that same CC0 list.

The rule that falls out: **provenance lives in content, is read from the
source, and every consumer reads the same fields.** Never name a source or a
licence in JSX. A source recorded in the data but read by only one consumer is
a coincidence, not provenance.

---

## 2. State — verified 2026-09-15

```bash
export DEVELOPER_DIR=/Library/Developer/CommandLineTools   # ⚠ see §6
cd /Users/devin/Antigravity/unnyc
git status --short && git branch --show-current   # clean, main
git log --oneline origin/main..HEAD               # empty
gh pr list --state open --json number -q length   # 0
```

- **`origin/main` was at `b37214f`** ("Merge PR #97") when this section was
  written. ⚠ **Don't trust that hash — or any hash in a handoff. Run the block
  above.** It was already wrong by the time anyone could read it: #98 merged
  *this very file* on top of it (`0900ee2`), and #99 moved it again
  (`acae135`). **A handoff cannot pin its own HEAD**, so the hash is the one
  line here guaranteed to go stale; everything below it is what to check.
- Local `main` equal to `origin/main`, **working tree clean, nothing
  unpushed**.
- **`main` is the only branch**, locally and on origin. One worktree.
- **Zero open PRs.**
- **All 17 production endpoints 200** — 13 routes plus `robots.txt`,
  `sitemap.xml`, `llms.txt`, `/data/index.json`.
- `lint:content`, `lint:tokens` and `build` all clean.
- **Five PRs merged across these sessions:** #94 (maps keep a legend and
  nothing below), #95 (credit the FLOSS-PSO Network), #96 (orphan deleted, band
  unified, map classes renamed), #97 (decisions recorded), plus #92 (the
  previous handoff).

---

## 3. Invariants — break these and something already fixed re-breaks

1. **Provenance is read, never written.** `source`, `licence`, `licenceUrl`,
   `licenceCheckedFrom`, `licenceCheckedOn` live in `content/`; the map credit,
   `/resources` and `/data/*.json` all read the same fields. Naming a source in
   JSX is how the map and the page disagreed for weeks.
2. **Never collapse the four datasets' licences into one constant.** One is
   ours (the endorser transcription, CC BY 4.0); CTFG and GovOSS are CC BY 4.0
   *today*; the OSPO list is **CC0** — a different licence entirely. They have
   already disagreed twice.
3. **`Dataset` JSON-LD only for data this site made** — now just `/principles`.
   `datasetLd` emits `creator: this site`.
4. **`data-count` takes a RAW number; the element's CHILDREN take the formatted
   one.** `Number("2,789")` is `NaN` and hydration overwrites a correct figure.
5. **Never type a count or a teaser title into `content/home.md`.**
6. **Scope any `@layer unnyc` rule styling `a`, `button`, `ul` or `ol` with
   `.unnyc-page`.** Six bugs so far.
7. **One owner per class, imported by every route that needs it** —
   `world-map.css`, `keep-going.css`. But ⚠ **extracting shared CSS merges
   assumptions about context, not just rules**: enumerate every element the
   sheet colours and check each against the consumer's real background. That
   one took **three** passes to finish (1.21:1 → 1.35:1 → 1.84:1, §6).
8. **On `/campaign/sign` below 899px the form stays above the letter.**
9. **Never sum the GovOSS country counts.**

---

## 4. Waiting on the human

Short, because almost everything was decided on 2026-09-14. **Do not re-open
the settled items as bugs** — they are listed in §5 so you recognise them.

1. **Hub `168a959d` — the CTFG link question.** The original premise is void
   (the map's CTFG dots stopped linking out on 2026-09-10; nothing on the site
   points at that directory). The owner then asked to repoint them at
   `app.civictech.guide`, and that is **blocked, not skipped** — see §6 for the
   evidence. The one clean path is **asking CTFG for a stable public profile
   URL**, then one line in `scripts/fetch-ctfg-projects.mjs`. That ask is the
   owner's to make.
2. **`endorsers.lede` in `content/principles.md` is dead copy.** Rendering it
   would *add* a sentence `/principles` does not currently show, and "More than
   150" reads odd against a directory whose chips total exactly 150. A
   decision, not a bug.
3. **The Databook Mapbox token** — Hub `7d5fdeef`. Different workspace,
   owner-only first step. Not this repo.
4. ⚠ **The host's git is broken** (§6). Fixing it needs the user's password.

---

## 5. Settled — recognise these, don't re-litigate them

All owner decisions, 2026-09-14, recorded in `CLAUDE.md` with reasoning:

- **No text lists under the maps** — a legend and the credit line, nothing
  else. ⚠ This area has been rebuilt on a *decision* twice in five days.
- **Map pin WCAG 2.5.8 is an ACCEPTED GAP.** Pins are 19–21px desktop, ~7px
  phone; the exception that covered them went with the lists. ⚠ Do **not**
  "fix" it by inflating the hit circles — 24px at phone scale overlaps
  neighbouring European pins, trading a size failure for pins that activate
  each other. The live options were a text equivalent or a bigger/zoomable map.
- **`old-unnyc.wegov.nyc` is KEPT.** Nothing depends on it; retiring was
  offered and declined.
- **The printable declaration keeps its two-section structure**, not the UN's
  three.
- **The endorser lede is "More than 150"** (unrendered — §4.2).
- **The storyscrollers have been seen by a human** and look right. That closed
  a four-session unknown. ⚠ Still true for any *new* scroll work: only a human
  can check it — `document.visibilityState` is `"hidden"` in these tools, so
  IntersectionObserver never fires and every `[data-reveal]` sits at
  `opacity: 0`.

---

## 6. Traps

### ⚠ The host's `git` is broken — read this first

`/usr/bin/git` is Xcode's shim and the Xcode licence has not been accepted, so
**every git command fails** with "You have not agreed to the Xcode license
agreements". `xcode-select -p` points at `/Applications/Xcode.app/...`. There is
no Homebrew git on this machine.

**Workaround that needs no password** (used throughout this session):

```bash
export DEVELOPER_DIR=/Library/Developer/CommandLineTools
```

**Permanent fix, needs the user's password** — an agent cannot run either:

```bash
sudo xcodebuild -license accept          # or
sudo xcode-select -s /Library/Developer/CommandLineTools
```

`gh` shells out to git, so it fails the same way and is fixed the same way.

### Looks fine, isn't

- ⚠ **A `curl | grep` HIT IS NOT PROOF A STRING RENDERS.** An unused key on a
  prop object is serialised into the **RSC flight payload** and ships in the
  HTML. `endorsers.lede` greps as a hit on `/principles` from inside an escaped
  JSON string in a `<script>`; `document.body.innerText` does not contain it.
  **The exact mirror of the hydration trap** — that one is a defect the HTML
  cannot show you, this one is a string the HTML shows you that no reader sees.
- **A closed disclosure hides its own defect.** The catalogue rows sat at
  1.35:1 on the dark homepage for four days *after* #88 fixed everything around
  them, because nobody opens a `<details>` on the page where it is broken.
  **Contrast-check what a control reveals, not only what it shows.**
- **Small grey type looks deliberate when it is unreadable.** The map credit —
  the **CC BY attribution** — sat at 1.84:1 on production until 2026-09-14.
- **A green `curl` proves nothing about the map.** `UnnycWorldMap` is
  `ssr: false`; none of it is in the HTML.
- **A selector returning 0 is not evidence of absence.** Cost a false a11y
  claim in CLAUDE.md once (`li` children that were `div`s).

### Method traps found chasing app.civictech.guide

- ⚠ **A bogus `recordId` on `app.civictech.guide` returns HTTP 200** — it is a
  client-rendered shell, so **status codes prove nothing there**. A real
  `airtable_id` from CTFG's own API renders "Record details can no longer be
  found". Only rendered text distinguishes them.
- The app addresses profiles as `/p/<slug>/r/<recordId>` using an Airtable
  record id in a **different id space** from the `airtable_id` CTFG's public
  API exposes; `/p/<slug>` alone is "Page not found"; there is no public
  slug→recordId lookup; and CTFG's own `rel="canonical"` still names
  `civictech.guide/projects/<slug>`. That is why §4.1 is blocked.

### Tooling limits

- ⚠ **Set an explicit viewport before measuring anything.** `innerWidth` is `0`
  in a fresh tab and after the `desktop` preset; numbers taken then are
  *plausibly* wrong, not obviously wrong.
- **Screenshots are blank at deep scroll offsets** (~990px+ on desktop). A
  375px capture at 2.6k worked. Verify by DOM measurement instead.
- ⚠ **Nothing with `data-reveal` appears in a screenshot.** Inject
  `[data-reveal]{opacity:1 !important;transform:none !important}` — debug only.
- **The hidden pane throttles timers**, so a click and its result must be split
  across two `javascript_tool` calls.
- **A synthetic `KeyboardEvent` does not run default activation.** Use
  `element.click()` and say plainly that the hardware keypress is unverified.

### Looks broken, is deliberate

- `"World map — coming soon"` still exists in `UnnycHomeStoryscroller.js` — the
  fallback branch if `worldMap` isn't passed.
- Comments naming `UnnycEndorserDirectory`, `unnyc-endorsers__` and
  `unnyc-start-story__map-*` survive **on purpose**, recording what was removed
  and why. They are not live code — checked: the component is gone, and
  `primer.css` has **0** `unnyc-endorsers__` rules.
- `unnyc-start-story__*` still exists (97 occurrences) and belongs to that
  storyscroller. **Don't sweep the prefix** — only the 55 `unnyc-world-map__*`
  were renamed.
- `ssr: false` on the map is a **bytes** decision now, not a technical one.
- `localhost` cannot submit any form — not in Payload's CORS allowlist.

---

## Coverage — what these sessions did NOT do

- **Did not close Hub `168a959d`**, deliberately: its premise is void but a
  real unanswered question replaced it (§4.1).
- **Could not repoint the CTFG links** as asked. Blocked with evidence, not
  skipped — and I nearly wrote 62 broken links before checking, which is what
  the §6 method traps are.
- **Never watched a storyscroller scroll myself** — a human did, and confirmed
  it. Structurally impossible here.
- **Never dispatched a trusted keypress** at a map pin.
- **Did not fix the host's git** — needs the user's password.
- **Did verify `/resources` in a browser after the rename** (this was the one
  gap left, so it was closed rather than handed over): the source line reads
  **"SOURCE FLOSS-PSO Network (CC0 1.0)"** — with the load-bearing space —
  linking to `floss-pso.network`; the open-data note carries the corrected
  "some…others" wording; and the foot renders the **shared** band ("Let's keep
  going", 5 links including `/principles`), not the old "Looking for something
  else?" one.
