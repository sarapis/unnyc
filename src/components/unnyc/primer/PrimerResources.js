import Link from 'next/link';
import { primerResources } from '@/data/unnyc-primer';

/**
 * PrimerResources — grouped directory of primary sources: frameworks,
 * registries, communities of practice, and funding models.
 * Reuses the hub's resource-card CSS classes.
 */
export default function PrimerResources() {
    return (
        <section id="resources" className="unnyc-section">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{primerResources.title}</h2>
                    <p className="unnyc-section__desc">{primerResources.lede}</p>
                </header>

                <div className="unnyc-pr-resources__grid">
                    {primerResources.groups.map((group, i) => (
                        <div key={i} className="unnyc-pr-resources__group">
                            <div className="unnyc-pr-resources__group-header">
                                <h3 className="unnyc-pr-resources__group-title">{group.title}</h3>
                            </div>
                            <ul className="unnyc-pr-resources__links">
                                {group.links.map((link, j) => (
                                    <li key={j}>
                                        {link.internal ? (
                                            <Link href={link.url}>{link.text} →</Link>
                                        ) : (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                {link.text} ↗
                                            </a>
                                        )}
                                        <p>{link.desc}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
