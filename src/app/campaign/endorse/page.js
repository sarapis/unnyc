import Link from 'next/link';
import '../campaign.css';
import EndorseForm from '@/components/unnyc/EndorseForm';
import { getContent } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('endorse');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
}

/**
 * /campaign/endorse — the formal-commitment path, distinct from the public open
 * letter at /campaign/sign. Organizations record a formal commitment
 * (EndorseForm -> Payload `campaign-endorsements`, kind: organization), and anyone can open
 * the printable declaration prepared for the City to sign.
 *
 * ALL COPY LIVES IN content/endorse.md. See docs/EDITING-CONTENT.md.
 */
export default function CampaignEndorsePage() {
    const doc = getContent('endorse');

    return (
        <div className="unnyc-cmp">
            <header className="unnyc-cmp-header">
                <div className="unnyc-cmp-container">
                    <h1 className="unnyc-cmp-header__title">{doc.title}</h1>
                    <p className="unnyc-cmp-header__lede">{doc.lede}</p>
                    <div className="unnyc-cmp-header__actions">
                        <Link
                            href={doc.headerAction.href}
                            className="unnyc-btn unnyc-btn--outline-dark"
                            target="_blank"
                        >
                            {doc.headerAction.label}
                        </Link>
                    </div>
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
                    <p className="unnyc-cmp-sign__lede">{doc.formLede}</p>
                    <EndorseForm />
                </div>
            </section>
        </div>
    );
}
