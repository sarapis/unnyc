import '../../../printable-doc.css';
import PrintButton from '@/components/unnyc/PrintButton';
import { getContent, principlesDeclaration } from '@/lib/content';

export const metadata = {
    title: 'Declaration of Endorsement — UN Open Source Principles',
    description:
        'A printable declaration formally endorsing the United Nations Open Source Principles, prepared for the City of New York to sign.',
    robots: { index: false },
};


/**
 * /campaign/endorse/document — a printable declaration for the City
 * to sign. Structured after the UN's own "Open by Default" one-pager: a
 * lead principle called out on its own, the remaining seven grouped under
 * the UN's own three headings, using that source's own descriptions.
 */
export default function EndorsementDocumentPage() {
    // getContent reads the filesystem — must be called in the component, never
    // at module scope (see CLAUDE.md). content/principles.md is the single
    // source; this reshapes it into the declaration's headings, canonical
    // principle names and City-facing descriptions.
    const { lead, groups } = principlesDeclaration(getContent('principles').principlesDoc);
    return (
        <div className="unnyc-doc-wrap">
            <div className="unnyc-doc-toolbar">
                <PrintButton>Print / Save as PDF</PrintButton>
                <p className="unnyc-doc-toolbar__note">
                    Opens your browser&rsquo;s print dialog — choose &ldquo;Save as PDF&rdquo; to download.
                </p>
            </div>

            <main className="unnyc-doc-page">
                <header className="unnyc-doc-page__letterhead">
                    <div className="unnyc-doc-page__seal" aria-hidden="true">
                        Seal of the<br />City of New York
                    </div>
                    <p className="unnyc-doc-page__city">City of New York</p>
                    <p className="unnyc-doc-page__office">Office of the Mayor</p>
                </header>

                <h1 className="unnyc-doc-page__title">
                    Endorsement of the United Nations Open Source Principles
                </h1>

                <p className="unnyc-doc-page__intro">
                    The City of New York formally endorses the United Nations Open Source
                    Principles, joining the City of Barcelona — the first city in the world to do
                    so, in November 2025 — and more than sixty organizations worldwide already
                    committed to this standard.
                </p>

                <p className="unnyc-doc-page__lead-in">
                    By this endorsement, the City commits to the following:
                </p>

                {/* `lead` is only set when the content falls back to the UN's
                    three groups. Under `groupsGrid` each section carries its own
                    lead, so the standalone "The Foundation" block is not used —
                    #1 opens the Software section instead. */}
                {lead && (
                    <div className="unnyc-doc-page__primary">
                        <p className="unnyc-doc-page__primary-label">The Foundation</p>
                        <p className="unnyc-doc-page__primary-title">{lead.title}</p>
                        <p className="unnyc-doc-page__primary-desc">{lead.desc}</p>
                    </div>
                )}

                {groups.map((group) => (
                    <div className="unnyc-doc-page__group" key={group.title}>
                        <h2 className="unnyc-doc-page__group-title">{group.title}</h2>
                        {group.lead && (
                            <div className="unnyc-doc-page__primary">
                                <p className="unnyc-doc-page__primary-title">{group.lead.title}</p>
                                <p className="unnyc-doc-page__primary-desc">{group.lead.desc}</p>
                            </div>
                        )}
                        <ul className="unnyc-doc-page__group-list">
                            {group.items.map((item) => (
                                <li key={item.title}>
                                    <strong>{item.title}.</strong> {item.desc}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <p className="unnyc-doc-page__witness">
                    In witness whereof, the Mayor of the City of New York affixes their signature
                    below, this ____ day of ________________, 20____.
                </p>

                <div className="unnyc-doc-page__sigblock">
                    <div className="unnyc-doc-page__sigline">
                        <div className="unnyc-doc-page__rule" />
                        <p>Mayor, City of New York</p>
                    </div>
                    <div className="unnyc-doc-page__sigline unnyc-doc-page__sigline--seal">
                        <div className="unnyc-doc-page__rule" />
                        <p>[Seal of the City of New York]</p>
                    </div>
                </div>

                <footer className="unnyc-doc-page__footnote">
                    Prepared by WeGovNYC / Sarapis for consideration by the Office of the Mayor of
                    the City of New York. United Nations Open Source Principles, endorsed March
                    2025 (unite.un.org); Barcelona endorsement, November 2025
                    (interoperable-europe.ec.europa.eu).
                </footer>
            </main>
        </div>
    );
}
