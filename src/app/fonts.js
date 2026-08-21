import { DM_Serif_Display, Inter } from 'next/font/google';

/**
 * The two brand faces, self-hosted at build instead of fetched from Google by
 * every visitor.
 *
 * ── WHAT THIS REPLACES ──────────────────────────────────────────────────────
 * `unnyc.css` opened with
 *   @import "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1
 *            &family=Inter:wght@300;400;500;600;700&display=swap";
 * which is the worst available way to load a webfont, for three reasons that
 * compound:
 *
 *   1. It was the FIRST LINE of a render-blocking stylesheet, so the browser
 *      could not paint text until it had opened a NEW connection to
 *      fonts.googleapis.com (measured: DNS + TLS complete at 33ms, 71ms total on
 *      a warm local network — worse on mobile), read 39 @font-face rules, and
 *      then opened ANOTHER new connection to fonts.gstatic.com for the files.
 *      Three serialised round trips before the right typeface appears.
 *   2. Nothing preconnected to either host, so both handshakes started cold.
 *   3. It asked for more than the site uses: **Inter weight 300, which appears
 *      nowhere in the CSS**, and **DM Serif Display italic (`ital@0;1`), with
 *      zero `font-style: italic` anywhere in the built stylesheets**. Measured,
 *      not assumed.
 *
 * ── THE TRADE, STATED PLAINLY ───────────────────────────────────────────────
 * next/font downloads the faces AT BUILD TIME, so a build now needs
 * fonts.googleapis to be reachable — the same build-time network dependency this
 * repo argues against for the CTFG and GovOSS snapshots. The difference is which
 * way it moves the risk: today EVERY VISITOR depends on Google being up and
 * fast; after this, only a cold build does, and a failed build simply doesn't
 * deploy. Strictly better, and the reason to accept it.
 * If zero build-time network is ever wanted, the fully-vendored route is to put
 * woff2 files in the repo with hand-written @font-face — the way
 * src/assets/fonts holds the TTF the preview images need. That loses next/font's
 * automatic fallback metrics, which are what keep the swap from shifting layout.
 *
 * ── WHY VARIABLES AND NOT A className ON EVERY ELEMENT ──────────────────────
 * The design system owns the family names: `--wg-font-display` and
 * `--wg-font-body` in @wegovnyc/design-tokens, read 39 and 25 times across this
 * app. Pointing those two tokens at these two variables changes how the fonts
 * LOAD without touching what any component asks for.
 */

/** Headings and the wordmark. Not a variable font, and only ever used at 400 —
 *  `--wg-display-weight` in the token core is normal, with the comment "serif
 *  reads at 400". Italic dropped: nothing on the site sets it. */
export const displayFont = DM_Serif_Display({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--unnyc-font-display',
    // Metric-matched fallback while the face loads, so the swap doesn't reflow.
    fallback: ['Georgia', 'Times New Roman', 'serif'],
});

/**
 * Body text. Inter is a VARIABLE font, so this is one file covering every weight
 * the site uses (400, 500, 600, 700 — counted in the built CSS) instead of the
 * five static faces the old import requested.
 */
export const bodyFont = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--unnyc-font-body',
    fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
});
