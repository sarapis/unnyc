import Link from 'next/link';
import './campaign.css';
import '../primer.css';

export const metadata = {
    title: 'Sign the Letter — UNNYC',
    description:
        'Two ways to back the campaign: sign the open letter as an individual or organization, or formally endorse the UN Open Source Principles.',
    openGraph: {
        title: 'Sign the Letter — UNNYC',
        description:
            'Sign the open letter, or formally endorse the UN Open Source Principles on behalf of your organization.',
        type: 'website',
    },
};

const PATHS = [
    {
        href: '/campaign/sign',
        question: 'Sign the open letter.',
        answer: 'Add your name, or endorse on behalf of your organization, on the public letter calling on NYC to act.',
    },
    {
        href: '/campaign/endorse',
        question: 'Formally endorse the UN Open Source Principles.',
        answer: 'For organizations ready to make it official — submit a formal commitment, or download the signable document.',
    },
];

/**
 * /campaign — the campaign's entry point. Two paths: sign the public
 * open letter (unchanged content, now at /campaign/sign), or formally
 * endorse the Principles (/campaign/endorse) — a form for additional
 * organizations plus a printable document for the administration itself.
 */
export default function CampaignChooserPage() {
    return (
        <div className="unnyc-cmp">
            <header className="unnyc-cmp-chooser__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-cmp-chooser__title">Ready to Act?</h1>
                    <p className="unnyc-cmp-chooser__lede">
                        There are two ways to back this campaign — pick the one that fits.
                    </p>
                </div>
            </header>

            <section className="unnyc-pr-paths">
                <div className="unnyc-container">
                    <div className="unnyc-pr-paths__grid">
                        {PATHS.map((path) => (
                            <Link key={path.href} href={path.href} className="unnyc-pr-path">
                                <h2 className="unnyc-pr-path__question">{path.question}</h2>
                                <p className="unnyc-pr-path__answer">
                                    {path.answer}{' '}
                                    <span className="unnyc-pr-path__arrow" aria-hidden="true">→</span>
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
