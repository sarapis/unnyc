import './base.css';
import './unnyc.css';
import './dark-mode.css';
import UnnycNav from '@/components/unnyc/UnnycNav';
import UnnycFooter from '@/components/unnyc/UnnycFooter';

/** Runs before paint so the toggle's saved choice applies with no flash of
 * the wrong theme. Defaults to the OS preference on a first visit (no saved
 * choice yet); the toggle's own choice always wins after that. */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('unnyc-theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export const metadata = {
    metadataBase: new URL('https://unnyc.wegov.nyc'),
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
 * for nav/footer, no ThemeProvider.
 *
 * Dark mode: `data-theme` on <html> (read by dark-mode.css), toggled by
 * UnnycNav and set here before paint via THEME_INIT_SCRIPT so there's no
 * flash of the wrong theme. Rolling out page by page — see dark-mode.css
 * for which pages currently have dark rules (just `/` so far).
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
            </head>
            <body>
                <div className="unnyc-page wg-unnyc" data-brand="unnyc">
                    <UnnycNav />
                    <main>{children}</main>
                    <UnnycFooter />
                </div>
            </body>
        </html>
    );
}
