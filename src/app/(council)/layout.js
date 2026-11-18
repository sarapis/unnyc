import '../base.css';
import '../unnyc.css';
// ⚠ LAST on purpose — see the same import in src/app/(un)/layout.js.
import '../flex-gap-fallback.css';
import './council.css';
import UnnycNav from '@/components/unnyc/UnnycNav';
import UnnycFooter from '@/components/unnyc/UnnycFooter';
import BackToTop from '@/components/unnyc/BackToTop';
import SiteDocument from '@/components/unnyc/SiteDocument';
import { getContent } from '@/lib/content';
import { COUNCIL_LIVE, COUNCIL_URL, SITE_URL } from '@/lib/seo';

export const metadata = {
    // Resolves each page's relative canonical and og:url against THIS site's
    // host — the reason the Council site needs a root layout of its own.
    metadataBase: new URL(COUNCIL_URL),
    title: 'Open by Default NYC',
    description: 'The case for an open-source-by-default local law in New York City.',
    icons: { icon: '/favicon.svg' },
    ...(COUNCIL_LIVE ? {} : { robots: { index: false, follow: false } }),
};

/**
 * Root layout for the Council site (route group `(council)`), served at
 * council.opensource.nyc by the host rewrite in next.config.mjs.
 *
 * ⚠ LINKS ARE PUBLIC PATHS. These pages live at /council/* in the app, but a
 * reader sees "/" and "/bill"; the rewrite maps one to the other. Anything that
 * belongs to the UN site (contact, case studies, principles) is linked
 * ABSOLUTELY, because a bare "/contact" here would resolve to a Council page.
 *
 * Same shell, tokens and nav component as the UN site, with this site's own
 * wordmark and links. No UpdatesBar: this site's one ask is the Council member,
 * and a second email box would compete with it.
 */
export default function CouncilLayout({ children }) {
    const { brand } = getContent('council-home');
    return (
        <SiteDocument>
            <div className="unnyc-page wg-unnyc council-site" data-brand="unnyc">
                <UnnycNav
                    brand={{ first: brand.first, mid: ' ', second: brand.second, label: `${brand.first} ${brand.second} home` }}
                    links={[
                        { href: '/bill', label: 'The Model Bill' },
                        { href: `${SITE_URL}/principles`, label: 'UN Principles' },
                        { href: `${SITE_URL}/success`, label: 'Case Studies' },
                    ]}
                    cta={null}
                />
                <main>{children}</main>
                <UnnycFooter
                    brand={{ first: brand.first, mid: ' ', second: brand.second }}
                    contactHref={`${SITE_URL}/contact`}
                    name="Open by Default NYC"
                />
                <BackToTop />
            </div>
        </SiteDocument>
    );
}
