import Link from 'next/link';
import { contacts } from '@/data/unnyc-primer';

/**
 * PrimerContacts — "the people to call": outward-facing organizations
 * (with their own public contact channels) whose role is helping
 * governments adopt open source, DPGs, and DPI — plus the NYC-side
 * offices the campaign addresses. Orgs + public channels only; named
 * individuals appear only where the org itself puts them forward.
 */
export default function PrimerContacts() {
    return (
        <section id="contacts" className="unnyc-section unnyc-section--alt">
            <div className="unnyc-container">
                <header className="unnyc-section__header">
                    <h2 className="unnyc-section__title">{contacts.title}</h2>
                    <p className="unnyc-section__desc">{contacts.lede}</p>
                </header>

                {contacts.groups.map((group, i) => (
                    <div key={i} className="unnyc-pr-contacts__group">
                        <h3 className="unnyc-pr-contacts__group-title">{group.title}</h3>
                        <div className="unnyc-pr-contacts__grid">
                            {group.items.map((item, j) => (
                                <article key={j} className="unnyc-pr-contact">
                                    <h4 className="unnyc-pr-contact__org">{item.org}</h4>
                                    <p className="unnyc-pr-contact__role">{item.role}</p>
                                    <p className="unnyc-pr-contact__helps">
                                        <span className="unnyc-pr-contact__helps-label">How they help</span>
                                        {item.helps}
                                    </p>
                                    {item.internal ? (
                                        <Link href={item.url} className="unnyc-pr-contact__link">
                                            Get in touch →
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="unnyc-pr-contact__link"
                                        >
                                            Public contact channel ↗
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                ))}

                <p className="unnyc-pr-contacts__note">{contacts.note}</p>
            </div>
        </section>
    );
}
