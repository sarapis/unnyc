# UNNYC

> Standalone campaign site: make NYC the first city in the Americas to endorse the
> UN Open Source Principles. Next.js on Vercel, live at **https://un.opensource.nyc**
> (the apex `opensource.nyc`, `www` and `unnyc.wegov.nyc` all 307 there — see
> docs/CONTINUATION-PROMPT.md for the full map and why every hop is a 307).

Read [README.md](README.md) first — routes, the two form paths, env, CSS architecture.
Read [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md) before changing any copy.
This file is the agent-specific delta.

## Repo shape

Next app is at the **repo root** (no `frontend/` subdirectory — unlike its parent
repo `wegovnyc_front`). Vercel's defaults work unchanged.

## ⚠️ Pushing to `main` deploys to production

Git integration was connected 2026-08-04. **A push to `main` goes live at
un.opensource.nyc immediately** — there is no manual gate. Push deliberately.

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

Five things are NOT inherited, all because they are gitignored:

| | |
|---|---|
| `node_modules` | needs its own `npm install` — **350 MB**, and `@wegovnyc/design-tokens` is a git dep so it needs network. ⚠ Faster: `cp -Rc <main>/node_modules <worktree>/` clones it in seconds on APFS, no network |
| `.vercel` | `vercel link --yes --project unnyc-campaign` before any manual deploy |
| `.next` | cold first build; fine, just expected |
| `.claude/` | **including `launch.json`** — so `preview_start` finds only the MAIN checkout's config and silently starts a server on the main checkout, serving code that is not yours. Writing a `launch.json` inside the worktree does NOT help; the tool resolves it from the project root. Add a second entry to the main `.claude/launch.json` with `runtimeExecutable: "sh"` and `runtimeArgs: ["-c", "cd <worktree> && npm run dev -- --port 3101"]`, and put it back when you finish |
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
their `## slug` section, and duplicate `### Label` keys. Two checks WARN rather
than fail: unknown `gloss:` refs, and `meta:`/`meta*:` fields outside the length
a search result or social card actually shows (~60 title, ~160 description).
The length check is a warning by design — copy length is a judgement call and a
build should never fail over four characters — but it is the only thing watching:
five routes had drifted before it existed, including a 232-character description.
Errors exit 1.

## The map — see docs/MAP-LAYERS.md

`/` and `/start` draw one component, `UnnycWorldMap`: a static d3-geo + topojson
SVG with four data layers (GovOSS country fill, CTFG programs, public-sector
OSPOs, curated policy markers). ⚠ **309 lines about it moved to
[docs/MAP-LAYERS.md](docs/MAP-LAYERS.md) on 2026-09-24** — read that before
touching the component, `world-map.css`, any `content/*` snapshot, a fetch
script, or the credit line. It holds the licence terms (three sources, three
different licences), why the layers stack in that order, the Natural Earth
`ISO_A2 = -99` trap, and why the per-country counts must never be summed.

## Page structure as of 2026-08-20

Thirteen routes. The reader path is `/` → `/start` → `/principles` → `/crosswalk`
→ `/success` → `/resources`, which is also the nav order.

- **SEVEN PAGES ARE STORYSCROLLERS as of 2026-09-10** (unnyc#71-#78, Olivia's, merged
  as one integration branch): `/`, `/principles`, `/crosswalk`, `/success`, `/start`,
  `/resources` and `/campaign/sign`, each with its own
  `Unnyc<Page>Storyscroller` component and its own `unnyc-<page>-story__` class
  prefix in its own stylesheet. `#75` also added a site-wide `BackToTop`.
  ⚠ **Scroll behaviour is UNVERIFIABLE with the tools in this repo** — the preview
  pane delivers no scroll events at all (see docs/CONTINUATION-PROMPT.md), so a
  storyscroller can only be checked by a human. Builds, rendered text and
  invariants are what an agent can prove.
  ⚠ Two defects came from MERGING the seven together, neither present in any one
  of them: `content/crosswalk.md` ended up with two identical `rentCard:` blocks
  (both PRs added one at a different line, so git merged both CLEANLY and YAML
  then failed on the duplicate key — the "CLEAN is not both-survived" case), and
  the homepage's `2,789` lost its `toLocaleString` and rendered `2789`. Fixed in
  the integration commit; expect this class of thing whenever parallel page
  rewrites land together.
