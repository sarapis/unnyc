import Link from 'next/link';
import '../primer.css';
import './resources.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import PrimerResources from '@/components/unnyc/primer/PrimerResources';
import PrimerContacts from '@/components/unnyc/primer/PrimerContacts';
import PrimerOspoDirectory from '@/components/unnyc/primer/PrimerOspoDirectory';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { ospoListLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('resources');
    return pageMetadata(meta, '/resources');
}

/**
 * /resources — reference material: the resource directory, the people to call,
 * and the global OSPO directory. Case studies live on /success.
 *
 * ALL COPY LIVES IN content/resources.md. See docs/EDITING-CONTENT.md.
 */
export default function ResourcesPage() {
    const doc = getContent('resources');

    return (
        <div className="unnyc-pr">
            {/* The 18 public sector OSPOs. No coordinates — see the note in
                src/lib/structured-data.js about locationBasis. */}
            <StructuredData
                data={ospoListLd({
                    groups: doc.ospoDirectory?.groups ?? [],
                    path: '/resources',
                    name: doc.ospoDirectory?.title ?? 'Public sector open source programme offices',
                })}
            />
            <HeaderHeightVar />

            <UnnycSectionNav items={doc.sectionNav} />

            {/* Same shape as /success's header. This page had none, which left
                it the only route with no <h1> — its outline opened at <h2>. */}
            <header className="unnyc-resources__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-resources__title">{doc.title}</h1>
                    <p
                        className="unnyc-resources__lede"
                        dangerouslySetInnerHTML={{ __html: inlineMd(doc.lede) }}
                    />
                </div>
            </header>

            <PrimerResources groups={doc.resourceGroups} />
            <PrimerContacts contacts={doc.contacts} />
            <PrimerOspoDirectory ospoDirectory={doc.ospoDirectory} />

            {/* Foot nav — the four paths don't dead-end here */}
            <section className="unnyc-resources__foot">
                <div className="unnyc-container unnyc-container--narrow">
                    <p>{doc.foot.text}</p>
                    <div className="unnyc-resources__foot-links">
                        {doc.foot.links.map((l) => (
                            <Link key={l.href} href={l.href} className={`unnyc-btn unnyc-btn--${l.style}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
