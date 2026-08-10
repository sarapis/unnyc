import Link from 'next/link';
import '../primer.css';
import './resources.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycSectionNav from '@/components/unnyc/UnnycSectionNav';
import PrimerResources from '@/components/unnyc/primer/PrimerResources';
import PrimerContacts from '@/components/unnyc/primer/PrimerContacts';
import PrimerOspoDirectory from '@/components/unnyc/primer/PrimerOspoDirectory';
import { getContent } from '@/lib/content';

export async function generateMetadata() {
    const { meta } = getContent('resources');
    return {
        title: meta.title,
        description: meta.description,
        openGraph: { title: meta.ogTitle, description: meta.ogDescription, type: 'article' },
    };
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
            <HeaderHeightVar />

            <UnnycSectionNav items={doc.sectionNav} />

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