- **`/` was a vertical-scroll journey from 2026-09-01 to 09-10** and is now the
  homepage storyscroller. It keeps the full-bleed UN HQ hero
  (`PrimerHeroFullBleed`; the gradient `PrimerHero` survives, swappable back in
  `page.js`) and copy still lives in `content/home.md` under `journey:` — ⚠ NOT
  `sections`, which the parsed body silently overwrites.
  ⚠ **Every proof row is DERIVED in `page.js`** — the 18/3,054/150 figures from
  the OSPO directory, the GovOSS snapshot and the endorser snapshot; the six
  reason titles read out of `content/crosswalk.md`'s own blocks; the case titles
  from `content/success.md`. They were authored literals for ONE commit and the
  homepage contradicted /crosswalk's titles within a day. Never type a count or
  a teaser title into `home.md`.
  ⚠ **Resources still has NO section and is NOT in the footer**, so the top nav
  is its only route in from the homepage. The old first-card
  favicon-placeholder problem is retired: the first section's stat row is its
  visual, no image to license.
- **`/principles` is TWO NAMED SECTIONS**, each opening on one principle as a
  full-width card and then three in columns:
  *Software Principles* — Open by default, then Secure by design / Design for
  reusability / Well documented. *Community Principles* — Contribute back, then
  Foster inclusive participation / RISE / Sustain and scale. No sub-headings.
  ⚠ This elevates **#2 Contribute back** to a section lead, which the UN reserves
  for #1 — our editorial reading, not theirs.
  Below the sections: the eight per-principle NYC arguments (that prose MOVED off
  `/crosswalk`, it is not duplicated) with a **sticky side rail**, then the
  **endorser directory**. `/start/principles` → 308 → `/principles/document`.
- **`/crosswalk` is six numbered reasons**, not a principle-by-principle
  crosswalk. It kept only what is its own: what vendor reliance costs, and why NYC
  is central. It has its own **sticky reasons rail** reusing the same component.
  Its dollar figures link to Databook.NYC contract records — keep new claims
  checkable the same way.
- **Both printables diverge from the UN's structure.** `/principles/document` and
  `/campaign/endorse/document` present TWO groups where the UN publishes three.
  The declaration is the document intended for OTI and it cites the UN as source —
  worth re-reading before it is sent.

### The endorser directory (`/principles`, bottom)

**150 organizations**, filterable by sector, paginated 16 a page, from
`content/un-endorsers.json` — a 2026-08-06 snapshot of the UN's own page, read by
`getUnEndorsers()` (fail-soft).

- **NO LOGOS, deliberately.** Third-party trademarks; the UN displaying them grants
  no onward rights. Names and sectors only, so the file is 14 KB.
- **The names are a TRANSCRIPTION.** The source page carries 154 logos and zero
  names — every card's title element is empty. One error is recorded in the file's
  `corrections`: #143 was "RTÉ" (Irish broadcaster); the logo is RTE, the French
  grid operator.
- 154 → 150: #121 unnamed, #114 a KDE duplicate, #3 and #21 unclassifiable. Each
  reason is in `excluded`.
- **Counts are DERIVED in the component, never authored**, so a refreshed snapshot
  cannot leave the page claiming a number it no longer shows. ⚠ The lede says
  "Hundreds" over a countable 150 — owner's wording, flagged in the content.
- **The 10 organizations this site's earlier copy named are NOT a gap in the
  transcription — RESOLVED 2026-08-21.** Open Knowledge, OpenInfra, Matrix,
  Sovereign Tech Agency, ZenDiS, Nextcloud, Rocket.Chat, Linagora, LPI and the
  European Open Source Academy are all still absent from the UN's page, searched
  by name and by logo-slug across the whole endorser region — and that region
  still holds exactly **154 images**, unchanged since the snapshot was taken, with
  still no organization names as text. So the snapshot is faithful and those ten
  came from some other source. Recorded in the file's own `recheck` field; re-run
  the same check rather than trusting this line.

`/resources/guide` is the long-form UN-system briefing, ported from the retired
`old-unnyc.wegov.nyc` hub. **That host is no longer load-bearing.**

## Non-obvious things that will bite you

- **⚠ A FORMATTED NUMBER IN `data-count` RENDERS "NaN" AFTER HYDRATION.** The
  storyscrollers' count-up animation reads `Number(el.dataset.count)`, and
  `Number("2,789")` is `NaN` — so passing a `toLocaleString()`ed value replaces the
  CORRECT server-rendered figure with `NaN` the instant the page hydrates. It shipped
  that way on 2026-09-10. `18` and `150` were unaffected because they have no comma,
  which made it present as one broken stat rather than a broken mechanism.
  **The rule: `data-count` takes the raw number, the element's CHILDREN take the
  formatted one** — see the `Stat` component in `UnnycHomeStoryscroller.js`, which
  documents both jobs. Pass numbers, not strings, from `page.js`.
  ⚠ **And note how it evaded checking:** the SSR HTML was correct the whole time, so
  grepping the rendered output found `2,789` and passed. **A rendered-HTML check
  structurally cannot see a defect that hydration introduces.** Anything involving a
  client component's `useEffect` needs a browser, not `curl`.
