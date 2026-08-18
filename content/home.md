---
meta:
  title: "UNNYC — Make NYC the First City in the Americas to Endorse Open Source"
  description: "UNNYC is the campaign to make New York the first city in the Americas to endorse the UN Open Source Principles. Start wherever you are — new to government open source, curious why it matters, ready to sign, or looking for resources."
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

# ORDERED TO MATCH THE TOP NAV, left to right then top to bottom:
# /start, /principles, /crosswalk, /success. The nav has FIVE items and this
# grid has four, so Resources — last in the nav — has no card. That is the
# trade, and it is sharper than it looks: /resources is NOT in the footer
# (that carries wegov.nyc, databook.nyc, sarapis.org and /contact), so the top
# nav is now the ONLY link to it from the homepage — verified, one link.
#
# The leading "1." "2." "3." "4." were dropped 2026-08-14. They were literal
# text in these strings, not rendered by UnnycPathCards, so numbering a card
# meant renumbering every card below it whenever the order changed.
paths:
  - href: /start
    image: "/favicon.svg"
    # `imageStyle: logo` centres the mark on a brand tint instead of
    # cover-cropping a 100x100 square into a 560x160 strip — which is what it
    # did until 2026-08-14, and why it read as a broken image rather than a
    # choice.
    #
    # The mark opens the sequence as of 2026-08-14, having swapped places with
    # SDGs01.jpeg. It sat on the /resources card, then briefly on Principles;
    # the UN photo went to Principles because it is UN imagery and that card is
    # the UN's Principles. What is left for this card is the campaign's own
    # mark, which at least reads as "this is us, here is the movement" rather
    # than as a place.
    #
    # ⚠ It is still a placeholder, and it is now the FIRST card — more
    # prominent than in either previous position. The remaining licensed asset
    # is `success/tokyo.jpeg`, rejected twice: a city skyline beside card 4's
    # Barcelona reads as a second case study, and Tokyo is the case /success
    # deliberately dropped.
    imageStyle: logo
    question: "What is the open source government movement?"
    answer: "The basics of the open source movement, plus its relevance to city governments and the UN from inception to present."
  - href: /principles
    # Swapped in from the /start card 2026-08-14: it is UN imagery and this is
    # the card about the UN's own Principles, which is a closer fit than
    # "the open source government movement" in general.
    image: "/images/home/SDGs01.jpeg"
    question: "What are the UN Open Source Principles?"
    answer: "The eight commitments the UN adopted in 2025, in plain English — and what each one would mean for New York City."
  - href: /crosswalk
    image: "/images/home/NYC02.jpeg"
    question: "How would open source improve NYC’s tech strategy?"
    answer: "Utilizing open source principles by default can improve digital infrastructure for New Yorkers (and save the city money)."
  - href: /success
    image: "/images/success/barcelona.jpeg"
    question: "How have other cities benefited from open source?"
    answer: "Cases of the open source principles operationalized, building a global network of innovation and reform."
---
