import UnnycResourcesStoryscroller from '@/components/unnyc/primer/UnnycResourcesStoryscroller';
import './resources.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { datasetIndex } from '@/lib/datasets';
import StructuredData from '@/components/unnyc/StructuredData';
import { ospoListLd } from '@/lib/structured-data';

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
            {/* ⚠ NO `Dataset` MARKUP HERE — removed 2026-09-14, and deliberately
                not replaced. datasetLd is for data THIS SITE MADE, because it
                emits `creator: this site`. The OSPO directory turned out to be
                the FLOSS-PSO Network's CC0 list, not our compilation (only the
                coordinates are ours), so marking it up would nominate us as the
                thing to cite for someone else's data — which the payload's own
                attribution string now explicitly tells reusers not to do.
                The ItemList above stays: it describes what this PAGE shows,
                which is a different claim from who made the underlying list.
                /principles keeps its Dataset markup; the endorser transcription
                really is ours. */}
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
