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

export default function UnnycFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="unnyc-footer">
            <div className="unnyc-container">
                <div className="unnyc-footer__grid">
                    <div className="unnyc-footer__logo">
                        <span className="unnyc-footer__logo-un">UN</span>
                        <span className="unnyc-footer__logo-nyc">NYC</span>
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
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </nav>
                </div>

                <div className="unnyc-footer__bottom">
                    <p>
                        © {currentYear} UNNYC — Built by{' '}
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
