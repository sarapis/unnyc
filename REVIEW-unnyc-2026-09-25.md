# Code review: sarapis/unnyc, 2026-09-25

Reviewer: Claude Opus 5.5. First recorded review of this repo (the Hub lists it as `never_reviewed`).
Reviewed at `05750af` (`origin/main`, deployed to production).

## Plan (approved before the deep read)

Areas, ranked by risk × recent change:

1. `/campaign/sign` endorser wall + `src/lib/api.js`. This is the only route that renders publicly submitted data.
2. The four Payload write paths: `CampaignSignForm`, `EndorseForm`, `ContactForm`, `UpdatesBar`.
3. `ScrollReveal.js` + the reveal and count-up logic in the storyscrollers. This changed most recently (#102/#103), and it is the one mechanism that can blank a page.
4. `src/lib/content.js`, the markdown pipeline behind every `dangerouslySetInnerHTML`, plus the fail-soft loaders.
5. `src/app/page.js` + `UnnycHomeStoryscroller.js` + `UnnycWorldMap.js`, the highest-churn code, with its derived counts.
6. `src/lib/datasets.js`, `structured-data.js`, `seo.js` and the three route handlers.
7. `scripts/fetch-*.mjs` + `validate-*.mjs`, read only for "writes a partial snapshot" and "passes without running".

Skipped: about 11k lines of CSS, the prose in `content/*.md`, printables, OG rendering and fonts, Payload's server code beyond the one collection definition, and a full audit of git history.

## Verdict

Yes, it can stay deployed as it is. There is no security exposure, and nothing loses data. But one live claim is wrong, and it is the kind this campaign can least afford. The homepage's open letter to NYC's Office of Technology & Innovation says "**150** endorsing organizations so far", directly under "Respectfully · The undersigned". That 150 is the UN's own endorser list. The letter itself has **zero** published signatures. Second, the endorser wall is cached indefinitely: when the first signature is published, it will not appear, even though the code comments promise a 5-minute refresh. Fix both before anyone promotes the letter.

## Owner decisions and fix status (2026-09-25)

| # | Outcome |
|---|---|
| 1 | **Kept by owner decision.** The homepage is meant to show the UN endorser count; the 150 stays. No change. |
| 2 | **Kept as a note.** The site is not trying to show signatures yet, so a wall that never refreshes has no live effect. It must be fixed (`next: { revalidate: 300 }`) before the wall is switched on. |
| 3 | Fixed: a failed site lookup is no longer cached, and an endorsement with no site is refused rather than saved invisibly. Checked with a stubbed `fetch`. |
| 4 | Fixed: 404 for an unknown slug, 503 for a missing source. Checked on a local server. |
| 5 | Fixed: the GovOSS and OSPO licence wording is interpolated from the snapshot. Checked in the built `/data/*.json`. |
| 6 | Fixed: a hidden document gets the final figure. Checked in the (hidden) preview pane, where the stats read `18 / 3,054 / 150`. |
| 7 | Fixed: `lint:content` parses every `content/*.json` and checks the list each loader needs. Checked against a broken file and an empty file (both exit 1). |

## Findings

### 1. HIGH: the homepage attributes the UN's 150 endorsers to our open letter
- `src/app/page.js:148` (`signatureCount: endorsers?.organizations.length`) → rendered at `src/components/unnyc/primer/UnnycHomeStoryscroller.js:608-611` with the label from `content/sign.md:21` ("endorsing organizations so far").
- **Failure:** `endorsers` is `getUnEndorsers()`, the 2026-08-06 transcription of the UN's endorsers page (150 orgs). The homepage renders that count inside the open letter's signature block. Verified on production text: `Respectfully · The undersigned · 150 · endorsing organizations so far · Sign the open letter →`. The letter is addressed "To: The New York City Office of Technology & Innovation". A reader, or OTI, will take this to mean 150 organizations signed a letter to the City. Payload currently returns `totalDocs: 0` for published `campaign-endorsements`, so the true count is 0.
- **Reachable:** it is on `/`, above the fold of the letter section, for every visitor.
- **Origin:** `2773691` (2026-09-09, "Rebuild homepage as a storyscroller"). No recorded decision behind it. The commit message does not mention it.
- **Fix:** either drop the stat, or derive it from the same Payload fetch `/campaign/sign` uses and hide it at 0, the way `/campaign/sign`'s own tally already does (`stats.total > 0 ? stats : null`). If the intent was "150 organizations back the UN Principles", move it out of the signature block and relabel it. That is an owner's copy call.
- **Confidence:** confirmed. Traced in code, and seen in the production HTML.

### 2. MEDIUM: the endorser wall is cached forever, so newly published signatures will not appear
- `src/lib/api.js:48` (`cache = isDraftMode ? 'no-store' : 'force-cache'`), used by `getCampaignEndorsements` at `api.js:259`. Consumed at `src/app/campaign/sign/page.js:49`, whose `revalidate = 300` at `page.js:38` claims a 5-minute refresh.
- **Failure:** in Next 16's `patch-fetch.js` (lines 341-344), `force-cache` with no `next.revalidate` sets the fetch's revalidate to `false`, which means cache indefinitely. The page does regenerate every 300s, but each regeneration reads the same cached Payload response. Today that cached response is "0 documents", so an admin publishing the first signature sees it in Payload while `/campaign/sign` still shows no wall and no tally. This lasts until the Data Cache is purged (a redeploy may or may not do that on Vercel; unverified).
- **Reachable:** yes, the moment any endorsement is published.
- **Fix:** `fetch(..., { next: { revalidate: 300 } })` for this collection (or `cache: 'no-store'`, and let page ISR do the caching). One line in `payloadGET`'s caller.
- **Confidence:** confirmed in the framework source. Not observed in production, because there is nothing published yet to go stale. Check it by publishing one test endorsement and loading `/campaign/sign` after 5 minutes.

### 3. LOW: a failed site-ID lookup permanently orphans that tab's submissions from the wall
- `src/lib/api.js:127-137` (`getSiteId` → `.catch(() => null)`, cached in the module-level `_siteIdPromise`) and `api.js:105` (`...(siteId ? { site: siteId } : {})`).
- **Failure:** if the browser's `GET /api/sites` fails once (network blip, Payload restart; the CMS docs note a measured 1.5-2s 502 window on container recreate), the promise resolves to `null`, and that `null` is cached for the life of the tab. Every submission from the tab then POSTs without `site`. Payload accepts it, because `site` is not required. But the wall filters on `where[site.key][equals]=wegovnyc` (`api.js:252`), so that signature can be published in the admin and still never appear. Nobody sees an error at any point.
- **Reachable:** needs a transient failure, which makes it rare. The preflight and CORS for `un.opensource.nyc` are verified OK today.
- **Fix:** don't cache a `null`. Retry on the next submission, or throw so the form shows its error state. Alternatively, have Payload default `site` for this collection.
- **Confidence:** confirmed by trace.

### 4. LOW: `/data/<anything>` returns 200 with an error body, and the comment says 404
- `src/app/data/[slug]/route.js:41-57`.
- **Failure:** `curl https://un.opensource.nyc/data/nope.json` gives **200** `{"error":"no dataset 'nope'",...}`, and `/data/foo` (no extension) gives 200 too. The comment at line 42 says "A 404 with the list". A missing snapshot (line 53) likewise publishes a 200 error envelope. A consumer checking status codes sees success. Because `dynamicParams` defaults to true, each unknown slug is also rendered on demand and cached.
- **Fix:** `new Response(..., { status: 404 })` for unknown slugs, `500` or `503` for a missing source, and `export const dynamicParams = false`.
- **Confidence:** confirmed on production.

### 5. LOW: licence facts are hardcoded into two dataset attribution strings
- `src/lib/datasets.js:185` ("catalogue data CC BY 4.0") and `:132` / `:137` ("the list is CC0", "released CC0").
- **Failure:** the `licence` field right beside each string is read from the snapshot (`d.licence`, `dir.licence`), but the human-readable attribution states the licence as a literal. If GovOSS or FLOSS-PSO relicense and the snapshot is refreshed, `/data/*.json` would carry a correct `licence` field next to an attribution that contradicts it. This is the exact failure CONTINUE.md invariant 7 records for CTFG ("a stale literal ... published the wrong licence on /start for two weeks").
- **Fix:** interpolate `${d.licence}` / `${dir.licence}` into those strings.
- **Confidence:** confirmed. Latent: correct today, because both snapshots do say CC BY 4.0 / CC0.

### 6. LOW: the backstop can replace a correct server-rendered stat with "0"
- `src/components/unnyc/primer/UnnycHomeStoryscroller.js:73-89` (`play()` for `data-count`), reached from the backstop at `:370-375`.
- **Failure:** the backstop fires precisely when `document.visibilityState !== 'visible'`. `play()` then sets `textContent = '0'` synchronously and relies on `requestAnimationFrame` to count up. In a hidden document, rAF is paused, so in a renderer that captures without ever becoming visible (the preview pane here, per CONTINUE.md, and some screenshotters), the SSR figure `3,054` is overwritten with `0`. A real background tab recovers when it is shown, because the first tick jumps straight to the final value. So this affects captures, not readers.
- **Fix:** in the backstop path (or whenever `document.visibilityState !== 'visible'`), set `fmt(target)` directly instead of animating.
- **Confidence:** confirmed by trace. The effect is documented from the preview pane.

### 7. LOW: a broken JSON snapshot builds green and silently removes content
- `src/lib/content.js:251-307` (`getGovossCatalogues`, `getCtfgProjects`, `getUnEndorsers` return `null` on any parse error); `src/app/page.js:63-79` filters `null` stats out; `scripts/validate-content.mjs:257` checks only `*.md`.
- **Failure:** the documented editing path is GitHub's web editor, and a push to `main` deploys. A hand edit that breaks `content/govoss-catalogues.json` or `un-endorsers.json` passes `lint:content`, `lint:css` and `next build`. Production then loses the homepage stat, the map fill and the `/principles` directory, and `/data/*.json` serves a 200 "unavailable" envelope (see #4). No error appears anywhere. Fail-soft is a deliberate decision here, so this is about the *silent* part: the repo's own rule is that an empty result must not look like "nothing to show".
- **Fix:** have `validate-content.mjs` also `JSON.parse` every `content/*.json` and fail on error. The runtime can stay fail-soft.
- **Confidence:** confirmed by trace. Not exercised.

## Checked and sound

- **Forms → Payload.** All four validate client-side, guard against double submits (`status === 'submitting'`) and show an error on a non-2xx response. `createSubmission` throws on `!res.ok`. The updates-signup `.catch(() => {})` at `CampaignSignForm.js:64` is deliberate best-effort and doesn't mask the signature itself.
- **Honeypot.** In `campaign-endorsements` it is `fax`, not `website` (`Sarapis/site/src/collections/CampaignEndorsements.ts:17,38`), so organizations *can* submit a website. `published` has field-level create access, so a POST cannot self-approve. Private fields (email, contactName, activity) are withheld from anonymous reads.
- **CORS.** A preflight from `https://un.opensource.nyc` to `/api/sites` returns `access-control-allow-origin: https://un.opensource.nyc`.
- **Deployed config.** Vercel production has **no** env vars, so the code defaults apply (`next.sarapis.org`, site key `wegovnyc`), and they match: Payload's `sites` has `{id: 2, key: 'wegovnyc'}`. There are no secret-gated routes in this repo, so the empty-secret class of bug does not apply.
- **XSS surface.** About 40 `dangerouslySetInnerHTML` sinks, all fed from repo `content/` or code constants. None takes Payload data. The wall renders submitted `name`, `title` and `organization` as React text, and `website` as an `href`, which React 19 blocks for `javascript:` URLs; the admin review gate sits in front of it anyway. `StructuredData` escapes `<`, so a `</script>` breakout is impossible.
- **Route handlers.** `/og/[slug]` 404s on unknown slugs (verified). `/llms.txt` is static. All 17 production endpoints return 200 (checked 2026-09-24).
- **Reveal backstop (#103).** The logic is correct in all four states (visible/hidden × IO alive/dead). Late-wired elements after `ioDead` are played rather than hidden. Cleanup removes every listener, timer and observer. Same shape in `ScrollReveal.js`.
- **`data-count` invariant.** The only `data-count` producer is `Stat`, which is given raw numbers from `page.js`. There is no formatted string anywhere.
- **The "never sum GovOSS fills" rule.** `UnnycWorldMap.js` has no `reduce` or sum over the country counts.
- **Fetch scripts.** Every network call has a 60s `AbortSignal.timeout`, and every structural check throws *before* `writeFileSync`, so a failed fetch cannot write a partial snapshot.
- **Build and lints.** `npm run build` passes, including all three lints; `lint:css` shows its 2 expected warnings.

## Not reviewed

- **There are no tests.** The repo has no test suite, so nothing could be run beyond the build and the three lints, and none of the paths above is covered by an automated assertion.
- **CSS (~11k lines).** Covered only by `lint:css` and the token lint.
- **Storyscroller scroll behaviour in a real browser.** The preview pane delivers no scroll events, so this is structurally unverifiable here.
- **Payload server code** beyond the one collection file and the CORS list. That includes spam and rate limiting on anonymous create, which this repo cannot see.
- **Whether a Vercel redeploy purges the Data Cache** (it bounds how long #2 lasts).
- **Full git-history secret audit.** CLAUDE.md records a clean audit before the repo went public, and push protection is on. Not re-done.
- `UnnycWorldMap.js` beyond the summing check; the printable pages; `og-image.js`; `seo.js` / `structured-data.js` beyond the escaping and the route-list guard.

## Themes

**One root cause behind #1, #2 and #7: a number shown to the public that nothing checks against its source.** #1 shows a count from the wrong source. #2 shows a count from the right source that never refreshes. #7 drops a count without a word. The repo already has a strong rule for this ("every proof row is DERIVED"), but *derived* is not the same as *derived from the thing the sentence is about*. The cheap guard is to state, for each rendered count, what it counts, and to check that against the label beside it.

**Fail-soft that fails silently** (#3, #4, #7). Each fallback is individually reasonable. Together they mean the site's failures present as "nothing to show yet", which on a brand-new campaign is indistinguishable from the truth. Where a fallback exists, give it a loud side: a non-200 status, a build-time check, or a thrown error that the form surfaces.

## Candidates discarded in the refute pass (9 of 16)

1. A `website` honeypot rejecting org endorsements. Refuted: the honeypot there is `fax`.
2. CORS blocking the browser's site lookup. Refuted: the preflight passes.
3. Missing `NEXT_PUBLIC_*` in production. Refuted: the defaults are correct.
4. Stored XSS via a submitted org `website`. Refuted: React 19 blocks `javascript:` hrefs, behind admin review.
5. Unescaped `title` in internal markdown links. Trusted repo content only.
6. The backstop revealing everything in a background-opened tab. That is the intended trade-off, not a bug.
7. Stale `ScrollReveal` selectors (`.unnyc-cmp-wall__org`). Dead, and harmless.
8. `mangle` / `headerIds` passed to marked 18. Silently ignored, no effect.
9. `lint:tokens` unable to fail the build (`|| true`). It is documented as advisory.

## Style and hygiene (not findings)

- `api.js` still carries ~250 lines of the marketing site's articles/events/Lexical code, and its footer comment points at `src/data/unnyc-primer.js`, which was deleted on 2026-08-06.
- `content.js` caches the glossary in module scope (`_glossary`), which is the dev-server staleness pattern CLAUDE.md warns about for `getContent()`.
- `ScrollReveal`'s selector list includes classes that no longer exist.
