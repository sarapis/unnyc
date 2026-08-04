import Link from 'next/link';

/**
 * UnnycFooter — Server component rendering the UNNYC-branded footer.
 * Includes logo, tagline, three link columns (Explore, Official Sites, Programs),
 * and copyright with WeGov.NYC and Sarapis attribution.
 */
export default function UnnycFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="unnyc-footer">
            <div className="unnyc-container">
                <div className="unnyc-footer__grid">
                    <div className="unnyc-footer__brand">
                        <div className="unnyc-footer__logo">
                            <span className="unnyc-footer__logo-un">UN</span>
                            <span className="unnyc-footer__logo-nyc">NYC</span>
                        </div>
                        <p className="unnyc-footer__tagline">
                            Where the United Nations meets New York City.
                            A free civic resource connecting global frameworks
                            with local governance.
                        </p>
                    </div>

                    <nav className="unnyc-footer__nav" aria-label="Footer navigation">
                        <div className="unnyc-footer__column">
                            <h4 className="unnyc-footer__column-title">Explore</h4>
                            <ul className="unnyc-footer__links">
                                <li><Link href="/start">The Global Movement</Link></li>
                                <li><Link href="/crosswalk">Open Source for NYC</Link></li>
                                <li><Link href="/success">What Success Looks Like</Link></li>
                                <li><Link href="/campaign">Sign the Letter</Link></li>
                                <li><Link href="/resources">Resources</Link></li>
                            </ul>
                        </div>

                        <div className="unnyc-footer__column">
                            <h4 className="unnyc-footer__column-title">Official Sites</h4>
                            <ul className="unnyc-footer__links">
                                <li>
                                    <a href="https://www.un.org" target="_blank" rel="noopener noreferrer">
                                        United Nations
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.nyc.gov" target="_blank" rel="noopener noreferrer">
                                        NYC.gov
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.ny.gov" target="_blank" rel="noopener noreferrer">
                                        NY.gov
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.nyc.gov/international" target="_blank" rel="noopener noreferrer">
                                        NYC International Affairs
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="unnyc-footer__column">
                            <h4 className="unnyc-footer__column-title">Programs</h4>
                            <ul className="unnyc-footer__links">
                                <li>
                                    <a href="https://www.nyc.gov/site/international/programs/nyc-junior-ambassadors.page" target="_blank" rel="noopener noreferrer">
                                        Junior Ambassadors
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.nyc.gov/site/international/programs/global-vision-urban-action.page" target="_blank" rel="noopener noreferrer">
                                        NYC Voluntary Local Review
                                    </a>
                                </li>
                                <li>
                                    <a href="https://unitar.org/ny" target="_blank" rel="noopener noreferrer">
                                        UNITAR New York
                                    </a>
                                </li>
                            </ul>
                        </div>
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