- **⚠ A `curl | grep` HIT IS NOT PROOF A STRING RENDERS.** An unused key on an
  object passed as a prop to a client component is **serialised into the RSC
  flight payload** and ships in the HTML anyway. `content/principles.md`'s
  `endorsers.lede` is the live example: nothing reads `copy?.lede` — the
  storyscroller destructures 15 other `copy?.*` fields and not that one — yet
  `curl https://un.opensource.nyc/principles | grep "More than 150"` returns a
  hit, from inside an escaped JSON string in a `<script>`. Confirmed in a
  browser: `document.body.innerText` does NOT contain it.
  **This is the exact mirror of the hydration trap below** — that one is a
  defect the rendered HTML cannot show you; this one is a string the rendered
  HTML shows you that no reader ever sees. Check `innerText` in a browser, not
  the transport. The same applies to any prop object with unused keys: it is
  bytes on every response and readable by anyone viewing source.
- **`getContent()` must be called inside the component or `generateMetadata`, not
  at module scope.** The markdown isn't a module dependency, so a module-level call
  is evaluated once per dev-server process and edits won't appear until a restart.
  This was a real bug; don't "optimise" it back.
- **`getContent()` is server-only** (uses `node:fs`). Never import it in a
  `"use client"` file.
- **⚠ THE ONE CSS RULE THAT WOULD HAVE PREVENTED SIX BUGS: scope any component
  rule styling an element the `.unnyc-page` resets touch —
  `a`, `button`, `ul`, `ol` — with `.unnyc-page`.** The sixth instance was
  MARGINS, not color: `.unnyc-page ul { margin: 0 }` silently zeroed a
  single-class list rule on the homepage journey and parked the CTA button on
  top of the list. All the resets are TWO-part selectors — `.unnyc-page a { color:
  inherit }` and `.unnyc-page button { border: none; background: none }` are
  (0,1,1) — so a single-class component rule (0,1,0) LOSES in the same layer.
  Five collisions, all this shape: navy-on-navy sign-form tabs; endorser chips
  rendering as bare text; rail links all navy with the muted/active distinction
  invisible; `:hover` (0,3,0) out-specifying `--active` (0,2,0) and repainting the
  SELECTED chip dark-on-dark; and the same hover/active trap on the pagination
  buttons. Symptom to recognise: a control whose text colour is right and whose
  background/border silently isn't — or the reverse.
  **A sixth, different in kind:** `/principles` and `/crosswalk` both styled
  `.unnyc-principles__rail` in separate stylesheets at equal specificity. Next.js
  keeps both sheets in the DOM after a CLIENT-SIDE navigation, so source order won
  and the rail landed 400px inside the prose — only when arriving by nav click, a
  fresh load was always fine. Two stylesheets styling one class is a latent bug
  even when the rules are identical.
- **`.unnyc-page button` is a 0-1-1 reset that beats every single-class component
  rule.** `unnyc.css` resets `border: none; background: none` on every button under
  `.unnyc-page`. A component rule like `.unnyc-cmp-form__tab--active` is 0-1-0, so
  the reset wins on specificity. On 2026-08-14 that made the sign-form's
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
- **Contain third-party z-indexes; don't escalate ours.** ⚠ The code this lesson came
  from is GONE (deleted with the Leaflet map, 2026-09-10) — kept because the lesson is
  the reusable part and the next embedded widget will need it. Leaflet shipped panes at
  400-700, controls at 800 and `.leaflet-top`/`.leaflet-bottom` at 1000; the nav is 50,
  so the map painted over the header until `.unnyc-map-wrapper` got
  `isolation: isolate`, which confined that ordering to one box. Raising the nav's
  z-index would have worked until the next widget. There is nothing to contain today:
  the current map is our own inline SVG with no z-index of its own.
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
- **⚠ WHEN A TWO-COLUMN GRID COLLAPSES TO ONE, IT STACKS IN DOM ORDER — CHECK
  WHERE THE SECOND CHILD LANDS.** `/campaign/sign` is letter-left/form-right,
  both starting at the top, and below 899px it became one column. The form is
  the second DOM child, so it stacked under a letter that is ~4,400px tall on a
  phone: "Add your name" sat at **5,226px of a 6,505px document — 80% down**,
  making the page's entire purpose the last thing a phone reader could reach.
  Nobody caught it because at desktop width it is 16-21% down and obviously
  fine. Fixed with `order: -1` inside the existing breakpoint (see the long
  comment in `sign.css`, which also records the tab-order trade-off and names
  the structural alternative). **The general check: for every responsive grid,
  measure where each child ends up AFTER the collapse, not just that it fits.**
