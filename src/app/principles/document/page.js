import '../../printable-doc.css';
import UnnycIcon from '@/components/unnyc/UnnycIcon';
import PrintButton from '@/components/unnyc/PrintButton';
import { getContent } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('principles');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
}

/**
 * /principles/document — a standalone, linkable/printable one-pager of the
 * eight principles, for sharing outside the site.
 *
 * MOVED from /start/principles on 2026-08-13, when the principles became their
 * own top-level page; the old URL 308s here (see next.config.mjs). Named
 * `document` to match /campaign/endorse/document, the site's other printable.
 *
 * Shares its content (content/principles.md's `principlesDoc`) and its "paper"
 * styling (printable-doc.css) with the campaign's endorsement declaration.
 */
export default function PrinciplesDocumentPage() {
    const { principlesDoc } = getContent('principles');
    const { lead, groups } = principlesDoc;

    return (
        <div className="unnyc-doc-wrap">
            <div className="unnyc-doc-toolbar">
                <PrintButton>Print / Save as PDF</PrintButton>
                <p className="unnyc-doc-toolbar__note">
                    Opens your browser&rsquo;s print dialog — choose &ldquo;Save as PDF&rdquo; to download.
                </p>
            </div>

            <main className="unnyc-doc-page">
                <h1 className="unnyc-doc-page__title">The UN Open Source Principles</h1>

                <p className="unnyc-doc-page__intro">
                    Adopted by the UN&rsquo;s Digital and Technology Network in 2025, these eight
                    commitments define what it means for an institution to take open source
                    seriously — from how software gets built to how the people who build it are
                    supported.
                </p>

                <p className="unnyc-doc-page__lead-in">
                    The software built for the city ought to be:
                </p>

                <div className="unnyc-doc-page__primary">
                    <div className="unnyc-doc-page__primary-header">
                        <UnnycIcon name={lead.icon} size={28} className="unnyc-doc-page__icon" />
                        <p className="unnyc-doc-page__primary-title">{lead.title}</p>
                    </div>
                    {lead.body.map((p, i) => (
                        <p key={i} className="unnyc-doc-page__primary-desc">{p}</p>
                    ))}
                </div>

                <p className="unnyc-doc-page__lead-in">
                    As leaders in the global open source movement, we are committed to the
                    following:
                </p>

                {groups.map((group) => (
                    <div className="unnyc-doc-page__group" key={group.title}>
                        <h2 className="unnyc-doc-page__group-title">{group.title}</h2>
                        <ul className="unnyc-doc-page__group-list">
                            {group.items.map((item) => (
                                <li key={item.title}>
                                    <UnnycIcon name={item.icon} size={28} className="unnyc-doc-page__icon" />
                                    <span><strong>{item.title}.</strong> {item.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <footer className="unnyc-doc-page__footnote">
                    Source: United Nations Open Source Principles, adopted by the UN&rsquo;s
                    Digital and Technology Network, 2025 (unite.un.org). Prepared by WeGovNYC /
                    Sarapis as part of the campaign for New York City to formally endorse the
                    Principles.
                </footer>
            </main>
        </div>
    );
}
