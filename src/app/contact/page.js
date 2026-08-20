import Link from 'next/link';
import '../primer.css';
import '../campaign/campaign.css';
import ContactForm from '@/components/unnyc/ContactForm';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('contact');
    return pageMetadata(meta, '/contact', 'website');
}

/**
 * /contact — reached from the footer. A plain name/email/message form posting to
 * Payload's `contact-submissions`. Reuses campaign.css rather than introducing a
 * stylesheet for one page; the form markup uses the same `unnyc-cmp-form__*`
 * classes as the campaign forms.
 *
 * ALL COPY LIVES IN content/contact.md. See docs/EDITING-CONTENT.md.
 */
export default function ContactPage() {
    const doc = getContent('contact');

    return (
        <div className="unnyc-cmp">
            <header className="unnyc-cmp-header">
                <div className="unnyc-cmp-container">
                    <h1 className="unnyc-cmp-header__title">{doc.title}</h1>
                    <p className="unnyc-cmp-header__lede">{doc.lede}</p>
                </div>
            </header>

            <article className="unnyc-cmp-letter">
                <div className="unnyc-cmp-container unnyc-cmp-container--narrow">
                    <div dangerouslySetInnerHTML={{ __html: doc.sections.body.html }} />
                </div>
            </article>

            <section className="unnyc-cmp-sign">
                <div className="unnyc-cmp-container unnyc-cmp-container--narrow">
                    <h2 className="unnyc-cmp-sign__title">{doc.formTitle}</h2>
                    <ContactForm />
                </div>
            </section>

            {/* Reuses the crosswalk/success foot classes (primer.css) rather
                than inventing a contact-specific pair for one section. */}
            <section className="unnyc-pr-cw__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-pr-cw__foot-ctas">
                        {doc.foot.ctas.map((c) => (
                            <Link key={c.href} href={c.href} className={`unnyc-btn unnyc-btn--${c.style}`}>
                                {c.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