- **⚠ EXTRACTING SHARED CSS DE-DUPLICATES THE RULES AND SILENTLY MERGES THEIR
  ASSUMPTIONS ABOUT CONTEXT.** `world-map.css` was lifted out of `start.css` so
  both routes could reach it — correct, and it fixed a real bug. But those rules
  were written for `/start`'s **light** `--wg-surface-warm` page, and the
  homepage section behind the same component is **dark**, so `--wg-brand` navy
  text and a `--wg-warm-gray` border became low-contrast text and a stray light
  bar on `/`. One owner per class is still right; the missing step is checking
  what each consumer's background is. Fix it with page-scoped overrides in the
  consumer's own stylesheet, never by forking the shared rules.
  ⚠ **IT TOOK THREE PASSES TO FINISH, AND THE PATTERN IN THE MISSES IS THE
  LESSON.** #88 fixed what was *visible* — the marker rows (`--wg-brand` at
  **1.21:1**) and the catalogue *summary*. The 13 catalogue rows behind that
  closed `<details>` stayed at **1.35:1** for four more days, because **a closed
  disclosure hides its own defect**: nobody opens it on the page where it is
  broken, so "it looks fine" survives every check that isn't deliberate. And the
  map **credit line** — four lines of small grey type that look deliberate when
  they are unreadable — sat at **1.84:1** on production until 2026-09-14, which
  matters extra because it is the **CC BY attribution**, and a credit nobody can
  read is not a credit. **Enumerate every element the shared sheet colours, then
  check each against the consumer's real background — don't check what you happen
  to see.**
- **next/image `fill` writes position/inset/width/height as INLINE styles**, so a
  class cannot override them. To inset or shrink a filled image, use `transform`
  (see `.unnyc-pr-path__image--logo`) — not `padding`, `inset` or `width`.
- **⚠ A CONTENT FIELD THAT CARRIES HTML IS NOT INTERCHANGEABLE WITH ONE THAT
  DOESN'T, and nothing in the build says so.** `content/sign.md`'s `title` marks
  its underlined phrase with a `<span>`, the same convention `home.md` and
  `principles.md` use. `src/app/page.js` passed that title straight into
  `UnnycHomeStoryscroller`'s `headline` prop, which renders **plain text** — so
  React escaped the markup and the live homepage showed readers the literal
  string `<span>Endorse</span>`. Green build, green lint, correct-looking JSX.
  To check: `curl` the page and grep for `&lt;span&gt;`. The fix is not to
  dangerouslySetInnerHTML the prop — it is to pass the section its OWN headline.
  Same family as the two rules below; reading the JSX will not show you any of
  them.
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
- **⚠ THERE ARE NO CASCADE LAYERS, AND `@layer` MUST NEVER COME BACK
  (removed 2026-09-19).** An engine older than ~March 2022 discards everything
  inside the at-rule; 86% of this site's CSS was in one, so those browsers got
  the site with no stylesheet at all. **`lint:css` check 1 fails the build on
  `@layer`/`@container`/`@scope`**, and check 3 warns on anything else above the
  **Chrome 80 / Safari 13.1** floor. Full incident in `scripts/validate-css.mjs`.
  ⚠ Two relationships the layers used to guarantee are now held by
  **specificity**, and both broke when the wrappers came out:
  the nav/footer wordmark and the nav CTA need the component root
  (`.unnyc-page .unnyc-nav .unnyc-nav__link`, 0-3-0) because unnyc.css has its
  own **0-2-0** rules for `.unnyc-footer__logo` and `.unnyc-btn` and is imported
  later — a tie goes to unnyc.css. And base.css's reset, once the lowest layer,
  is now ordinary CSS: `a:hover { text-decoration: underline }` is **(0,1,1)**
  and beats a single-class rule, which is a **`:hover` regression a
  rendered-output diff structurally cannot see**. `lint:css` check 2 watches
  that one.
