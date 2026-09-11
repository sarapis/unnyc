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
# ⚠ /resources is NOT one of these pages yet — it has its own older `foot:`
# block in content/resources.md, with its own wording ("Looking for something
# else?") and its own shorter list. Two implementations of one band is a known
# smell; migrating it is a one-line change plus deleting that block, but it
# would also change its wording and add /principles to its links, so it was
# left as an owner decision.
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
