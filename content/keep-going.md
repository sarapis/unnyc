---
# The "Let's keep going" band at the foot of /start, /principles, /crosswalk
# and /success. Rendered by src/components/unnyc/primer/UnnycKeepGoing.js.
#
# ⚠ ONE LIST FOR EVERY PAGE, and the component drops the row whose `href`
# matches the page it is on. That is the whole reason this file exists rather
# than a `foot:` block per page: four near-identical lists in four markdown
# files is exactly the shape that drifted when the homepage carried its own
# copy of /crosswalk's reason titles and contradicted them within a day.
# Add a destination here once and every page gains it except its own.
#
# ⚠ ALL FIVE STORYSCROLLER ROUTES USE THIS NOW — /start, /principles,
# /crosswalk, /success and, since 2026-09-14, /resources. That last one had
# kept its own `foot:` block with different wording and a shorter list; the
# owner decided to unify, which changed its heading to "Let's keep going" and
# gave it a /principles link it did not have. There is no second
# implementation left — if you find one, it is new.
text: "Let's keep going"

# Order follows the reader path, which is also the nav order. The campaign CTA
# is last and is the only `primary` — the band should end on the ask.
links:
  - href: /start
    label: "New to government open source?"
    style: outline
  - href: /principles
    label: "What the Principles say"
    style: outline
  - href: /crosswalk
    label: "Why does this matter?"
    style: outline
  - href: /success
    label: "What success looks like"
    style: outline
  - href: /resources
    label: "Where to read further"
    style: outline
  - href: /campaign
    label: "Sign the open letter"
    style: primary
---