- **⚠ `src/app/flex-gap-fallback.css` IS GENERATED — `npm run gen:flex-gap`.**
  Flex `gap` does nothing before Safari 14.1 / Chrome 84, and this site has 97
  flex rules using it, so the generator writes margin fallbacks scoped under
  `.no-flexgap`. **`lint:css` check 4 fails the build if a flex+gap rule has no
  fallback**, so the file cannot go stale. Two rules the generator learned the
  hard way: a comma selector needs the child combinator on EVERY part (`a, b >
  * + *` applies it to `b` only), and every rule must state ALL FOUR margins
  including the zeroes, or a media query that flips direction leaves the other
  axis set by the base rule (the mobile nav drawer kept a 1.75rem indent).
- **⚠ NEVER KEEP A FEATURE PROBE OUT OF THE WAY BY ZEROING THE DIMENSION YOU
  MEASURE.** The flex-gap probe in `layout.js` had `height: 0` to stay out of
  the layout — which clamps `scrollHeight` to 0, so it reported "no flex gap" in
  EVERY browser, `.no-flexgap` went on universally, and every gap applied twice
  (nav links 56px apart instead of 28px). Position it off-screen instead. Caught
  in a browser; nothing else would have.
- **⚠ "THE API IS ALIVE" IS NOT "THE API WILL TELL ME WHAT I NEED".** The
  storyscrollers hide `[data-reveal]` in JS and reveal on IntersectionObserver,
  so an engine with a non-firing observer leaves the page blank. The first
  backstop keyed off "has the observer ever fired" — but IO reports on every
  element it observes, including off-screen ones, so that flag goes true in
  exactly the renderers the backstop exists for. It shipped and did nothing.
  It now gates on `document.visibilityState`: nobody is watching a fade on a
  document that is not being displayed. Don't "simplify" it back.
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
- **Fonts are SELF-HOSTED by `next/font`** (`src/app/fonts.js`), not fetched from
  Google. The `@import` that used to head `unnyc.css` was the first line of a
  render-blocking stylesheet and chained two cold third-party connections before
  text could paint, while asking for Inter 300 and a DM Serif italic that appear
  nowhere in the CSS. ⚠ **The token override in `unnyc.css` is still load-bearing, but its
  MECHANISM CHANGED on 2026-09-19.** It used to win by being the file's only
  unlayered rule (unlayered beats every layer). With the layers gone it is
  `:root` vs @wegovnyc/design-tokens' `:root` — equal specificity, so **source
  order decides**, and it wins only because `layout.js` imports `base.css`
  (which `@import`s the tokens) *before* `unnyc.css`. **That import order is now
  what keeps the fonts loading.** Verified after the change: `--wg-font-display`
  resolves to "DM Serif Display", `--wg-font-body` to "Inter", both loaded. ⚠ Also note this makes a BUILD
  depend on fonts.googleapis being reachable; that is a deliberate trade (it
  replaces a per-visitor dependency with a per-build one), reasoned through in
  `fonts.js`.
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
- **Two routes share `content/principles.md`, and `metaKey` is what keeps them
  apart.** `/principles` reads `meta:`; `/principles/document` reads
  `metaDocument:` because the route entry names it. Everything outward-facing —
  title, description, preview image, breadcrumb label — goes through
  `routeMeta(doc, route)`, so a route cannot end up with its own title and its
  sibling's preview. ⚠ `routeMeta` **throws** on a `metaKey` that isn't in the
  file; a typo would otherwise fall through to `undefined` and ship a page with
  no title. The document page's `<h1>` still matches `/principles` on purpose —
  on a printed sheet the subject is the title.
- **`ROUTES` in `src/lib/seo.js` is the one list of this site's URLs.** A new
  route MUST be added there or the build throws — `pageMetadata()` rejects a
  path it doesn't know, deliberately, because `sitemap.js` reads the same list.
  A canonical the sitemap never mentions (or the reverse) is a contradiction a
  crawler resolves for us. Redirects are NOT routes and must never be added:
  `/start/principles` 308s to `/principles/document`, and three legacy hostnames
  fold into this one. Verified at build: the set of sitemap URLs equals the set
  of canonicals in the rendered HTML.
  `robots.txt` and `sitemap.xml` are generated (`src/app/robots.js`,
  `src/app/sitemap.js`) — both 404'd until 2026-08-20. Nothing is `Disallow`ed
  on purpose: `Disallow` blocks the fetch, so a crawler never reads the
  `noindex` it was sent to obey.
