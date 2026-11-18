import Link from 'next/link';

/**
 * UnnycFooter — Server component rendering the UNNYC-branded footer.
 *
 * Deliberately minimal (simplified 2026-08-06): the logo, the three
 * organizations behind the campaign, a Contact link, and the credit line.
 * It previously carried three columns — Explore (a duplicate of the header
 * nav), Official Sites, and Programs (un.org, nyc.gov, Junior Ambassadors,
 * UNITAR…), which were inherited from the pre-campaign "UN meets NYC" hub and
 * sent people away from the campaign rather than into it.
 */
const ORGS = [
    { href: 'https://wegov.nyc', label: 'WeGovNYC' },
    { href: 'https://databook.nyc', label: 'DatabookNYC' },
    { href: 'https://sarapis.org', label: 'Sarapis' },
];

/**
 * `brand` and `contactHref` exist for the Council site. Its pages are served on
 * council.opensource.nyc, where a bare "/contact" would resolve to a Council page
 * that does not exist — so it links to the UN site's contact page absolutely.
 * `name` is the site name in the copyright line.
 */
export default function UnnycFooter({
    brand = { first: 'UN', mid: '+', second: 'NYC' },
    contactHref = '/contact',
    name = 'UNNYC',
} = {}) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="unnyc-footer">
            <div className="unnyc-container">
                <div className="unnyc-footer__grid">
                    <div className="unnyc-footer__logo">
                        {/* See the note in UnnycNav.js. */}
                        <span className="unnyc-footer__logo-un">{brand.first}</span>
                        {brand.mid && <span className="unnyc-footer__logo-mid">{brand.mid}</span>}
                        <span className="unnyc-footer__logo-nyc">{brand.second}</span>
                    </div>

                    <nav className="unnyc-footer__nav" aria-label="Footer navigation">
                        <ul className="unnyc-footer__links">
                            {ORGS.map((o) => (
                                <li key={o.href}>
                                    <a href={o.href} target="_blank" rel="noopener noreferrer">
                                        {o.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                {contactHref.startsWith('/') ? (
                                    <Link href={contactHref}>Contact</Link>
                                ) : (
                                    <a href={contactHref}>Contact</a>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="unnyc-footer__bottom">
                    <p>
                        © {currentYear} {name} — Built by{' '}
                        <a href="https://wegov.nyc" target="_blank" rel="noopener noreferrer">
                            WeGov.NYC
                        </a>{' '}
                        and{' '}
                        <a href="https://sarapis.org" target="_blank" rel="noopener noreferrer">
                            Sarapis
                        </a>. Not affiliated with the United Nations or any government agency.
                    </p>
                </div>
            </div>
        </footer>
    );
}
