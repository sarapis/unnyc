---
meta:
  title: "The Eight UN Open Source Principles — UNNYC"
  description: "A standalone, printable reference to the eight UN Open Source Principles, structured around the UN’s own principle groupings."

# ============================================================================
# THE EIGHT UN OPEN SOURCE PRINCIPLES — THE SINGLE SOURCE
# ----------------------------------------------------------------------------
# Three surfaces render these. Until 2026-08-06 each kept its OWN copy and they
# had drifted: the open letter said "Foster inclusion" and a bare "RISE", and an
# Oxford comma had crept into the declaration. Editing one changed one page.
#
#   /start + /start/principles   grouped, `title` (gerund), `desc`
#   /campaign/sign (the letter)  flat 1-8 by `n`, `titleCanonical`, `descShort`
#   /campaign/endorse/document   grouped, `titleCanonical`, `descCity || desc`
#
# So each principle carries every surface form it needs. These are VARIANTS ON
# PURPOSE, which is a different thing from the drift they replaced:
#
#   n               The UN's own number. Drives the icon AND the letter's order
#                   (the groups deliberately reorder them: 3,5,6 / 4,7 / 2,8).
#   title           Gerund form. REQUIRED by the group headings, which only
#                   parse grammatically that way — "Building Good Software that
#                   is… Well documented".
#   titleCanonical  The UN's own name for the principle. Used anywhere the
#                   principle is named on its own, with no heading to agree with.
#   desc            The full description.
#   descShort       Terse one-liner for the letter's numbered list, where the
#                   full description would swamp the line.
#   descCity        OPTIONAL. NYC-facing rewording for the declaration, where
#                   the City is the one committing rather than the UN. Only #8
#                   needs it today ("the City" not "the UN system"). Falls back
#                   to `desc`.
#
# ⚠ To change a principle's wording, change it HERE. Nothing else holds a copy.
# ============================================================================
principlesDoc:
  lead:
    n: 1
    icon: unlock
    title: "Open by default"
    titleCanonical: "Open by default"
    body:
    - "Making the use of open source software components to build city solutions the standard and default approach to creating software."
    - "There are very few scenarios when open source isn’t appropriate, and vendors ought to justify why their solutions should be closed, not the other way around."
    descShort: "Open source as the standard approach for projects"
    # The declaration states this as the City's own commitment, in one paragraph.
    descCity: "Using open source software components to build solutions for the city is the standard and default approach to creating software. There are very few scenarios when open source isn’t appropriate."
  groups:
  - title: "Building Good Software that is…"
    titleDeclaration: "We Build Good Software"
    items:
    - n: 3
      icon: shield-check
      title: "Secure by design"
      titleCanonical: "Secure by design"
      desc: "Making security a priority in all software projects."
      descShort: "Security as a priority in all software projects"
    - n: 5
      icon: recycle
      title: "Designed for reusability"
      titleCanonical: "Design for reusability"
      desc: "Designing projects to be interoperable across various platforms and ecosystems."
      descShort: "Interoperable across platforms and contexts"
    - n: 6
      icon: book-open
      title: "Well documented"
      titleCanonical: "Provide documentation"
      desc: "Providing thorough documentation for end-users, integrators and developers."
      descShort: "Thorough documentation for end users"
  - title: "Cocreating our Solutions with our Users through…"
    titleDeclaration: "Our Solutions are Cocreated with our Users"
    items:
    - n: 4
      icon: users
      title: "Fostering inclusive participation and community building"
      titleCanonical: "Foster inclusive participation and community building"
      desc: "Enabling and facilitating diverse and inclusive contributions."
      descShort: "Inclusive participation and community building"
    - n: 7
      icon: award
      title: "RISE (recognize, incentivize, support and empower)"
      titleCanonical: "RISE (recognize, incentivize, support and empower)"
      desc: "Empowering individuals and communities to actively participate."
      descShort: "Recognize, incentivize, support, and empower communities"
  - title: "Collaborating Globally and Delivering Locally by…"
    titleDeclaration: "Collaborating globally to deliver locally"
    items:
    - n: 2
      icon: git-pull-request
      title: "Contributing back"
      titleCanonical: "Contribute back"
      desc: "Encouraging active participation in the Open Source ecosystem."
      descShort: "Active participation in the open source ecosystem"
    - n: 8
      icon: trending-up
      title: "Sustaining and scaling"
      titleCanonical: "Sustain and scale"
      desc: "Supporting the development of solutions that meet the evolving needs of the UN system and beyond."
      descShort: "Solutions that meet evolving needs over time"
      descCity: "Supporting the development of solutions that meet the evolving needs of the City and beyond."
---