- **`/resources#open-data` is the human way in to the datasets** —
  `PrimerOpenData.js`, and **every row is DERIVED from `datasetIndex()`**: name,
  description, record count, licence and URL all come from the same envelope
  `/data/index.json` serves. Only the section's title, lede and note are copy
  (`openData` in `content/resources.md`). ⚠ Never type a dataset or a count into
  that markdown — a count in prose goes stale the next time a snapshot is
  refreshed, which is why the endorser directory derives its own.
  It shows "compiled by this campaign" vs "credit <source>" per row, inferred
  from each dataset's own attribution string, because both are CC BY 4.0 and the
  licence alone would not tell a reuser whose name goes on it.
  ⚠ The on-page hrefs are made **origin-relative** from the envelope's absolute
  URL: absolute hrefs would send anyone on a preview deployment or a dev server
  to production's copy of the file rather than the one they are testing.
  This also took /resources' section subnav to **4 items**, so it is no longer
  one removal away from vanishing at the `items.length < 3` guard.
- **The site publishes four datasets** at `/data/*.json`, catalogued at
  `/data/index.json`, described in a generated `/llms.txt` — all built by
  `src/lib/datasets.js` from the SAME `content/*` files the pages render, never
  copies, and prerendered at build. ⚠ **Slugs are published addresses**: renaming
  one breaks whatever cited it, so add rather than rename.
  ⚠ **Each payload states its OWN licence and attribution.** ONE of the four is
  ours — the endorser transcription (CC BY 4.0, owner decision 2026-08-21). The
  CTFG, GovOSS **and OSPO** slices are redistributed and say *credit them, not
  this site*. Do not factor these into one shared constant — CTFG's was
  CC BY-NC-SA six weeks ago and the OSPO list is CC0, not CC BY at all.
  ⚠ **THE OSPO DIRECTORY WAS LISTED HERE AS OURS UNTIL 2026-09-14 AND IT NEVER
  WAS.** All 18 entries are the **FLOSS-PSO Network**'s list
  (`floss-pso.network`, run by the OSPO Alliance), released **CC0 1.0** —
  verified name-for-name against their page. `content/resources.md` had recorded
  their `sourceUrl` the whole time and only `/resources` surfaced it, so the map
  credited "this site" while the page below it credited them. **Only the
  `lat`/`lng` and `locationBasis` are ours.** ⚠ CC0 requires NO attribution, so
  nothing enforces this credit — it is a decision, which makes it the easiest of
  the four to lose in a future edit.
  ⚠ **`Dataset` JSON-LD is only for data THIS SITE MADE — now just `/principles`'
  endorser payload.** `/resources` emitted one for the OSPO directory and it was
  removed 2026-09-14: `datasetLd` writes `creator: this site`, which would
  nominate us as the thing to cite for someone else's CC0 list. The OSPO
  `ItemList` stays — describing what the PAGE shows is a different claim from
  who made the underlying list.
- **JSON-LD lives in `src/lib/structured-data.js`**, rendered by
  `src/components/unnyc/StructuredData.js`, and is built from the content files
  so it cannot drift from the visible page. ⚠ **Mark up only what is
  server-rendered.** The `ItemList`s claim 150 endorsers and 18 OSPOs because
  all of them are in the HTML — checked, not assumed. If either list ever starts
  rendering one page of results server-side, its markup has to shrink to match.
  ⚠ `StructuredData` escapes `<`, and that is load-bearing: `JSON.stringify`
  will happily emit a literal `</script>` from inside a string and close the tag
  early, and some of this data is a transcription of a third-party page.
  ⚠ No dates and no OSPO coordinates, both deliberate — there is no real
  per-page date anywhere in the repo, and half the OSPO coordinates are
  `locationBasis: 'hq'`, so `GeoCoordinates` would overstate their precision.
- **Link-preview images are GENERATED, one per route** —
  `src/app/og/[slug]/route.js` + `src/lib/og-image.js`, prerendered to
  `/og/<slug>.png` at build from `ROUTES` (so a new route gets its preview,
  canonical and sitemap entry together). Headline is the page's own
  `meta.ogTitle` minus the "— UNNYC" affix; nothing to license, nothing to
  re-cut when copy changes. ⚠ **The font is a vendored TTF**
  (`src/assets/fonts/`, OFL, in CREDITS.md) because Satori — what `next/og`
  draws with — reads ttf/otf/woff and **cannot read woff2**, the only format
  Google Fonts serves a modern browser. Asking its CSS API for an old format
  with an ancient user-agent gets you EOT, which Satori also can't read.
  ⚠ `twitter.card` must stay `summary_large_image`: Next derives the twitter
  tags from openGraph but defaults the card to `summary`, which crops a
  1200x630 image to a square thumbnail.
