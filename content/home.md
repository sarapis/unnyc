---
meta:
  title: "Make NYC First in the Americas on Open Source — UNNYC"
  description: "The campaign to make New York the first city in the Americas to endorse the UN Open Source Principles — why it matters, what it wins, and how to sign."
  ogTitle: "UNNYC — The UN Has United Around Open Source. NYC Should Too."
  ogDescription: "The campaign to make New York the first city in the Americas to endorse the UN Open Source Principles."
hero:
  # kicker + backgroundImage are new fields, only read by the full-bleed hero
  # variant (PrimerHeroFullBleed) — the original PrimerHero ignores them.
  kicker: "United Nations Headquarters, New York"
  backgroundImage: "/images/home/UNHQ.jpeg"
  # <br> line breaks below are deliberate, tuned for this hero's fixed
  # right-aligned column (see primer.css) — not the original PrimerHero's
  # narrower, auto-wrapping one. If that hero is ever used with this same
  # content, these breaks will force its wrap points too.
  #
  # Each segment is wrapped in a plain <span> — primer.css forces those
  # nowrap, which is what actually GUARANTEES the break lands where the
  # <br> is. A <br> alone isn't enough: at this font size, a long segment
  # can still auto-wrap before reaching its own <br>, orphaning the last
  # word onto its own line (that's what shipped first — a real bug, not a
  # rendering quirk to design around).
  titleLines:
    - "<span>The Movement for</span><br><span>Open Source Government</span><br><span> is Organized at the UN HQ.</span>"
    - "<span>NYC Hosts It. It's Time for </span><br><span>NYC Government to Join It.</span>"
  subtitle: "<span>The world’s best performing city governments have put transitioning</span><br><span>to open source at the center of their technology strategy.</span><br><span>New York City is ready to do the same.</span>"
  ctas:
    - href: /campaign
      label: "Tell NYC to Use Open Source"
      style: primary

# Replaced the four question/answer path cards with this alternating
# text/image "journey" 2026-08-19 — Devin's redesign, implemented from his
# artifact. ORDERED TO MATCH THE TOP NAV, same as the cards it replaced:
# /start, /principles, /crosswalk, /success. `flip: true` alternates the
# image to the left (2nd and 4th) so the sections don't all read the same
# way down the page. The three images are the SAME ones the old cards used
# (`/start` never had a real photo, so its section has none) — this is a
# layout change, not a content change.
journey:
  - href: /start
    kicker: "A Global Movement"
    headline: "Global cities are putting open source at the center of their technology strategy."
    lede: "From national code catalogues to city OSPOs, the world's best performing governments are building on software they own and share. Learn the vocabulary, the history, and see the map."
    linkLabel: "Explore the movement"
    stats:
      - value: "18"
        label: "Governments with Open Source Program Offices"
      - value: "2,789"
        label: "Open Source Applications in Public Government Catalogs"
  - href: /principles
    kicker: "The UN Principles"
    headline: "The UN is helping cities adopt open source. Their principles help."
    lede: "The UN Open Source Principles articulate a global consensus on how institutions should adopt and interact with open source — and a growing directory of organizations has formally endorsed them."
    linkLabel: "Read the eight principles"
    image: "/images/home/SDGs01.jpeg"
    flip: true
    stats:
      - value: "150"
        label: "Endorsing Organizations"
  - href: /crosswalk
    kicker: "Open Source for NYC"
    headline: "New York rents its software. It should own it and improve it."
    lede: "The city is putting billion-dollar IT contracts in place to keep renting proprietary systems — with nothing owned at the end. Here is what switching would save, unlock, and signal."
    linkLabel: "See six reasons"
    image: "/images/home/NYC02.jpeg"
    items:
      - "Save Money and Improve Negotiating Position"
      - "Control Your Systems, Unlock Your Programs"
      - "Security You Can Verify"
      - "Attract Elite Talent to NYC Government"
      - "Build Once, Use It 130+ Times"
      - "Lead the World from its Nexus in NYC"
  - href: /success
    kicker: "Case Studies"
    headline: "Well-run cities are transitioning to open source. It's working."
    lede: "Barcelona signed first. Munich made the landmark migration. Paris scaled one office into national policy. Their playbooks are public — and New York can follow them."
    linkLabel: "Read the case studies"
    image: "/images/success/barcelona.jpeg"
    flip: true
    items:
      - "Barcelona: The First City to Sign"
      - "Munich: A Landmark Migration and Lasting Institution"
      - "Paris: From One Office to National Policy"
---
