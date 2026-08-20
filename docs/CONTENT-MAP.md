# Where every word on this site lives

Updated 2026-08-20. **All page copy is now in `content/*.md`** — see
[EDITING-CONTENT.md](EDITING-CONTENT.md) for the file-per-page table and how to
edit it.

## Still in components, not content files

These are short strings tied to structure rather than prose:

| Thing | File |
|---|---|
| Header nav labels + "Take Action" button | [`src/components/unnyc/UnnycNav.js`](../src/components/unnyc/UnnycNav.js) (`LINKS`, `CTA`) |
| Footer: org links (`ORGS`), Contact link, credit line | [`src/components/unnyc/UnnycFooter.js`](../src/components/unnyc/UnnycFooter.js) |
| Form labels, validation + success messages | [`CampaignSignForm.js`](../src/components/unnyc/CampaignSignForm.js), [`EndorseForm.js`](../src/components/unnyc/EndorseForm.js), [`ContactForm.js`](../src/components/unnyc/ContactForm.js) — all in `src/components/unnyc/` |
| Site-wide default title/description | [`src/app/layout.js`](../src/app/layout.js) (per-page titles are in each content file's `meta:`) |

## Recently moved OUT of components

Two strings left the JSX on 2026-08-13/14, both because changing them needed a
developer:

| Copy | Was | Now |
|---|---|---|
| `/start` map section title + lede | hardcoded in `PrimerMovementNow.js` | `content/start.md` (`movementNow`) |
| "The organizations that have signed on" heading | hardcoded `<h3>` in `PrimerMovementNow.js` | `content/principles.md` (`endorsers.title`) |
| The two `/principles/document` lead-in lines | hardcoded in that page | **deleted** 2026-08-14 — the supplied body text was a complete list that did not include them |
| The rail heading and its accessible name | — | `content/principles.md` (`railTitle`, `railLabel`). The rail's *labels* are not copy: it reads each principle's `titleCanonical`, so there is no extra wording to keep in step |

⚠ That second one is a lesson, not just a move. `endorsers.title` already existed
in the frontmatter, reading "Who Has Already Signed On" — and it was **dead**,
because the component ignored it and hardcoded its own heading. Anyone rendering
the "real" value would have silently retitled the section. **A frontmatter key is
not proof that it reaches the page**; grep the component before trusting one.

## No data files

`src/data/` was **deleted 2026-08-06** (1,001 lines). `unnyc.js` and
`unnyc-primer.js` were both fully orphaned once the open letter stopped importing
`openSource.principles`.

The eight principles now live once, in [`content/principles.md`](../content/principles.md), reshaped for each
surface by `principlesFlat()`, `principlesDeclaration()` and `principlesResolve()`
in [`src/lib/content.js`](../src/lib/content.js). See [EDITING-CONTENT.md](EDITING-CONTENT.md).

## Data that is NOT copy

Two JSON snapshots under `content/` are data, read by fail-soft loaders. Editing
them by hand is possible but they are meant to be refreshed by their scripts, and
the diff is the review:

| File | What | Refresh |
|---|---|---|
| [`content/un-endorsers.json`](../content/un-endorsers.json) | 150 endorsing organizations, name + sector, for `/principles`' directory | hand-curated snapshot of the UN's page (2026-08-06) |
| [`content/ctfg-gov-open-source.json`](../content/ctfg-gov-open-source.json) | 62 government open source programs for the `/start` map | `scripts/fetch-ctfg-projects.mjs` |
| [`content/govoss-catalogues.json`](../content/govoss-catalogues.json) + `govoss-countries.geo.json` | the country-fill map layer | `scripts/fetch-govoss-catalogues.mjs` |

⚠ **The endorser directory's copy is in `content/principles.md`; its list is not.**
Counts are derived in the component, never authored — do not write a total into the
copy, or a refreshed snapshot will leave the page claiming a number it no longer
shows.

⚠ **No logos in `un-endorsers.json`, deliberately** — third-party trademarks, and
the UN displaying them grants no onward rights. The names in it are a
*transcription* read off those logos, because the UN's page publishes no names at
all; corrections belong in the file's `corrections` array.

**Don't reintroduce a data module for content.** Those files carried three
hand-maintained copies of the principles that had already drifted, and looked
authoritative while being unused — which is exactly how the drift went unnoticed.

## Known copy inconsistencies

- **Page H1s on `/start` and `/crosswalk` deliberately do not match their nav
  labels.** Editorial headlines and short wayfinding labels are different jobs,
  and the H1s are the stronger copy. Only the `<title>`/`ogTitle` were aligned, so
  a search result matches the label a visitor sees on arrival. **Don't "fix" this.**

*(Resolved: the footer tagline used the pre-campaign "Where the United Nations
meets New York City" framing — replaced 2026-08-04 with the campaign's own
one-liner, reused verbatim from [`content/home.md`](../content/home.md)'s `ogDescription` so the two
cannot drift. The tagline itself was then **removed** on 2026-08-06 when the
footer was simplified to logo + org links + Contact + credit line.)*

*(Also 2026-08-06: the footer's three columns — Explore, Official Sites,
Programs — were deleted. Explore duplicated the header nav, and the other two
were inherited from the pre-campaign "UN meets NYC" hub, pointing at un.org,
nyc.gov and UNITAR. They sent people away from the campaign.)*