- **Route metadata goes through `pageMetadata(meta, path)`** in
  `src/lib/seo.js` (added 2026-08-20), which is what sets each page's
  `alternates.canonical` and `openGraph.url` from ONE hand-written path.
  ⚠ It also restates `siteName`/`locale`, which are NOT inherited: Next merges
  metadata SHALLOWLY, so a page's `openGraph` REPLACES `layout.js`'s rather than
  extending it. The site ran with no `og:site_name` on any page while the value
  sat in `layout.js` looking authoritative.
  `metadataBase` in `layout.js` emits nothing by itself — it only resolves those
  relative paths, which is why the site ran for weeks with the base URL set and
  **no canonical tag on any route**: the field was simply absent from the
  metadata block every page had copied from its neighbour. A new route that
  hand-rolls `generateMetadata` is how the next missing canonical happens.
  ⚠ `/campaign/endorse/document` is the ONE deliberate exception — it is
  `noindex`, and a self-referencing canonical on a noindex page tells a crawler
  two contradictory things, so it keeps a hand-written block with a comment
  saying exactly that. Don't "fix" it.
- **The site-wide email capture is the FOURTH Payload write path** —
  `UpdatesBar.js`, rendered **IN THE FLOW between `<main>` and the footer** in
  `layout.js` (the ordering there is what puts it there), posting to
  **`campaign-signups`**: the same collection the "get updates" checkbox on
  `/campaign/sign` has always used, so no CMS change was needed. `source` carries
  the pathname the reader was on, and the sign-form path sends `/campaign`, so
  the two are distinguishable in the admin.
  - ⚠ **It was a FIXED OVERLAY for one commit, and moving it in-flow deleted most
    of it.** The overlay needed a scroll listener, an 8s dwell floor, a 25s
    backstop, a slide-in keyframe, a `prefers-reduced-motion` exception, a
    dismiss button, two localStorage keys, an Escape handler and a mobile height
    budget — because a thing that covers the page has to earn its place and then
    get out of the way. In the flow it covers nothing, so all of that is gone.
    Don't reintroduce any of it piecemeal.
  - ⚠ **No reveal animation and no delay, deliberately.** In-flow content that
    appears after mount shifts the page under the reader — a CLS penalty, the
    mirror image of the overlay's interstitial problem. It renders immediately,
    server-side included, so there is no shift and no JS needed to see it.
  - ⚠ **No localStorage.** In-flow there is nothing to nag, so nothing to
    remember; reading storage to hide it would also make the server and client
    render different things (a hydration mismatch) for no reader benefit.
    Success state lasts the session.
  - **Suppressed on five routes** (`SUPPRESSED` in the component): both campaign
    forms and `/contact` already take an email — asking twice on one page reads
    as a broken site — and both printables are meant to reach paper. The
    `@media print` rule matters MORE now, not less: in the flow this would
    otherwise print at the end of every other page.
  - ⚠ **Every selector in its CSS is scoped with `.unnyc-page`, and that is now
    the ONLY thing holding it.** It renders inside `.unnyc-page`, so
    `.unnyc-page button { border: none; background: none }` (0,1,1) beats any
    single-class rule. It used to sit in `@layer site` and win by layer order;
    the layers were removed 2026-09-19.
  - Background is `--wg-brand`, one step lighter than the footer's
    `--wg-brand-deep`, with the header's orange rule repeated on top — so the two
    dark bands read as distinct rather than as one over-tall footer.
  - **The copy names the sender as `opensource.nyc`**, not WeGovNYC and Sarapis
    (owner decision 2026-08-21), even though it is their Payload install that
    receives the address. The footer names both organizations on every page, so
    the reader can still find out who is behind it. ⚠ Still no promise of
    frequency or unsubscribe: neither exists, and either would be a build rather
    than a wording change.
  - ⚠ **Cannot be tested from localhost** — that origin is not in Payload's CORS
    allowlist, so the POST is blocked and it shows its generic error. CORS from
    the live origin IS verified: an intentionally invalid POST returns Payload's
    400 "invalid: Email", which proves the request reaches the server without
    creating a record. Do that rather than submitting a real address.
