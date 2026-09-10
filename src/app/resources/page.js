import UnnycResourcesStoryscroller from '@/components/unnyc/primer/UnnycResourcesStoryscroller';
import './resources.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { DATASETS, datasetIndex } from '@/lib/datasets';
import StructuredData from '@/components/unnyc/StructuredData';
import { ospoListLd, datasetLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('resources');
    return pageMetadata(meta, '/resources');
}

/**
 * /resources — storyscroller layout (2026-09). Reimplements a Claude Design
 * handoff: a hero, a sticky icon-swapping sidebar beside four reference
 * sections — Primary Sources, People to Call, Find an OSPO, Open Data — and
 * a foot CTA band. Sibling of the /start, /principles, /crosswalk and
 * /success storyscrollers — same palette, sidebar shape and reveal system.
 *
 * ALL COPY LIVES IN content/resources.md. See docs/EDITING-CONTENT.md.
 * Dataset rows are never authored — see the note in UnnycResourcesStoryscroller.
 */
export default function ResourcesPage() {
    const doc = getContent('resources');

    return (
        <>
            {/* The 18 public sector OSPOs. No coordinates — see the note in
                src/lib/structured-data.js about locationBasis. */}
            <StructuredData
                data={ospoListLd({
                    groups: doc.ospoDirectory?.groups ?? [],
                    path: '/resources',
                    name: doc.ospoDirectory?.title ?? 'Public sector open source programme offices',
                })}
            />
            {/* And as a citable Dataset — see the note on datasetLd about why
                only this site's OWN data gets this treatment. */}
            <StructuredData
                data={datasetLd({ dataset: DATASETS['public-sector-ospos'](), path: '/resources' })}
            />
            <HeaderHeightVar />
            <UnnycResourcesStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.title,
                    ledeHtml: inlineMd(doc.lede),
                }}
                railItems={doc.sectionNav}
                resourceGroups={doc.resourceGroups}
                contacts={doc.contacts}
                ospoDirectory={doc.ospoDirectory}
                openData={doc.openData}
                datasets={datasetIndex().datasets}
                foot={doc.foot}
            />
        </>
    );
}
