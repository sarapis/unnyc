---
meta:
  title: "Make NYC First in the Americas on Open Source — UNNYC"
  description: "The campaign to make New York the first city in the Americas to endorse the UN Open Source Principles — why it matters, what it wins, and how to sign."
  ogTitle: "UNNYC — The UN Has United Around Open Source. NYC Should Too."
  ogDescription: "The campaign to make New York the first city in the Americas to endorse the UN Open Source Principles."
hero:
  titleLines:
    - "The Movement for Open Source Government is Being Organized in New York City... by the UN."
    - "NYC Government Should Join It."
  subtitle: "The world’s best performing city governments have put transitioning to open source at the center of their technology strategy. It’s time for New York City to do the same."
  ctas:
    - href: /campaign
      label: "Tell NYC to Use Open Source"
      style: primary

# ORDERED TO MATCH THE TOP NAV, left to right: /start, /principles, /crosswalk,
# /success. The nav has FIVE items and this page four sections, so Resources —
# last in the nav — has no section; the top nav is its only link from the
# homepage (the footer carries wegov.nyc, databook.nyc, sarapis.org, /contact).
#
# ⚠ This key is `journey`, NOT `sections` — getContent() returns
# {...frontmatter, sections} and the parsed BODY wins that name, so a
# frontmatter key called `sections` is silently overwritten (see CLAUDE.md).
#
# Each entry is one full-width section on the vertical scroll: kicker, headline,
# lede, link. The section NUMBERS are not here on purpose — they render from
# array position, so reordering entries renumbers them (the old cards carried
# literal "1." strings and renumbering meant editing every card below).
#
# ⚠ The proof row under each headline — the numbers, the reason titles, the case
# cities — is NOT authored here. Stat LABELS are copy and live below; their
# VALUES are derived in src/app/page.js from the same files the interior pages
# render (each `source:` names a derivation there), so the homepage cannot claim
# a number its target no longer shows. The teaser lists are read from the target
# pages' own content — retitle a crosswalk reason and the homepage follows.
journey:
  - href: /start
    kicker: "A Global Movement"
    headline: "Global cities are putting open source at the center of their technology strategy."
    lede: "From national code catalogues to city OSPOs, the world's best performing governments are building on software they own and share. Learn the vocabulary, the history, and see the map."
    stats:
      - source: ospos
        label: "Governments with Open Source Program Offices"
      - source: govoss-entries
        label: "Open Source Applications in Public Government Catalogs"
    linkLabel: "Explore the movement"
  - href: /principles
    kicker: "The UN Principles"
    image: "/images/home/SDGs01.jpeg"
    headline: "The UN is helping cities adopt open source. Their principles help."
    lede: "The UN Open Source Principles articulate a global consensus on how institutions should adopt and interact with open source — and a growing directory of organizations has formally endorsed them."
    stats:
      - source: endorsers
        label: "Endorsing Organizations"
    linkLabel: "Read the eight principles"
  - href: /crosswalk
    kicker: "Open Source for NYC"
    image: "/images/home/NYC02.jpeg"
    headline: "New York rents its software. It should own it and improve it."
    lede: "The city is putting billion-dollar IT contracts in place to keep renting proprietary systems — with nothing owned at the end. Here is what switching would save, unlock, and signal."
    linkLabel: "See six reasons"
  - href: /success
    kicker: "Case Studies"
    image: "/images/success/barcelona.jpeg"
    headline: "Well-run cities are transitioning to open source. It’s working."
    lede: "Barcelona signed first. Munich made the landmark migration. Paris scaled one office into national policy. Their playbooks are public — and New York can follow them."
    linkLabel: "Read the case studies"
---
