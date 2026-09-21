import './base.css';
import './unnyc.css';
import './updates-bar.css';
// ⚠ LAST on purpose: every rule in it is scoped under `.no-flexgap`, so it
// only ever applies where the probe below found no flex-gap support.
import './flex-gap-fallback.css';
import UnnycNav from '@/components/unnyc/UnnycNav';
import UnnycFooter from '@/components/unnyc/UnnycFooter';
import ScrollReveal from '@/components/unnyc/ScrollReveal';
import UpdatesBar from '@/components/unnyc/UpdatesBar';
import BackToTop from '@/components/unnyc/BackToTop';
import { getContent } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';
import { bodyFont, displayFont } from './fonts';

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

export const metadata = {
    // The campaign's home as of 2026-08-20: a SUBDOMAIN, so the apex is free
    // for a future opensource.nyc homepage. Drives every canonical and og:url,
    // so it must match the host readers actually land on — the apex, www and
    // unnyc.wegov.nyc all redirect here.
    //
    // It emits NOTHING on its own: it only resolves the relative paths that
    // `pageMetadata()` passes per route (src/lib/seo.js). Setting it without
    // those is how the site went live with no canonical tag on any page.
    metadataBase: new URL(SITE_URL),
    // No `template` here on purpose: the page-level titles already carry their
    // own "— UNNYC" suffix, so a template would double it ("… — UNNYC | UNNYC").
    title: 'UNNYC — Make NYC the First City in the Americas to Endorse Open Source',
    description:
        'UNNYC is the campaign to make New York the first city in the Americas to endorse the UN Open Source Principles.',
    icons: { icon: '/favicon.svg' },
    // ⚠ THIS BLOCK REACHES NO PAGE. Next merges metadata SHALLOWLY, so a page's
    // `openGraph` REPLACES this object rather than extending it — and every
    // route defines its own via `pageMetadata()`. That is why the live site had
    // no og:site_name and no og:locale on any of its thirteen pages while this
    // sat here looking authoritative. The real values are in src/lib/seo.js;
    // these are the fallback for a route that somehow renders without it.
    openGraph: {
        siteName: 'UNNYC',
        type: 'website',
        locale: 'en_US',
    },
};

/**
 * Root layout for the standalone UNNYC site.
 *
 * Everything lives inside `.unnyc-page`, which is where unnyc.css defines the
 * --unnyc-* palette/spacing/type tokens — so the nav and footer pick them up
 * too. This replaces the marketing site's root layout: no CMS `/global` fetch
 * for nav/footer, no ThemeProvider, no theme switcher.
 *
 * ScrollReveal fades cards/grid-items in as they scroll into view (see that
 * component + unnyc.css's `.unnyc-reveal` rules); mounted once here so it
 * applies site-wide without every page needing to remember to include it.
 */
export default function RootLayout({ children }) {
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
            <body>
                <div className="unnyc-page wg-unnyc" data-brand="unnyc">
                    <UnnycNav />
                    <main>{children}</main>
                    {/* Site-wide email capture, IN THE FLOW between the content
                        and the footer — it is not an overlay, and the ordering
                        here is what puts it there.

                        Copy read HERE because UpdatesBar is a client component
                        and getContent is server-only — the same reason
                        UnnycWorldMap takes its map data as props. Read
                        inside the component, never at module scope, or edits to
                        the markdown need a dev-server restart to appear. */}
                    <UpdatesBar copy={getContent('updates')} />
                    <UnnycFooter />
                    <ScrollReveal />
                    <BackToTop />
                </div>
            </body>
        </html>
    );
}
