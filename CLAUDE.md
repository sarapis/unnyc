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
On 2026-08-06 that cost real effort three times in one afternoon: files from a
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

## The CTFG map layer (MERGED and live as of `7faaf97`, 2026-08-08)

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

### Coverage audit vs CTFG (2026-08-07)
Every project/org/resource/OSPO on this site was cross-checked against the full CTFG directory:
**61 entities — 20 have CTFG profiles, 41 don't** (30 civic/gov-tech, 11 general FOSS). Largest gap:
**17 of 18 OSPOs** in `/resources` are absent from CTFG — this site's OSPO directory is the better
source. Also: `/success` says "Sovereign Tech **Fund**"; it renamed to **Agency** in 2025.
⚠️ Method note if you redo it: match on homepage domain, but **exclude shared hosts**
(`un.org`, `nyc.gov`, `github.com`, `ec.europa.eu`) — a domain hit there proves nothing and produced
several false positives on the first pass.

## Non-obvious things that will bite you

- **`getContent()` must be called inside the component or `generateMetadata`, not
  at module scope.** The markdown isn't a module dependency, so a module-level call
  is evaluated once per dev-server process and edits won't appear until a restart.
  This was a real bug; don't "optimise" it back.
- **`getContent()` is server-only** (uses `node:fs`). Never import it in a
  `"use client"` file.
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
  the latter until 2026-08-08 — a class only the MARKETING site has — so
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
  2026-08-06). It posts to `contact-submissions` — a collection that already
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
