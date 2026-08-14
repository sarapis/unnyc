# Session continuation prompt

Paste the block below into a new session. Everything above the line is context for
whoever is maintaining this file.

**Last updated 2026-08-14, at the end of a sixteen-PR day.** This file drifted three times
on 2026-08-11 alone, so it is now written to survive a busy day: the "what changed"
section records *shapes and lessons*, not a PR-by-PR log. **Rewrite it whenever
something lands.** A continuation prompt describing a state that no longer exists
is worse than none, because it is read as current — and a wrong *diagnosis* left in
it is worse still, because the next session starts by chasing it.

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

Both site repos are clean and deployed as of 2026-08-14, with **no open PRs**.
`origin/working` still exists on the remote — it is the branch behind Olivia's
closed dark-mode PR, hers to remove, not ours.

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
3. **Olivia Croteau pushes PRs from a fork** — ten merged, one closed, **none open**. `git fetch`
   and check open PRs **before** a broad edit. A rewrite once landed on top of her
   open PR and had to be reconciled by hand.
4. **The CMS at next.sarapis.org is production for three brands.** The user
   approves go-live. Schema changes need out-of-band SQL.
5. **`localhost` is not in Payload's CORS allowlist**, so every form on this site
   fails locally with a generic error. That is expected — form submission can only
   be tested from the deployed origin.

## How to verify anything here

This project keeps producing bugs that fail *silently* and look like "no data yet"
or "working fine". A `catch` returning `[]`, a `default:` returning an empty list,
a `var()` falling back, a missing CORS header, an unset CSS variable, a dead
frontmatter key, a reset out-specifying a component. So:

- **Test through the real UI, not the API.** An endpoint returned 200 to `curl`
  for two days while every browser submission was blocked by CORS.
- **Read the rendered DOM, not the source you just wrote.** Three paragraphs in the
  open letter were being swallowed into a `<li>` for weeks; the markdown looked
  right and the build was clean. `curl` the page and check which tag wraps the text.
- **Selector matching is ground truth; computed styles in the preview pane are
  not.** The Browser pane reports `visibilityState: hidden` and never paints, so it
  runs no animation frames and does not flush a style recalc after React changes a
  class. Post-interaction `getComputedStyle` reads come back **stale** — they told
  me an active tab was orange when it wasn't, and that a subnav click didn't scroll
  when on production it does. `el.matches(selector)` and the deployed CSS text are
  reliable; ask the user to eyeball anything that only manifests on interaction.
- **Poll for a string unique to the NEW version when waiting on a deploy.** I once
  polled for "The undersigned", which also appears in the copy being replaced, so
  the loop exited instantly and I "verified" the old page and reported nine false
  failures.
- **Test a guard by trying to defeat it.** Every `git commit` case in the staging
  hook silently passed at first — the regex ate the only space before the flag.
- **A green build is not a working page.** A Vercel project with no framework
  preset builds "successfully" and 404s every route.

## What changed most recently (2026-08-11 → 08-14)

Twelve PRs. The shape of the site changed; the details are in `CLAUDE.md` under
"Page structure as of 2026-08-14".

- **`/principles` is now a top-level page.** It pairs the plain-English grid that
  was `/start#principles` — every icon+title is a jump link — with the
  per-principle NYC argument that was the *body of `/crosswalk`*. That prose
  **moved, it is not duplicated**: this repo already spent a day untangling three
  drifted copies of the principles. The jump target is a new `slug` on each
  principle in `content/principles.md`, which is also its `## slug` section, so the
  id is defined once. The printable one-pager moved `/start/principles` →
  `/principles/document` behind a 308.
- **`/crosswalk` is six numbered reasons to adopt open source**, ~1,250 words,
  titled "New York Rents the Software It Should Own". Its dollar claims link to
  **Databook.NYC contract records** (SurveyMonkey $210k/renewal, the $57M citywide
  Microsoft agreement) — keep new claims checkable that way. **Every figure on the
  page now links to a record** (fixed 2026-08-14, see below).
- **The open letter is addressed to OTI alone** and built on three asks: endorse
  the Principles, establish an OSPO, evaluate an open source alternative in every
  technology contract. **All Barcelona and first-in-the-Americas framing is gone
  from it.**
- **Nav is five items**: A Global Movement · UN Principles · Open Source for NYC ·
  Case Studies · Resources. `/start` is reordered to vocabulary → world going open
  source → UN's timeline, and its subnav is now at exactly **3 items — the boundary
  of `UnnycSectionNav`'s `items.length < 3` guard.** Remove one more section and
  the bar silently disappears.
- **The endorsing-organizations list moved** from under `/start`'s map to the
  bottom of `/principles` (`#endorsers`), where the things being endorsed are.
- **`/success` lost the Tokyo case**; Olivia added Munich. The grid is retitled
  "Recent Government Open Source Successes".
- **`/resources/guide`** is the long-form UN-system briefing, ported from the
  retired hub and diffed word-for-word against the original.
