import './base.css';
import './unnyc.css';
import UnnycNav from '@/components/unnyc/UnnycNav';
import UnnycFooter from '@/components/unnyc/UnnycFooter';
import ScrollReveal from '@/components/unnyc/ScrollReveal';

export const metadata = {
    // The campaign's primary domain as of 2026-08-19. Drives every canonical
    // and og:url, so it must match the host readers actually land on —
    // unnyc.wegov.nyc now redirects here.
    metadataBase: new URL('https://opensource.nyc'),
    // No `template` here on purpose: the page-level titles already carry their
    // own "— UNNYC" suffix, so a template would double it ("… — UNNYC | UNNYC").
    title: 'UNNYC — Make NYC the First City in the Americas to Endorse Open Source',
    description:
        'UNNYC is the campaign to make New York the first city in the Americas to endorse the UN Open Source Principles.',
    icons: { icon: '/favicon.svg' },
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
        <html lang="en">
            <body>
                <div className="unnyc-page wg-unnyc" data-brand="unnyc">
                    <UnnycNav />
                    <main>{children}</main>
                    <UnnycFooter />
                    <ScrollReveal />
                </div>
            </body>
        </html>
    );
}
