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
    # Straight to the letter itself (owner call, 2026-09-01) — /campaign is a
    # two-way chooser and the hero's one CTA shouldn't cost an extra hop.
    - href: /campaign/sign
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
    # ⚠ `source`, not `value` — the figures are DERIVED in src/app/page.js from
    # the same files the interior pages render (the OSPO directory, the GovOSS
    # snapshot, the endorser snapshot), so this page cannot claim a number its
    # target no longer shows. They were authored literals for one commit, and
    # the same commit's homepage already contradicted /crosswalk's titles —
    # that class of drift is what this buys out of. Labels stay editable here.
    stats:
      - source: ospos
        label: "Governments with Open Source Program Offices"
      - source: govoss-entries
        label: "Open Source Applications in Public Government Catalogs"
  - href: /principles
    kicker: "The UN Principles"
    headline: "The UN is helping cities adopt open source. Their principles help."
    lede: "The UN Open Source Principles articulate a global consensus on how institutions should adopt and interact with open source — and a growing directory of organizations has formally endorsed them."
    linkLabel: "Read the eight principles"
    image: "/images/home/SDGs01.jpeg"
    flip: true
    stats:
      - source: endorsers
        label: "Endorsing Organizations"
  - href: /crosswalk
    kicker: "Open Source for NYC"
    headline: "New York rents its software. It should own it and improve it."
    lede: "The city is putting billion-dollar IT contracts in place to keep renting proprietary systems — with nothing owned at the end. Here is what switching would save, unlock, and signal."
    linkLabel: "See six reasons"
    image: "/images/home/NYC02.jpeg"
    # No `items:` here — the six reason titles are READ from content/crosswalk.md
    # (src/app/page.js), so retitling a reason there retitles it here in the
    # same edit. The transcribed list this replaces went stale against
    # /crosswalk within a day of being written.
  - href: /success
    kicker: "Case Studies"
    headline: "Well-run cities are transitioning to open source. It's working."
    lede: "Barcelona signed first. Munich made the landmark migration. Paris scaled one office into national policy. Their playbooks are public — and New York can follow them."
    linkLabel: "Read the case studies"
    image: "/images/success/barcelona.jpeg"
    flip: true
    # No `items:` — the case titles are read from content/success.md's own
    # `cases` list (src/app/page.js).

# Copy specific to the homepage STORYSCROLLER layout (unnyc#72,
# UnnycHomeStoryscroller) — a dark, photo-backed alternative to the
# `hero`/`journey` layout above, which it leaves untouched. The narrative
# beats it shares with `journey` (Global Movement, UN Principles, Open
# Source for NYC, Case Studies — and the Keep Reading band) are READ FROM
# `journey` above, not repeated here: same kicker/headline/lede/href on
# both layouts. This block only holds copy `journey` has no shape for — the
# two-screen hero, the open letter section, and the audience chooser.
storyscroller:
  hero:
    # Reuses `hero.kicker` above (identical wording) — not repeated here.
    # One <span> marks the underlined phrase, same convention as
    # content/principles.md's `heroTitle`.
    h1: "The Movement for <span>Open Source Government</span> is Organized at the UN HQ."
    # Second screen of the (230vh) hero. The LAST line is fully underlined
    # in the design (not one phrase within it, unlike h1) — the component
    # applies that to whichever line renders last, no markup needed here.
    h2Lines:
      - "Top performing cities are participating."
      - "New York City hosts it."
      - "It's time for New York City government to join it."
    # CTA reuses `hero.ctas[0]` above (same label/href) — not repeated here.
  openLetter:
    kicker: "Take Action"
    lede: "We respectfully call on the Office of Technology & Innovation to:"
    ctaLabel: "Sign the open letter →"
    ctaHref: /campaign
  takeAction:
    title: "Which of these are you?"
    audiences:
      - id: gov
        label: "I work in NYC government"
        actions:
          - kicker: "Read first"
            title: "The briefing for city technology leadership"
            desc: "The UN programs, events and frameworks NYC can join, and what to do first."
            href: /resources/guide
          - kicker: "The ask"
            title: "Endorse the Principles by name"
            desc: "What an endorsement commits the city to, and the three asks in full."
            href: /campaign/sign
          - kicker: "Talk to us"
            title: "Ask for a briefing"
            desc: "We convene locally and can make introductions across the UN system."
            href: /contact
      - id: builder
        label: "I build technology"
        actions:
          - kicker: "Sign"
            title: "Add your name to the open letter"
            desc: "Sign as an individual. Every signature strengthens the case."
            href: /campaign/sign
          - kicker: "Read"
            title: "The eight principles"
            desc: "The global consensus on how institutions adopt open source."
            href: /principles
          - kicker: "Explore"
            title: "The movement, mapped"
            desc: "National code catalogues, city OSPOs, and the vocabulary."
            href: /start
      - id: org
        label: "I represent an organization"
        actions:
          - kicker: "Endorse"
            title: "Endorse on behalf of your organization"
            desc: "Join the organizations that have formally endorsed the letter."
            href: /campaign/endorse
          - kicker: "Sign"
            title: "Add your name to the open letter"
            desc: "Sign as an individual as well as your organization."
            href: /campaign/sign
          - kicker: "Contact"
            title: "Work with us"
            desc: "Briefings, introductions, and the letter itself."
            href: /contact
      - id: nyer
        label: "I'm a New Yorker"
        actions:
          - kicker: "Sign"
            title: "Tell NYC to use open source"
            desc: "Add your name to the letter to the Office of Technology & Innovation."
            href: /campaign/sign
          - kicker: "Why"
            title: "Six reasons this matters for New York"
            desc: "What switching would save, unlock, and signal."
            href: /crosswalk
          - kicker: "Follow"
            title: "Get campaign updates"
            desc: "What moves next, as it happens."
            href: /#updates
---
