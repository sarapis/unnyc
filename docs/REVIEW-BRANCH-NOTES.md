# Review branch: `olivia/review-batch`

All four of your PRs merged together, plus two fixes from Devin's session.
Base: `main` @ 7a5eebd. Nothing has been merged to `main`.

## What's in it

| Your PR | Commit | Status |
|---|---|---|
| #35 scroll-reveal animations | 8599feb | as you wrote it |
| #36 crosswalk reasons rail | 367ef46 + 8534a0f | **two changes below** |
| #43 open letter rewrite | 0b2f882 | as you wrote it |
| #44 Vendor Lock-in glossary term | 07834a8 | as you wrote it |

All four merged with **zero conflicts**.

## The two things changed in your work — please check these

**1. `4abe297` — rail positioning collision (bug fix)**

The /crosswalk rail rendered ~400px inside the prose, but ONLY after a
client-side navigation from /principles. A fresh load of /crosswalk was
always correct, which is why it looked fine in your PR.

Both stylesheets style `.unnyc-principles__rail` at the same specificity,
in the same `@media` and `@layer`. Next.js keeps both in the DOM after
navigating between the two pages, so source order decided the winner and
/principles' `left: 50%; transform: translateX(-50%)` applied on /crosswalk.

Fix: each page's positioning rules are now scoped to its own wrapper
(`.unnyc-principles__detail` / `.unnyc-pr-why__detail`). Verified both
navigation directions: no overlap, 56px gutter on /crosswalk, 32px on
/principles.

**2. `4d113ca` — the nine sourcing links restored to your crosswalk rewrite**

Your note said to verify claims before restoring any, so each is reattached
to the record it came from: the Comptroller report, two Databook contract
records (SurveyMonkey 4843244, Microsoft 5128452), Databook.NYC, the VDP,
two amNY pieces, opensource.paris.fr, technical.ly.

Your wording is unchanged, and your `<b>` emphasis is preserved *inside*
the links. One exception, flagged: the rewrite read "nearly $4 Billion were
spent ... in 2026", which dates the spending to 2026 — 2026 is when the
Comptroller reviewed. Restored to "the City Comptroller's 2026 review",
because the link now points at a report that would otherwise contradict the
sentence. If you'd rather word that differently, it's yours.

## Still open (not done, your call)

~139 lines of rail CSS are duplicated between `principles.css` and
`crosswalk.css`. They're byte-identical so they now collide harmlessly, but
that duplication is what caused bug 1. The real fix is promoting the block
into `primer.css`, which **both** pages already import, and deleting both
copies. Deliberately left out of a bugfix.

## How to pick it up

    git fetch origin && git checkout olivia/review-batch

Push straight to it — it's your branch now. When it's ready, open one PR
from `olivia/review-batch` into `main` and Devin merges it.

Your four original PRs (#35, #36, #43, #44) are still open and untouched,
so nothing is lost either way. They'd be superseded by the final PR.
