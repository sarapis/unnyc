# UNNYC

The campaign to make **New York the first city in the Americas to endorse the
[UN Open Source Principles](https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles)**.

**Live: <https://unnyc.wegov.nyc>**

Built by [WeGov.NYC](https://wegov.nyc) and [Sarapis](https://sarapis.org). Not
affiliated with the United Nations or any government agency.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No `.env` is required for local development — `src/lib/api.js` defaults to the
live CMS. Copy `.env.example` to `.env.local` if you need to point elsewhere.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19
- **Leaflet** for the world map of governments advancing open source
- **CSS cascade layers**, no CSS framework, no build step beyond Next
- Deployed on **Vercel**

## Site structure

The site is a hub plus four reader paths. Each page also leads into the next in
this order, so it reads as a funnel *or* as a pick-your-entry-point.

| Route | Purpose |
|---|---|
| `/` | Hub — what UNNYC is, then four cards routing to the paths below |
| `/start` | "I'm new to government open source" — orientation, the movement, key concepts, case studies, the global map |
| `/start/principles` | The Eight Principles, standalone + printable |
| `/crosswalk` | "Why it matters to NYC" — the persuasive core |
| `/success` | "What success looks like" |
| `/campaign` | Chooser: sign the public letter, or formally endorse |
| `/campaign/sign` | The open letter + signature form + published endorser wall |
| `/campaign/endorse` | Formal organizational endorsement form |
| `/campaign/endorse/document` | Printable declaration for City officials |
| `/resources` | Reference directory |
| `/contact` | Contact form (name, email, message) — linked from the footer |

## Editing the words

**Every page's copy is one markdown file in [`content/`](content/).** Frontmatter
holds the structure (titles, card lists, the eight principles), the body holds the
prose. The site renders these at build time, so **the file is the source of truth** —
no CMS, no sync step.

| Route | File |
|---|---|
| `/` | `content/home.md` |
| `/start` | `content/start.md` |
| `/start/principles` | `content/principles.md` (shared with `/start`) |
| `/crosswalk` | `content/crosswalk.md` |
| `/success` | `content/success.md` |
| `/campaign` | `content/campaign.md` |
| `/campaign/sign` | `content/sign.md` |
| `/campaign/endorse` | `content/endorse.md` |
| `/resources` | `content/resources.md` |
| `/contact` | `content/contact.md` |

Full conventions, markers and gotchas: **[docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md)**.
What's still in components (nav labels, footer, form messages):
[docs/CONTENT-MAP.md](docs/CONTENT-MAP.md).

**`npm run lint:content` guards these files** and runs both as `prebuild` and as
the `Validate content` GitHub Action on every push and PR. It catches invalid
YAML, an odd number of `"` on a frontmatter line, a frontmatter slug with no
matching `## slug` section, and duplicate `### Label` keys. It exists because an
unterminated quote in `home.md` broke a production build, reporting the error
four lines below the actual mistake — and because the same class of typo can
parse cleanly and silently eat a key instead. **Edit content through a pull
request**: pushing `main` deploys, and the PR run is the check that catches this
before it ships.

`src/lib/content.js` does the parsing (`gray-matter` + `marked`) and applies three
conventions so plain markdown keeps the design: `[text](gloss:ospo)` renders a
glossary term with its definition as a hover tooltip, external links open in a new
tab while internal ones don't, and a blockquote whose last line starts with an
em-dash becomes a pull-quote with a `<cite>`.

## Where form submissions go

| Flow | Destination | Notes |
|---|---|---|
| **Individual signature** (`/campaign/sign`) | Payload CMS → `campaign-endorsements` | Arrives unpublished. **Publishing an entry in the Payload admin is the review step** that puts a name on the public endorser wall. Email is never exposed publicly. |
| **"Get updates" email** | Payload CMS → `campaign-signups` | Best-effort; never blocks a signature. |
| **Formal org endorsement** (`/campaign/endorse`) | Payload CMS → `campaign-endorsements` (`kind: organization`) | Same collection and review step as an individual signature. Approved entries appear on the public endorser wall. |
| **Contact message** (`/contact`) | Payload CMS → `contact-submissions` | Added 2026-08-06. Needed **no CMS change** — the collection already existed for sarapis.org with exactly these fields. Its `website` field is a **honeypot**: Payload rejects any submission that fills it, so `.unnyc-cmp-form__hp` must stay `display:none`. Not brand-scoped, so `ContactForm.js` appends a "Sent from unnyc.wegov.nyc" line — the only thing distinguishing these from sarapis.org's. Nothing emails you; messages sit in the admin. |

Both endorsement flows now land in the **same** Payload collection, separated by
`kind`. They used to be split — org endorsements went to a Google Sheet via an
Apps Script webhook — which meant a second place to look, a bearer-capability URL
held as a Vercel secret, and a destination Payload had already modelled
(`kind: organization`, `website`, `contactName`) and the endorser wall already
rendered. Consolidated 2026-08-06; `/api/formal-endorsement` is deleted.

Three fields from the UN's reference form were dropped as unmodelled
segmentation data: organisation type, country, and employee count.

### Payload CMS

- Admin: <https://next.sarapis.org/admin>
- Multi-brand. Every read/write is scoped by `NEXT_PUBLIC_SITE_KEY` (default
  `wegovnyc`) against the Sites collection.
- `src/lib/api.js` carries the full client inherited from the wegov.nyc
  marketing site. This site only uses `createSubmission()` and one `fetchAPI()`
  call for the endorser wall; the rest is kept so the two codebases stay
  diff-able and a CMS-backed page needs no new plumbing.

## Environment

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_PAYLOAD_URL` | no | `https://next.sarapis.org` | CMS origin |
| `NEXT_PUBLIC_SITE_KEY` | no | `wegovnyc` | Brand scope in Payload |

There are **no required secrets**. `ENDORSEMENT_SHEET_WEBHOOK_URL` was removed on
2026-08-06 with the Google Sheet path — endorsements go to Payload, which needs no
credential beyond the public brand key.

## CSS architecture

Cascade layers, declared in [`src/app/base.css`](src/app/base.css):

```
reset < components < unnyc < site
```

- `unnyc.css` and `primer.css` wrap their rules in `@layer unnyc`.
- **`site` sits above `unnyc` on purpose.** The nav lives inside `.unnyc-page`
  so it inherits that scope's tokens — which also means
  `.unnyc-page a { color: inherit }` would otherwise paint the nav links
  navy-on-navy. A later layer beats it with no specificity hacks.
- **Tokens come from [`@wegovnyc/design-tokens`](https://github.com/sarapis/wegovnyc-design-tokens)**,
  imported in `base.css` along with the `unnyc` brand variant. Rules read the
  SEMANTIC tier (`--wg-*`) directly — the local `--unnyc-*` alias layer and the
  hand-copied `wegov-tokens.css` were both deleted on 2026-08-05. Never write a
  colour literal or read a reference token (`--db-*`) in a rule: both are
  invisible to the brand variant. `npm run lint:tokens` warns if you do.

## Images and icons

- **Icons** are one inline SVG set — `src/components/unnyc/UnnycIcon.js`, paths
  taken verbatim from [Lucide](https://lucide.dev) (ISC), a single 24×24 canvas
  at 2px stroke. Content refers to them by name (`icon: shield-check`). They took
  over from eight PNGs that were 364 KB in four clashing art styles and, more to
  the point, **un-themeable** — a black raster is a colour literal, invisible to
  the brand variant. Colour now comes from `color:` on the CSS class. Add new
  icons from Lucide on the same canvas.
- **Photos** live in `public/images/` and are served through `next/image` —
  never a CSS `background-image`, which forfeits WebP, responsive sizing and
  lazy loading.
- **[`public/images/CREDITS.md`](public/images/CREDITS.md) records the source and
  licence of every image, and must be updated in the same commit that changes
  one.** Where a licence requires attribution it also has to render on the page:
  the `/resources` OSPO figure is CC BY 4.0 and carries its citation in a
  figcaption. Check the licence *before* using anything from a publisher CDN —
  that figure is reusable only because its article is hybrid open access.

## Deploying

**Pushing to `main` deploys to production.** Git integration was connected on
2026-08-04, so a merge to `main` goes live at <https://unnyc.wegov.nyc> with no
manual step. PRs get preview deployments.

To force a deploy without a commit:

```bash
vercel deploy --prod
```

A fresh clone must be linked first (`.vercel/` is gitignored):

```bash
vercel link --yes --project unnyc-campaign
```

Vercel project: `devins-projects-1baf43f0/unnyc-campaign` (named `unnyc-campaign`
because the project name `unnyc` was already taken by the older Vite site, now at
`old-unnyc.wegov.nyc`).

### Why this repo is public

Vercel's Hobby plan rejects git integration for **private org-owned** repos
(409, "Upgrade to Pro"); public org-owned repos are fine, which is why the sibling
`wegovnyc_front` has always auto-deployed. Rather than pay for Pro or maintain a
GitHub Actions workaround, the repo was made public — after auditing the history
for secrets (none: no `.pem`/`.key`/`.env` file has ever been committed, and
`.env.example` holds placeholders with an empty webhook value). Secret scanning
and push protection are enabled. **Real secrets belong in Vercel env vars.**

## Working alongside other sessions

More than one Claude session gets run against this checkout, and on 2026-08-08
that cost real effort three times in one afternoon — a concurrent session's files
turned up **staged** inside another session's commit, and one session committed on
top of another's unpushed work so the two could not ship separately.

**Never `git add -A`, `git add .` or `git commit -a` here.** A `PreToolUse` hook
in [`.claude/settings.json`](.claude/settings.json) refuses them
([`scripts/hooks/no-blanket-git-staging.sh`](scripts/hooks/no-blanket-git-staging.sh));
`.gitignore` has a deliberate `.claude/*` + `!.claude/settings.json` exception so
that guard travels with the repo. Stage by name, then read
`git diff --cached --name-only` before committing. For parallel work use a
worktree — see the CLAUDE.md section for the four gitignored things a new
worktree does not inherit.

## Known gaps

Nothing outstanding. The campaign accepts signatures, organization endorsements
and contact messages, and approved entries reach the public endorser wall.

Worth a decision rather than a fix: the CTFG map layer is now **live**, so the
open question about linking into the Civic Tech Field Guide directory while it is
de-indexed pre-launch is a current question, not a deferred one.

One thing to know rather than fix: **`published` defaults to false**, so a new
submission is invisible until someone ticks it in the Payload admin. That is the
review step, not a bug. If the wall looks empty, check there first.

### Resolved

- **Nothing could reach the endorser wall — four independent silent failures**
  (all fixed 2026-08-06). Payload read was `authenticated` so anonymous reads
  403'd (CMS r42); CORS lacked `unnyc.wegov.nyc`, so the browser blocked every
  submission before it was sent, introduced by this site's own extraction onto a
  new subdomain (CMS r43); `fetchAPI` had no case for `campaign-endorsements` and
  fell through to an empty list; and `/campaign-endorsements/stats` was not a real
  endpoint. Each alone was enough to keep the wall empty, and none logged
  anything. Verified end to end through the live form.
- **`/campaign/endorse` returned 503** — the Google Sheet path needed an
  `ENDORSEMENT_SHEET_WEBHOOK_URL` that was never set. Resolved by deleting that
  path: endorsements go to Payload, which needs no secret.
- **The eight Principles were listed in three places and had drifted.**
  `content/principles.md` is now the single source; the letter and the printable
  declaration derive from it. `src/data/` is deleted. See
  [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md).

- `wegov.nyc/unnyc/*` now 308s to this site (`wegovnyc_front` @ `84a83de`), so the
  duplicate no longer competes in search. `/unnyc/guide` → `/resources`, since that
  article was never carried over here.
- Footer tagline is the campaign framing, reusing `content/home.md`'s own
  `ogDescription` so the two can't drift.
- **Page H1s on `/start` and `/crosswalk` deliberately do not match their nav
  labels.** Editorial headlines and short wayfinding labels are different jobs, and
  the H1s are the stronger copy. Only the `<title>`/`ogTitle` were aligned, so a
  search result matches the label a visitor sees on arrival. Don't "fix" this.

## History

Extracted from the [wegov.nyc marketing site](https://github.com/wegovnyc/wegovnyc_front),
where this lived at `/unnyc`. All routes moved up one level (`/unnyc/start` →
`/start`), the CMS-driven marketing navbar was replaced with a static UNNYC nav,
and the theme switcher, blog, and frozen marketing pages were left behind.
Git history starts fresh here on purpose: the parent repo has two private SSH keys
in its public history, and rebasing onto it would have replicated that exposure.
Olivia Croteau's four-path restructure is credited via `Co-Authored-By` on the
initial commit.
