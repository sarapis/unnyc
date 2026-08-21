import './base.css';
import './unnyc.css';
import './updates-bar.css';
import UnnycNav from '@/components/unnyc/UnnycNav';
import UnnycFooter from '@/components/unnyc/UnnycFooter';
import ScrollReveal from '@/components/unnyc/ScrollReveal';
import UpdatesBar from '@/components/unnyc/UpdatesBar';
import { getContent } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';
import { bodyFont, displayFont } from './fonts';

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
            <body>
                <div className="unnyc-page wg-unnyc" data-brand="unnyc">
                    <UnnycNav />
                    <main>{children}</main>
                    {/* Site-wide email capture, IN THE FLOW between the content
                        and the footer — it is not an overlay, and the ordering
                        here is what puts it there.

                        Copy read HERE because UpdatesBar is a client component
                        and getContent is server-only — the same reason
                        PrimerMovementNow takes its map data as props. Read
                        inside the component, never at module scope, or edits to
                        the markdown need a dev-server restart to appear. */}
                    <UpdatesBar copy={getContent('updates')} />
                    <UnnycFooter />
                    <ScrollReveal />
                </div>
            </body>
        </html>
    );
}
