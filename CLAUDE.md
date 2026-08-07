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