- **The contact form is the third Payload write path** (`/contact`, added
  2026-08-07). It posts to `contact-submissions` — a collection that already
  existed for sarapis.org, with exactly the `name`/`email`/`message` fields
  needed, so **no CMS change was required**. Two traps: its `website` field is a
  **honeypot** that makes Payload reject the submission, so `.unnyc-cmp-form__hp`
  must stay `display:none`; and the collection is **not brand-scoped** (no
  `sites` field), so UNNYC messages land in the same bucket as sarapis.org's —
  `ContactForm.js` appends a "Sent from un.opensource.nyc" line to the message
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
- **THE LEAFLET MAP IS DELETED (2026-09-10, owner's decision).** `PrimerMapInner.js`
  (361 lines), `PrimerMovementNow.js` (122 lines), `leaflet@^1.9.4`, 163 lines of
  now-dead CSS in `unnyc.css` (`.unnyc-map-*`, the `.leaflet-*` popup overrides, the
  `.leaflet-interactive:focus-visible` ring) and `.unnyc-pr-map__source` in `primer.css`
  are all gone. `UnnycWorldMap` is the site's only map. This bullet has now been wrong in
  BOTH directions — it once said "don't delete these as unused", then "kept deliberately"
  — so: **there is nothing to keep or restore; the history is in git.** The pan/zoom and
  per-country keyboard access it had are genuinely lost, and bringing it back would bring
  the CARTO watermark with it.
- **`UnnycEndorserDirectory.js` IS DELETED (2026-09-14, owner's call)** — the
  component, its 27 `unnyc-endorsers__` rules in `primer.css`, and the stale
  references in `UnnycPrinciplesStoryscroller.js`. Orphanhood was re-verified
  before deleting rather than taken from these docs: zero importers.
  ⚠ **`principles.css` had NO `.unnyc-endorsers__` rule** — only a comment saying
  why that page doesn't reuse the component. Earlier notes here counted "1 rule in
  principles.css"; that was wrong, and the comment was reworded instead.
  `/principles` renders its own directory markup and always did.
  ⚠ One casualty worth knowing: `endorsers.lede` in `content/principles.md` was
  rendered ONLY by this component, so deleting it leaves that key as dead copy —
  which is how we found that the "Hundreds over a countable 150" issue had not
  been on the page since 2026-09-10. Kept, wording corrected; see the note there.
- **Glossary definitions live once**, in `content/start.md` under `concepts.terms`.
  `src/lib/content.js` reads them so a `[term](gloss:slug)` link anywhere gets a
  hover definition. The old `GlossaryTerm` React component was deleted; re-adding a
  component-based tooltip means parsing HTML→React, not just re-importing data.
- `src/data/unnyc-primer.js` is **superseded** by `content/*.md` and **confirmed
  orphaned** — zero code imports as of 2026-08-04 (the only `@/data` import
  anywhere is `openSource`; the remaining "unnyc-primer" hits are JSDoc comments
  and docs prose). Kept as a migration reference; safe to delete.
- **The eight Principles ARE single-sourced** as of 2026-08-06 —
  `content/principles.md`, reshaped by `principlesFlat()`,
  `principlesDeclaration()` and `principlesResolve()` in `src/lib/content.js`.
  There were three hand-maintained copies and they had drifted (the letter said
  "Foster inclusion" and a bare "RISE"). Each principle carries every surface form
  it needs, EXPLICITLY — variants on purpose, which is a different thing from the
  drift they replaced:

  | field | who reads it |
  |---|---|
  | `title` | the `/principles` grid |
  | `titleCanonical` | the UN's own name — letter, endorsement declaration, detail headings, both rails |
  | `desc` | full description |
  | `descShort` | the letter's numbered list |
  | `descCity` | NYC-facing, the endorsement declaration |
  | `titleDocument` / `descDocument` | `/principles/document` ONLY (it was rewritten into the imperative on 2026-08-14 and retitles four principles; without these that edit would have rewritten the grid, the letter and the declaration too) |
  | `body` | the line shown when a principle renders as a full-width lead card — #1 and #2 have one |

  **GROUPINGS ARE SLUG REFERENCES, never rearrangements of `groups`.** That array
  holds the principle OBJECTS and is FLATTENED by `principlesFlat()` for the letter
  and by `/principles` for its detail sections and rail — so moving an object
  between groups is how a principle silently vanishes from a surface that only
  flattens. `groupsGrid` drives `/principles` + the declaration; `groupsDocument`
  drives `/principles/document`. `principlesResolve()` **throws** on an unknown
  slug, because `lint:content` does not check these refs and a typo would otherwise
  drop a principle from a printed page with a green build.

  Change the markdown; nothing else holds a copy.
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
| `old-unnyc.wegov.nyc` | The original Vite "UN meets NYC" hub. Live, untouched — **KEPT, owner's decision 2026-09-14.** Nothing depends on it (its one unique asset, the UN-system guide, is at `/resources/guide`, and `wegov.nyc/unnyc/guide` redirects there), so retiring it was offered and declined. Don't propose it again as cleanup. |
| Vault workspace | `~/vault/workspaces/unnyc.md` (Hub reads this) |
