# Image Credits & Licensing

This file documents the source and license for every photo/graphic under
`public/images/`. Update this file in the same commit any time an image in
this directory is added, replaced, or removed.

## Stock photography — Adobe Stock (standard license)

The following images are licensed via a **standard Adobe Stock license for
free use**, which covers web use. See [Adobe Stock's license terms](https://stock.adobe.com/license-terms).

| File | Used on | License holder | Date acquired |
|---|---|---|---|
| `home/SDGs01.jpeg` | `/` — homepage path card #2, the UN Principles card (was card #1 until 2026-08-14) | olivia@sarapis.org | 08/10/2026 |
| `home/NYC02.jpeg` | `/` — homepage path card #3 (was #2 until the 2026-08-14 reorder) | olivia@sarapis.org | 08/10/2026 |
| `success/barcelona.jpeg` | `/success` — Barcelona case hero (also reused on the homepage path card #4) | olivia@sarapis.org | 08/10/2026 |
| `success/paris.jpeg` | `/success` — Paris case hero | olivia@sarapis.org | 08/10/2026 |
| `success/tokyo.jpeg` | **currently unused** — was the `/success` Tokyo case hero until that case was removed 2026-08-14. Considered for the fourth homepage card and rejected the same day; see "Not covered by this file" below | olivia@sarapis.org | 08/10/2026 |
| `success/munich.jpeg` | `/success` — Munich case hero | olivia@sarapis.org | 08/11/2026 |

## Fonts (not under `public/images/`, recorded here because this is the project's licence record)

| File | Used for | License | Source |
|---|---|---|---|
| `src/assets/fonts/DMSerifDisplay-Regular.ttf` | The generated link-preview images (`/og/*.png`) — the headline and the wordmark | **SIL Open Font License 1.1** (`src/assets/fonts/OFL.txt`, retained as the licence requires) | [github.com/google/fonts/tree/main/ofl/dmserifdisplay](https://github.com/google/fonts/tree/main/ofl/dmserifdisplay), fetched 2026-08-20 |

The site already loads DM Serif Display from Google Fonts for the page itself
(`@import` in `src/app/unnyc.css`); this is the same family as a local file
because the image renderer needs font BYTES, and Satori — what `next/og` draws
with — reads ttf/otf/woff and **cannot read woff2**, which is the only format
Google serves to a modern browser. Vendored rather than fetched during the build,
for the same reason the CTFG and GovOSS data are snapshots: a build that reaches
the network can fail for reasons unrelated to the commit.

## Other licenses

| File | Used on | License | Source |
|---|---|---|---|
| `resources/ospo-archetypes.jpg` | `/resources` — "Find an OSPO" section | **CC BY 4.0** (attribution required, redistribution and modification allowed) | Fig. 1 of Linåker, Nummelin Carlberg & O'Riordan, "Public sector open source program offices — Archetypes for how to grow (common) institutional capabilities", *Journal of Systems and Software* **241** (2026) 112998, [doi:10.1016/j.jss.2026.112998](https://doi.org/10.1016/j.jss.2026.112998) |

The CC BY licence on that figure was confirmed on 2026-08-10 from two
independent sources rather than assumed — Crossref reports
`creativecommons.org/licenses/by/4.0/` for the version of record, and OpenAlex
reports `cc-by` on the published version. The article is hybrid open access in
a subscription journal, so the licence is a property of this article, not of
the journal: **do not assume other Elsevier figures may be reused.** The image
was resized from the publisher's 2505px original; no other modification.

Replaced `resources/ospo-diagram.png` (also CC BY 4.0, from the TODO Group /
Linux Foundation [OSPO Book](https://ospobook.todogroup.org/01-chapter/)) on
2026-08-10.

## Not covered by this file

A few other image assets live outside `public/images/` and aren't Adobe
Stock purchases:

- `public/favicon.svg` — created in-house, no external license. Also the art for
  the **first homepage path card** (`/start`), rendered as a centred logo on a
  tint via `imageStyle: logo` rather than cover-cropped like the three
  photographs beside it.

  ⚠ **It has moved twice on 2026-08-14, and it is a placeholder again.** It was
  the `/resources` card's art, where keeping it WAS a decision: a city photo was
  rejected because card #4 is a Barcelona skyline meaning "cities that did
  this", so a second skyline meaning "our resource library" would read as a
  second case study. Then `/resources` lost its card to the UN Principles, and
  `home/SDGs01.jpeg` moved to Principles as the better-matched UN imagery —
  leaving the mark on `/start`.

  So the old justification no longer applies: this card is "the open source
  government movement", not a resource library, and the mark now sits in the
  FIRST position, the most prominent it has held. To finish it: buy a photo, set
  `image:` in `content/home.md`, drop the `imageStyle: logo` line, and add a row
  above.

  `success/tokyo.jpeg` — paid for and unused — remains the wrong answer: a city
  skyline beside card #4's Barcelona still reads as a second case study, and
  Tokyo is the case `/success` deliberately dropped.
- `public/case-images/*` (the "Governments Doing This Now" grid on
  `/success`) — these are each project's own logo or branded marketing
  graphic (Munich's city crest, X-Road's promotional lockup, the Sovereign
  Tech Agency's own hero image, MOSIP's logo, and product shots for DHIS2 /
  OpenCRVS pulled from their own sites), used referentially to identify and
  link to the organization each card describes — not licensed stock, and
  not independently owned. Trademark and copyright remain with the
  respective organization (Landeshauptstadt München, NIIS/X-Road, the
  Sovereign Tech Agency, MOSIP, DHIS2, and OpenCRVS).
