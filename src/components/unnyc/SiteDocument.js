import { bodyFont, displayFont } from '@/app/fonts';

/**
 * FLEX_GAP_PROBE — sets `.no-flexgap` on <html> when the browser cannot do
 * `gap` in a FLEX container (Safari < 14.1, Chrome < 84). src/app/
 * flex-gap-fallback.css supplies margin spacing for exactly that case.
 *
 * ⚠ THIS CANNOT BE @supports. Safari 13.1 supports `gap` in GRID, so
 * `@supports (gap: 1px)` is true there while flex gap still does nothing. The
 * only reliable test is measuring a real flex box, which is why this is JS.
 *
 * ⚠ IT RUNS IN <head>, BEFORE THE BODY PAINTS, and that is the point: adding
 * the class after first paint would show a flash of unspaced layout on exactly
 * the browsers being helped. It appends to documentElement because <body> does
 * not exist yet, and removes the probe before returning.
 *
 * Wrapped in try/catch and failing OPEN: if anything throws, no class is set
 * and the browser keeps whatever `gap` gives it. A browser with working flex
 * gap must never match the fallback sheet.
 *
 * ⚠ IT MEASURES TWO REAL CHILDREN, not `scrollHeight`, and NOT because that is
 * more elegant. The first version set `height: 0` on the probe box to keep it
 * out of the layout — which CLAMPS scrollHeight to 0, so the probe reported
 * "no flex gap" in every browser, `.no-flexgap` went on universally, and every
 * gap on the site was applied TWICE (nav links measured 56px apart instead of
 * 28px). Caught in a browser before it shipped. Keep the box out of the way
 * with off-screen positioning, never by zeroing the dimension you measure.
 */
const FLEX_GAP_PROBE = `(function(){try{
var d=document.createElement('div');
d.style.cssText='display:flex;flex-direction:column;row-gap:10px;position:absolute;top:0;left:-9999px;visibility:hidden;pointer-events:none';
var a=document.createElement('div'),b=document.createElement('div');
a.style.height='10px';b.style.height='10px';
d.appendChild(a);d.appendChild(b);
var r=document.body||document.documentElement;
r.appendChild(d);
var ok=(b.getBoundingClientRect().top-a.getBoundingClientRect().bottom)>=9;
r.removeChild(d);
if(!ok){document.documentElement.className+=' no-flexgap';}
}catch(e){}})();`;

/**
 * The <html>/<head>/<body> shell shared by BOTH root layouts — (un) and
 * (council). A route group with its own root layout must render its own <html>,
 * so without this the fonts and the flex-gap probe would be two copies waiting
 * to drift. Each layout passes what goes inside <body>.
 */
export default function SiteDocument({ children }) {
    return (
        // The two font variables go on <html> so the `:root` override in
        // unnyc.css can see them. Nothing reads these class names directly —
        // they exist only to define --unnyc-font-*.
        <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
            <head>
                {/* eslint-disable-next-line react/no-danger -- a 12-line feature
                    probe that must run before first paint; see FLEX_GAP_PROBE. */}
                <script dangerouslySetInnerHTML={{ __html: FLEX_GAP_PROBE }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
