# Where every word on this site lives

Updated 2026-08-04. **All page copy is now in `content/*.md`** — see
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

## No data files

`src/data/` was **deleted 2026-08-06** (1,001 lines). `unnyc.js` and
`unnyc-primer.js` were both fully orphaned once the open letter stopped importing
`openSource.principles`.

The eight principles now live once, in [`content/principles.md`](../content/principles.md), reshaped for each
surface by `principlesFlat()` / `principlesDeclaration()` in [`src/lib/content.js`](../src/lib/content.js).
See [EDITING-CONTENT.md](EDITING-CONTENT.md).

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