- **Accessibility: all 73 undersized card links now clear 24px.** Four rules
  (`.unnyc-pr-ospo__links a`, `.unnyc-pr-contact__link`, `.unnyc-pr-concept__link`,
  `.unnyc-pr-case__link`) were 22px block targets; each gained `padding: 4px 0`
  and they cross-reference each other, so a new card link has a precedent to
  copy. Inline prose links, the footer credit line and Leaflet's attribution are
  exempt under WCAG 2.5.8 and untouched.
- **The fourth homepage card renders its favicon as a logo, not a photo**
  (`imageStyle: logo` in `content/home.md`): contained and centred on a tint
  instead of a 100x100 square cover-cropped into a 560x160 band. **Confirmed as
  the final treatment, not a placeholder** — see "Things that are true".
- **Four CSS bugs fixed**, each with a general lesson now in `CLAUDE.md`: a global
  button reset out-specifying component rules (navy-on-navy tabs), `--outline` on a
  light background (an invisible button that read as a layout bug), Leaflet's
  z-indexes painting over the nav, and a 24px hero headline on mobile.

## Open work

Nothing is blocking. In rough order of value:

1. **Decide the CTFG directory question.** The map layer is live, so the open
   question about linking into the Civic Tech Field Guide while it is de-indexed
   pre-launch is current, not deferred. Hub task `168a959d`.
2. **`/crosswalk` reason 1 says fifteen agencies hold their own Microsoft Premier
   Support contracts "today".** The count is right and conservative — Databook
   shows **17** distinct agencies — but almost every one of those contracts ended
   between 2022 and 2024, so "today" is the one word on the page that the records
   do not support. The underlying point (fragmented buying) is solid; only the
   tense is loose. A one-word fix, left alone because it is a copy call.
3. **The roadmap doc needs a named ask.** `sarapis/open-source-by-default`
   explains a sequence but never says who should do what next.
4. **Watch for the first real endorsement.** `published` defaults to false, so a
   new signature needs ticking in the Payload admin before it reaches the wall.
5. **A shared component package.** Token *values* are unified across wegov.nyc and
   this site; the *implementations* — button, card, nav — are still separate. Hub
   task `7656df36` (Backburner).
6. **Exposed keys in `wegovnyc_front`'s git history** — Hub task `51968fc0`. Lower
   urgency after triage, but the purge needs coordinating because a fork keeps the
   blobs reachable.

*(Struck 2026-08-14, last thing in the day: **the two unsourced `/crosswalk`
figures**, replaced with the two citywide IT purchasing contracts they were
almost certainly a garbled memory of — SHI $1.2B and CDW $800M, exactly $2B
together, each linked to its Databook record. The same sentence in the **open
letter** (`content/sign.md`) carried the identical claim and was fixed with it;
the briefing had flagged only `/crosswalk`, so check both surfaces for any figure
you change. Also struck: **the fourth homepage card**, confirmed as a deliberate
logo treatment rather than a photo awaiting purchase. Struck earlier the same
day: Olivia's PR #12 merged — three org names aligned to their CTFG listings, with two of the three redirected to
`content/principles.md` because the endorsers list had moved; her PR #15
(site-wide dark mode) CLOSED as a product decision, with the reasoning recorded
on the PR so it survives the branch; all 73 undersized card links raised from
22px to 30px across four rules; and the favicon card given a deliberate logo
treatment. Struck earlier the same day: PR #8; the `/campaign/sign` hydration
mismatch — which was invalid HTML nesting, NOT the endorser wall's Payload fetch as
this file once guessed; the `~90` baselined colour literals in wegov.nyc's
`globals.css`; the `#3f8f7b` CTFG teal literal; repointing `wegov.nyc/unnyc/guide`
at the ported article.)*

## Things that are true and easy to get wrong

- `old-unnyc.wegov.nyc` is **no longer load-bearing.** Its one unique asset, the
  UN-system guide, is now at `/resources/guide`, and `wegov.nyc/unnyc/guide`
  redirects straight there. It was never quite as load-bearing as the docs claimed
  either — that redirect always pointed at the *campaign* site, never at the old
  host. **The old site can be retired whenever someone wants it gone.**
- **Never write a colour literal or read `--db-*`** in a CSS rule — both are
  invisible to the brand variant. Note `--wg-accent-warm` resolves to `#d4a843` at
  `:root` but `#f60` inside `.wg-unnyc`: that is the variant working, not a stale
  install.
- **`.unnyc-page button` (0-1-1) beats any single-class component rule** in the same
  layer. Scope styled buttons with `.unnyc-page`.
- **Never write `*/` inside a CSS comment.** It closes the comment and Turbopack
  fails with a confusing parse error.
- **`getContent()` must be called inside the component or `generateMetadata`,**
  never at module scope — and a frontmatter key named `sections` is silently
  overwritten by the parsed body.
- **CSS layer order `reset < components < unnyc < site`** must be preserved here.
  wegov.nyc's is different.
- **A paragraph written directly under a bullet with no blank line becomes part of
  that bullet.** Markdown lazy-continuation. It shipped three times in the open
  letter because the build is clean, `lint:content` passes and the page looks
  plausible. Blank line between a list and the paragraph after it, always. To
  check: `curl` the page and look at which tag wraps the text.
