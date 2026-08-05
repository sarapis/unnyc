# Where every word on this site lives

Updated 2026-08-04. **All page copy is now in `content/*.md`** — see
[EDITING-CONTENT.md](EDITING-CONTENT.md) for the file-per-page table and how to
edit it.

## Still in components, not content files

These are short strings tied to structure rather than prose:

| Thing | File |
|---|---|
| Header nav labels + "Sign the Letter" button | `src/components/unnyc/UnnycNav.js` (`LINKS`, `CTA`) |
| Footer: tagline, three link columns, credit line | `src/components/unnyc/UnnycFooter.js` |
| Form labels, validation + success messages | `CampaignSignForm.js`, `EndorseForm.js` |
| Site-wide default title/description | `src/app/layout.js` (per-page titles are in each content file's `meta:`) |

## Legacy data files

- `src/data/unnyc.js` — only `openSource` is still used (the eight principles'
  short titles/descriptions, shared by the letter and the printable document).
- `src/data/unnyc-primer.js` — **superseded**. Its content now lives in the
  `content/*.md` files. A few exports (`primerHero`, `primerMapMarkers`,
  `primerMapLegend`, `principleIcon`) are already orphaned. Kept for now as a
  reference during the migration; safe to delete once you're confident.

## Known copy inconsistencies

- **Footer tagline** still uses the pre-campaign framing ("Where the United
  Nations meets New York City...").
- **Page H1s** on `/start` and `/crosswalk` don't match the renamed nav labels
  ("The Global Movement", "Open Source for NYC"). Left alone by request.
