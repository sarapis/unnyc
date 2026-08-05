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

## Where form submissions go — two paths, on purpose

| Flow | Destination | Notes |
|---|---|---|
| **Individual signature** (`/campaign/sign`) | Payload CMS → `campaign-endorsements` | Arrives unpublished. **Publishing an entry in the Payload admin is the review step** that puts a name on the public endorser wall. Email is never exposed publicly. |
| **"Get updates" email** | Payload CMS → `campaign-signups` | Best-effort; never blocks a signature. |
| **Formal org endorsement** (`/campaign/endorse`) | Google Sheet via Apps Script | Posts to `/api/formal-endorsement`, which forwards server-side so the webhook URL never reaches the browser. |

This split is deliberate — the two flows have different review processes and
audiences. If you consolidate them later, `src/lib/api.js` and
`src/app/api/formal-endorsement/route.js` are the only places to change.

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
| `ENDORSEMENT_SHEET_WEBHOOK_URL` | **yes, in prod** | — | Apps Script Web App URL for formal endorsements. Server-side only. Without it `/api/formal-endorsement` returns `503` and the endorse form shows an error. |

## CSS architecture

Cascade layers, declared in [`src/app/base.css`](src/app/base.css):

```
reset < components < unnyc < site
```

- `unnyc.css` and `primer.css` wrap their rules in `@layer unnyc`.
- **`site` sits above `unnyc` on purpose.** The nav lives inside `.unnyc-page`
  so it inherits the `--unnyc-*` design tokens — which also means
  `.unnyc-page a { color: inherit }` would otherwise paint the nav links
  navy-on-navy. A later layer beats it with no specificity hacks.
- Shared tokens: [`src/styles/wegov-tokens.css`](src/styles/wegov-tokens.css)
  (`--wg-*`, `--db-*`); the UNNYC palette aliases them onto `--unnyc-*` in
  `unnyc.css`.

## Deploying

⚠️ **Pushing to `main` does NOT deploy.** Vercel's GitHub App isn't installed on the
`sarapis` org, so git integration is not connected. Deploy manually:

```bash
vercel deploy --prod
```

Vercel project: `devins-projects-1baf43f0/unnyc-campaign` (named `unnyc-campaign`
because the project name `unnyc` was already taken by the older Vite site, now at
`old-unnyc.wegov.nyc`).

To fix auto-deploy: Vercel → project → Settings → Git → Connect, approving the
GitHub App for the `sarapis` org.

## Known gaps

- **`/campaign/endorse` returns 503 on submit** — `ENDORSEMENT_SHEET_WEBHOOK_URL`
  is not set in Vercel. Individual signing on `/campaign/sign` works (it goes to
  Payload).
- **`wegov.nyc/unnyc` still serves an older copy of this campaign.** The 301 to
  this site hasn't been added to `wegovnyc_front` yet, so two copies are live.
- **Footer tagline** still uses the pre-campaign framing ("Where the United Nations
  meets New York City…").
- **Page H1s on `/start` and `/crosswalk`** don't match their renamed nav labels
  ("The Global Movement", "Open Source for NYC").

## History

Extracted from the [wegov.nyc marketing site](https://github.com/wegovnyc/wegovnyc_front),
where this lived at `/unnyc`. All routes moved up one level (`/unnyc/start` →
`/start`), the CMS-driven marketing navbar was replaced with a static UNNYC nav,
and the theme switcher, blog, and frozen marketing pages were left behind.
Git history starts fresh here on purpose: the parent repo has two private SSH keys
in its public history, and rebasing onto it would have replicated that exposure.
Olivia Croteau's four-path restructure is credited via `Co-Authored-By` on the
initial commit.
