/**
 * PrimerEndorsers — the organizations that have endorsed the UN Open Source
 * Principles.
 *
 * MOVED here from the bottom of PrimerMovementNow (the /start map section) on
 * 2026-08-14. These are endorsers of the *Principles*, so they close the
 * /principles page rather than sitting under a map of government programs.
 *
 * Copy and the org list live in content/principles.md (`endorsers`), moved
 * across from content/start.md in the same change. Reuses the existing
 * `unnyc-pr-mn__*` / `unnyc-pr-endorsers__*` classes in primer.css, so the
 * treatment is unchanged from where it used to render.
 */
export default function PrimerEndorsers({ endorsers }) {
    if (!endorsers) return null;
    return (
        <section id="endorsers" className="unnyc-section unnyc-section--alt">
            <div className="unnyc-container">
                <div className="unnyc-pr-mn__endorsers">
                    <h2 className="unnyc-pr-mn__subhead">{endorsers.title}</h2>
                    <p className="unnyc-pr-mn__lede">{endorsers.lede}</p>

                    <ul className="unnyc-pr-endorsers__grid">
                        {endorsers.orgs.map((org, i) => (
                            <li key={i} className="unnyc-pr-endorsers__org">
                                <a href={org.url} target="_blank" rel="noopener noreferrer">
                                    {org.name} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
