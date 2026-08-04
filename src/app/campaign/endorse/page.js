import Link from 'next/link';
import '../campaign.css';
import EndorseForm from '@/components/unnyc/EndorseForm';

export const metadata = {
    title: 'Formally Endorse the UN Open Source Principles — UNNYC',
    description:
        'Submit a formal commitment to the UN Open Source Principles on behalf of your organization, or download the signable document prepared for the City of New York.',
    openGraph: {
        title: 'Formally Endorse the UN Open Source Principles — UNNYC',
        description:
            'A formal commitment path for organizations, and a signable document prepared for the City of New York.',
        type: 'article',
    },
};

/**
 * /campaign/endorse — the formal-commitment path, distinct from the
 * public open letter at /campaign/sign. Two things happen here:
 * additional organizations can record a formal commitment (EndorseForm,
 * forwarded to a Google Sheet via /api/formal-endorsement), and anyone can
 * download the printable declaration prepared for the City to sign.
 */
export default function CampaignEndorsePage() {
    return (
        <div className="unnyc-cmp">
            <header className="unnyc-cmp-header">
                <div className="unnyc-cmp-container">
                    <h1 className="unnyc-cmp-header__title">
                        Formally Endorse the UN Open Source Principles
                    </h1>
                    <p className="unnyc-cmp-header__lede">
                        For organizations ready to make their support official, and for the City of
                        New York itself — a printable declaration, ready to sign.
                    </p>
                    <div className="unnyc-cmp-header__actions">
                        <Link
                            href="/campaign/endorse/document"
                            className="unnyc-btn unnyc-btn--outline-dark"
                            target="_blank"
                        >
                            View the signable document ↗
                        </Link>
                    </div>
                </div>
            </header>

            <article className="unnyc-cmp-letter">
                <div className="unnyc-cmp-container unnyc-cmp-container--narrow">
                    <p>
                        The open letter is the public campaign — anyone can sign it in a minute. This
                        page is for a further step: a <strong>formal commitment</strong>, recorded
                        separately, for organizations that want their endorsement of the UN Open
                        Source Principles on the record.
                    </p>
                    <p>
                        If you represent the City of New York, or are preparing this for the
                        Mayor&rsquo;s Office, the button above opens a formatted declaration —{' '}
                        <Link href="/campaign/endorse/document">
                            the lead principle, the rest grouped under the UN&rsquo;s own headings, and a signature block
                        </Link>{' '}
                        — designed to be printed and signed as the City&rsquo;s formal endorsement.
                    </p>
                </div>
            </article>

            <section className="unnyc-cmp-sign">
                <div className="unnyc-cmp-container unnyc-cmp-container--narrow">
                    <h2 className="unnyc-cmp-sign__title">Submit your formal commitment</h2>
                    <p className="unnyc-cmp-sign__lede">
                        Tell us your organization is committing to the UN Open Source Principles.
                        We&rsquo;ll follow up to confirm details before adding you to the record.
                    </p>
                    <EndorseForm />
                </div>
            </section>
        </div>
    );
}
