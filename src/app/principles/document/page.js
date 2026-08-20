import '../../printable-doc.css';
import UnnycIcon from '@/components/unnyc/UnnycIcon';
import PrintButton from '@/components/unnyc/PrintButton';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('principles');
    return pageMetadata(meta, '/principles/document');
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
    const { lead, groups, groupsDocument } = principlesDoc;

    // This page groups the principles its OWN way — two groups, not the UN's
    // three — because `groups` is read by four other surfaces and rearranging
    // it there would restructure the grid and the endorsement declaration too.
    // See the note above `groupsDocument` in content/principles.md.
    //
    // Throws rather than filtering: a slug typo would otherwise drop a
    // principle from a printed document silently, and lint:content does not
    // check these refs.
    const bySlug = new Map(
        [lead, ...groups.flatMap((g) => g.items)].map((p) => [p.slug, p]),
    );
    const docGroups = groupsDocument
        ? groupsDocument.map((g) => ({
            title: g.title,
            items: g.items.map((slug) => {
                const p = bySlug.get(slug);
                if (!p) {
                    throw new Error(
                        `content/principles.md: groupsDocument references unknown slug "${slug}"`,
                    );
                }
                return p;
            }),
        }))
        : groups.map((g) => ({ title: g.titleDocument || g.title, items: g.items }));

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

                {/* The two lead-in lines that sat here — "The software built for
                    the city ought to be:" and "As leaders in the global open
                    source movement, we are committed to the following:" — were
                    cut on 2026-08-14, when the document's body text was supplied
                    as a complete list that did not include them. They were
                    hardcoded here rather than in the content, which is why they
                    are deleted rather than emptied. */}
                <div className="unnyc-doc-page__primary">
                    <div className="unnyc-doc-page__primary-header">
                        <UnnycIcon name={lead.icon} size={28} className="unnyc-doc-page__icon" />
                        <p className="unnyc-doc-page__primary-title">
                            {lead.titleDocument || lead.title}
                        </p>
                    </div>
                    {(lead.bodyDocument || lead.body).map((p, i) => (
                        <p key={i} className="unnyc-doc-page__primary-desc">{p}</p>
                    ))}
                </div>

                {/* `titleDocument` / `descDocument` fall back to `title` / `desc`.
                    This page is the ONLY consumer of them: it was rewritten into
                    the imperative on 2026-08-14 and retitles four principles, and
                    without these fields that edit would also have rewritten the
                    /principles grid and /campaign/endorse/document, which read
                    `title` and `descCity || desc`. See the field contract in
                    content/principles.md. */}
                {docGroups.map((group) => (
                    <div className="unnyc-doc-page__group" key={group.title}>
                        <h2 className="unnyc-doc-page__group-title">{group.title}</h2>
                        <ul className="unnyc-doc-page__group-list">
                            {group.items.map((item) => (
                                <li key={item.slug}>
                                    <UnnycIcon name={item.icon} size={28} className="unnyc-doc-page__icon" />
                                    <span>
                                        <strong>{item.titleDocument || item.title}.</strong>{' '}
                                        {item.descDocument || item.desc}
                                    </span>
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
