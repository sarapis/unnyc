# Session continuation prompt

Paste the block below into a new session. Everything above the line is context for
whoever is maintaining this file.

**Last updated 2026-08-10.** The previous version described 2026-08-06, when the
campaign had just consolidated its forms. Nearly all of it had shipped. **Rewrite
this whenever something lands** — a continuation prompt that describes a state
that no longer exists is worse than none, because it is read as current.

---

I'm continuing work on the **UNNYC campaign site**. Start by querying the Hub
(`get_workspace_detail("unnyc")`, `list_tasks(workspace="unnyc")`,
`search_knowledge(topic="wegovnyc-design-system")`) and reading
`~/vault/workspaces/unnyc.md`, then this repo's `CLAUDE.md`, `README.md` and
`docs/EDITING-CONTENT.md`.

## The repos

| Repo | Local | What it is |
|---|---|---|
| `sarapis/unnyc` | `~/Antigravity/unnyc` | **This** campaign site → https://unnyc.wegov.nyc |
| `sarapis/open-source-by-default` | `~/Antigravity/open-source-by-default` | **PRIVATE.** Draft roadmap doc, moved out of this repo |
| `wegovnyc/wegovnyc_front` | `~/Antigravity/WeGovMarketing` | The marketing site → https://wegov.nyc |
| `sarapis/wegovnyc-design-tokens` | `~/Antigravity/wegovnyc-design-tokens` | The design system both sites install |
| `devinbalkind/sarapis-website` | `~/Antigravity/Sarapis/site` | The Payload CMS → https://next.sarapis.org |

All clean and deployed as of 2026-08-10.

## Read this part before you touch anything

1. **You are probably not the only session in this checkout.** On 2026-08-07 that
   cost real effort three times in an afternoon: another session's files appeared
   **staged** inside a commit being written, and a second session committed on top
   of unpushed work so the two could not ship separately. **Never `git add -A`,
   `git add .`, or `git commit -a`** — a PreToolUse hook now refuses them. Stage by
   name, then read `git diff --cached --name-only` before every commit. For
   parallel work use a worktree (`CLAUDE.md` lists the four gitignored things a new
   worktree does not inherit — `node_modules` at 350 MB is the main one).
2. **Pushing `main` deploys to production.** No gate, no preview step.
3. **Olivia Croteau pushes PRs from a fork** — seven merged. `git fetch` and check
   open PRs **before** a broad edit. A rewrite once landed on top of her open PR
   and had to be reconciled by hand.
4. **The CMS at next.sarapis.org is production for three brands.** The user
   approves go-live. Schema changes need out-of-band SQL.
5. **`localhost` is not in Payload's CORS allowlist**, so every form on this site
   fails locally with a generic error. That is expected — form submission can only
   be tested from the deployed origin.

## How to verify anything here

This project keeps producing bugs that fail *silently* and look like "no data yet"
or "working fine". A `catch` returning `[]`, a `default:` returning an empty list,
a `var()` falling back, a missing CORS header, an unset CSS variable, a hook that
never loaded. So:

- **Test through the real UI, not the API.** An endpoint returned 200 to `curl`
  for two days while every browser submission was blocked by CORS.
- **Test a guard by trying to defeat it.** Every `git commit` case in the staging
  hook silently passed at first — the regex ate the only space before the flag.
  Two `wg-lint-tokens` bugs survived review the same way.
- **Prefer structural checks over `grep`.** In one session grep produced three
  confident wrong answers: matching across line-wrapped text, matching a word in a
  comment it had just written, and a `?cb=` wait-loop pattern that could never
  match. Query the DOM, the API, or `jq` instead.
- **A green build is not a working page.** A Vercel project with no framework
  preset builds "successfully" and 404s every route.
- **Re-verify dated claims before repeating them.** The roadmap draft was stamped
  three days early once.

## What changed most recently (2026-08-06 → 08-10)

- **Content rewrite**: 7,484 → 5,655 reader-visible words (−24%), interior pages
  re-pointed at the home page's performance/cost framing. "Pays billions" is now
  grounded in the Comptroller's *Monty Hall Contracts* finding.
- **New `/contact`** page and form → Payload `contact-submissions`. No CMS change
  was needed. Nothing emails you; messages sit in the admin.
- **Nav CTA is "Take Action"**; footer cut to logo + WeGovNYC/DatabookNYC/Sarapis
  + Contact + credit line.
- **Per-page section subnav** on /start, /success, /resources — deliberately not
  /crosswalk. Section offsets have one owner (`--pr-subnav-h`); do not add a
  competing rule.
- **`HeaderHeightVar` was querying `.site-header`**, a marketing-site class, so
  every hash jump had been overshooting by ~134px. Fixed.
- **Icons are one inline SVG set** (Lucide/ISC) and finally themeable; eight PNGs
  and 364 KB deleted.
- **All images go through `next/image`** (2,490 KB → 829 KB) and every one is
  licence-recorded in `public/images/CREDITS.md`.
- **CTFG map layer is MERGED and live** — the docs previously said it was held on
  a branch.
- **A content validator** (`npm run lint:content`) and a **PreToolUse hook** that
  refuses blanket git staging.

## Open work

Nothing is blocking. In rough order of value:

1. **Decide the CTFG directory question.** The layer is live now, so the open
   question about linking into the Civic Tech Field Guide while it is de-indexed
   pre-launch is current, not deferred.
2. **The roadmap doc needs a named ask.** `sarapis/open-source-by-default`
   explains a sequence but never says who should do what next. Its own *How this
   document grows* section lists five other gaps, the most valuable being a worked
   contract-expiry example.
3. **`/resources` is the only home path card without an image** — a favicon
   placeholder was removed rather than replaced.
4. **Watch for the first real endorsement.** `published` defaults to false, so a
   new signature needs ticking in the Payload admin before it reaches the wall.
5. **A shared component package.** Token *values* are unified across wegov.nyc and
   this site; the *implementations* — button, card, nav — are still separate.
6. **Exposed keys in `wegovnyc_front`'s git history** — Hub task `51968fc0`. Lower
   urgency after triage, but the purge needs coordinating because a fork keeps the
   blobs reachable.
7. **~90 baselined colour literals** in wegov.nyc's legacy `globals.css`.

## Things that are true and easy to get wrong

- `old-unnyc.wegov.nyc` is **load-bearing**: `wegov.nyc/unnyc/guide` redirects to
  `unnyc.wegov.nyc/resources`, and the only live copy of that article is on the
  old site.
- **Never write a colour literal or read `--db-*`** in a CSS rule — both are
  invisible to the brand variant.
- **Never write `*/` inside a CSS comment.** It closes the comment and Turbopack
  fails with a confusing parse error.
- **`getContent()` must be called inside the component or `generateMetadata`,**
  never at module scope.
- **CSS layer order `reset < components < unnyc < site`** must be preserved here.
  wegov.nyc's is different.
