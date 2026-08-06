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

Full conventions, markers and gotchas: **[docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md)**.
What's still in components (nav labels, footer, form messages):
[docs/CONTENT-MAP.md](docs/CONTENT-MAP.md).

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

## Known gaps

- **The endorser wall needs the CMS deployed.** `/campaign/endorse` no longer
  503s — it posts to Payload — but the wall on `/campaign/sign` stays empty until
  the CMS ships `r42`, which makes reads public (they currently 403) and adds the
  `activity` / `activityConsent` fields. **Deploy the CMS before this front-end**,
  or Payload silently drops those two fields on submission. Existing signatures
  also need a moderator pass: `published` defaults to false.
- **The eight Principles are listed in three places and have already drifted.**
  Despite what the "Shared content" notes elsewhere imply, there is **no single
  source**: `src/data/unnyc.js`'s `openSource.principles` drives `/campaign/sign`,
  `const GROUPS` in `src/app/campaign/endorse/document/page.js` drives the
  printable declaration, and `content/principles.md` drives `/start` +
  `/start/principles`. The wordings differ ("Provide documentation" / "Well
  documented"; "Contribute back" / "Contributing back") and so do the
  descriptions. **Editing `content/principles.md` does not update the letter or
  the declaration.** Consolidating needs an editorial call on which phrasing wins.

### Resolved

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
