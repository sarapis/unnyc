---
# Copy for the site-wide email capture (src/components/unnyc/UpdatesBar.js),
# rendered in the flow between the content and the footer. NOT A PAGE — there is
# no route for this file, and no `meta:` block for that reason.
#
# ⚠ It says WHAT they get and WHO from, and nothing else. There is no unsubscribe
# link and no double opt-in — sending is manual from the Payload admin — so a
# promise about frequency ("monthly", "occasionally") or an unsubscribe would be a
# commitment to build something, not a wording change.
#
# ⚠ The sender is named as OPENSOURCE.NYC, the campaign, rather than WeGovNYC and
# Sarapis, who run it and whose Payload install actually receives the address
# (owner decision, 2026-08-21). The footer still names both organizations on
# every page, so the reader can find out who is behind it; this line just keeps
# the ask to one idea.
title: "Get updates"
text: "News and events from opensource.nyc."
placeholder: "you@example.com"
button: "Keep me posted"
buttonBusy: "Adding you…"
consent: "We'll email you news and events from opensource.nyc, and use your address for nothing else."
success: "You're on the list. Thank you."
invalid: "Please enter a valid email address."
error: "Something went wrong. Please try again in a moment."
---
