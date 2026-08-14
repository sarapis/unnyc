# Image Credits & Licensing

This file documents the source and license for every photo/graphic under
`public/images/`. Update this file in the same commit any time an image in
this directory is added, replaced, or removed.

## Stock photography — Adobe Stock (standard license)

The following images are licensed via a **standard Adobe Stock license for
free use**, which covers web use. See [Adobe Stock's license terms](https://stock.adobe.com/license-terms).

| File | Used on | License holder | Date acquired |
|---|---|---|---|
| `home/SDGs01.jpeg` | `/` — homepage path card #1 | olivia@sarapis.org | 08/10/2026 |
| `home/NYC02.jpeg` | `/` — homepage path card #2 | olivia@sarapis.org | 08/10/2026 |
| `success/barcelona.jpeg` | `/success` — Barcelona case hero (also reused on the homepage path card #3) | olivia@sarapis.org | 08/10/2026 |
| `success/paris.jpeg` | `/success` — Paris case hero | olivia@sarapis.org | 08/10/2026 |
| `success/tokyo.jpeg` | **currently unused** — was the `/success` Tokyo case hero until that case was removed 2026-08-14 | olivia@sarapis.org | 08/10/2026 |
| `success/munich.jpeg` | `/success` — Munich case hero | olivia@sarapis.org | 08/11/2026 |

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

- `public/favicon.svg` — created in-house, no external license. Also stands in as
  the art for the **fourth homepage path card** (`/resources`), rendered as a
  centred logo on a tint via `imageStyle: logo` rather than cover-cropped like
  the three photographs beside it. It is a placeholder: if a licensed photo is
  bought for that card, swap the `image:` in `content/home.md`, drop the
  `imageStyle: logo` line, and add a row above. `success/tokyo.jpeg` is a
  paid-for Adobe Stock image now sitting unused, if a city photo would do.
- `public/case-images/*` (the "Governments Doing This Now" grid on
  `/success`) — these are each project's own logo or branded marketing
  graphic (Munich's city crest, X-Road's promotional lockup, the Sovereign
  Tech Agency's own hero image, MOSIP's logo, and product shots for DHIS2 /
  OpenCRVS pulled from their own sites), used referentially to identify and
  link to the organization each card describes — not licensed stock, and
  not independently owned. Trademark and copyright remain with the
  respective organization (Landeshauptstadt München, NIIS/X-Road, the
  Sovereign Tech Agency, MOSIP, DHIS2, and OpenCRVS).
