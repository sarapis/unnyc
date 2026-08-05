# Where every word on this site lives

Generated 2026-08-04. Use this to find the file behind any text you want changed
— or annotate it with the wording you want and hand it to an agent.

**The copy is currently split across two layers, and it's split the wrong way
round:** structured lists sit in tidy data files, while the long persuasive
prose is trapped in JSX markup. See "Known problem" at the bottom.

---

## Layer 1 — data files (easy to edit)

`src/data/unnyc-primer.js` (610 lines) — plain JS objects, one export per block.

| Export | Feeds | What it holds |
|---|---|---|
| `primerHero` | `/` | Headline lines, subheading, CTA, the four stat tiles |
| `movement` | `/start` | The timeline (year, title, description) |
| `concepts` | `/start` | Glossary: term, definition, "why NYC should care", reference link |
| `cases` | `/success` | Case studies: place, headline, body, "lesson for NYC", link |
| `primerMapMarkers` / `primerMapLegend` | `/start` | World-map pins and legend labels |
| `endorsers` | `/start` | The endorsing organizations, Barcelona badge, CTA |
| `primerResources` | `/resources` | Grouped resource directory |
| `contacts` | `/resources` | "Who can help" org cards |
| `ospoDirectory` | `/resources` | OSPO directory |
| `principlesDoc` | `/start/principles` | The Eight Principles copy |
| `principleIcon(n)` | — | Helper for `/principle-icons/princN.png` |

`src/data/unnyc.js` (397 lines) — inherited from the marketing site.
`openSource` is the only export still used (by `/crosswalk` and `/campaign/sign`).

## Layer 2 — prose hardcoded in JSX (painful to edit)

Editing these means working around `<p>`, `<strong>`, `{' '}` spacing glue and
escaped curly quotes.

| Route | File | Approx. prose lines |
|---|---|---|
| `/crosswalk` | `src/app/crosswalk/page.js` | **~158** ← the biggest |
| `/success` | `src/app/success/page.js` | ~45 |
| `/campaign/sign` | `src/app/campaign/sign/page.js` | ~30 (the open letter) |
| `/campaign/endorse` | `src/app/campaign/endorse/page.js` | ~12 |
| `/campaign/endorse/document` | `src/app/campaign/endorse/document/page.js` | ~10 |
| `/start/principles` | `src/app/start/principles/page.js` | ~6 |
| `/start`, `/`, `/campaign`, `/resources` | respective `page.js` | 2–4 each (headers only) |

## Chrome, titles, and small strings

| Thing | File |
|---|---|
| Header nav labels + "Sign the Letter" button | `src/components/unnyc/UnnycNav.js` (`LINKS`, `CTA`) |
| Footer: tagline, all three link columns, credit line | `src/components/unnyc/UnnycFooter.js` |
| Browser/SEO titles + social descriptions | `metadata` block at the top of each `page.js` |
| Site-wide default title/description | `src/app/layout.js` |
| Form labels, validation and success messages | `CampaignSignForm.js`, `EndorseForm.js` |
| The four home-page path cards | `src/components/unnyc/primer/UnnycPathCards.js` (`PATHS`) |

## Known problem

Long-form prose is the content you most want to type freely, and it's the
content currently hardest to reach. `/crosswalk` alone holds ~158 lines of
inline JSX prose; it used to be data-driven (`primerPolicies` in
`unnyc-primer.js`) and was inlined during the four-path restructure.

Proposed fix (not yet implemented — awaiting a decision): move page copy into
`content/*.md` files with YAML frontmatter for the structured parts and a
markdown body for prose, rendered at build time so the file is the actual
source of truth rather than a spec someone has to transcribe.

## Known copy inconsistencies

- **Footer tagline** still uses the pre-campaign framing ("Where the United
  Nations meets New York City. A free civic resource connecting global
  frameworks with local governance.").
- **Page H1s and `<title>`s** on `/start` and `/crosswalk` still say "New to
  Government Open Source? Start Here" and "Why Open Source Matters to NYC",
  while the nav now says "The Global Movement" and "Open Source for NYC".
