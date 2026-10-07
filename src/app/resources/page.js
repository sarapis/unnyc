import UnnycResourcesStoryscroller from '@/components/unnyc/primer/UnnycResourcesStoryscroller';
import './resources.css';
/* The "Let's keep going" band's look. ⚠ Shared with the other four
 * storyscroller routes — page CSS is per-route, so every route that renders
 * UnnycKeepGoing must import it or the band is unstyled on a fresh load.
 * See src/app/keep-going.css. */
import '../keep-going.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycKeepGoing from '@/components/unnyc/primer/UnnycKeepGoing';
import { getContent, getOspoDirectory, inlineMd } from '@/lib/content';
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
 * sections — Primary Sources, People to Call, Find an OSPO, Open Data — then
 * the shared "Let's keep going" band. Sibling of the /start, /principles,
 * /crosswalk and /success storyscrollers — same palette, sidebar shape and
 * reveal system, and since 2026-09-14 the same foot band as well.
 *
 * ALL COPY LIVES IN content/resources.md. See docs/EDITING-CONTENT.md.
 * Dataset rows are never authored — see the note in UnnycResourcesStoryscroller.
 */
export default function ResourcesPage() {
    const doc = getContent('resources');
    const ospoDirectory = getOspoDirectory();
    /* Only what the cards render goes to the client component: anything else on
     * the prop (forge lists, ids, coordinates, provenance) would be serialised into
     * the HTML of every visit and read by nobody. The full records are published at
     * /data/public-sector-ospos.json. */
    const { locations: _locations, ...ospoProse } = ospoDirectory;
    const ospoCards = {
        ...ospoProse,
        groups: ospoDirectory.groups.map((g) => ({
            country: g.country,
            items: g.items.map(({ name, url, city, description, email, flossPolicy }) => ({
                name,
                url,
                city,
                description,
                email,
                flossPolicy,
            })),
        })),
    };

    return (
        <>
            {/* The public sector OSPOs, from the same loader the cards use. No
                coordinates — see the note in src/lib/structured-data.js about
                locationBasis. */}
            <StructuredData
                data={ospoListLd({
                    groups: ospoDirectory.groups,
                    path: '/resources',
                    name: ospoDirectory.title ?? 'Public sector open source programme offices',
                })}
            />
            {/* ⚠ NO `Dataset` MARKUP HERE — removed 2026-09-14, and deliberately
                not replaced. datasetLd is for data THIS SITE MADE, because it
                emits `creator: this site`. The OSPO directory turned out to be
                the FLOSS-PSO Network's CC0 list, not our compilation (and since
                2026-10 not even the coordinates are ours alone — they are GovOSS's,
                copied from our original placements), so marking it up would nominate us as the
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
                ospoDirectory={ospoCards}
                openData={doc.openData}
                datasets={datasetIndex().datasets}
            />
            {/* Sibling of the storyscroller, not inside it: UnnycKeepGoing is a
                SERVER component (it reads its own copy via getContent) and the
                storyscroller is 'use client'. It drops the link to this page.
                ⚠ This replaced /resources' own `foot:` block on 2026-09-14 —
                the last of the two implementations of one band. */}
            <UnnycKeepGoing currentPath="/resources" />
        </>
    );
}
