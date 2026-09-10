import UnnycStartStoryscroller from '@/components/unnyc/primer/UnnycStartStoryscroller';
import './start.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { getContent, getCtfgProjects, getGovossCatalogues, getOspoMapPoints, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { glossaryLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('start');
    return pageMetadata(meta, '/start');
}

/**
 * /start — "A Global Movement," storyscroller layout (2026-09). Reimplements
 * a Claude Design handoff: a hero, a sticky icon-swapping sidebar beside the
 * vocabulary cards / world map / UN timeline, and a d3-rendered world map
 * (UnnycWorldMap) standing in for the old Leaflet map (PrimerMapInner).
 * Sibling of the /principles, /crosswalk and /success storyscrollers — same
 * palette, sidebar shape and reveal system.
 *
 * ALL COPY LIVES IN content/start.md. See docs/EDITING-CONTENT.md.
 */
export default function StartPage() {
    const doc = getContent('start');

    const terms = (doc.concepts?.terms ?? []).map((t, i) => ({ ...t, delay: 60 + (i % 2) * 90 }));
    const timeline = (doc.movement?.timeline ?? []).map((e) => ({ ...e, delay: 80 }));

    return (
        <>
            {/* The vocabulary section, as a DefinedTermSet. */}
            <StructuredData
                data={glossaryLd({
                    terms: doc.concepts?.terms ?? [],
                    path: '/start',
                    name: doc.concepts?.title ?? 'Vocabulary',
                })}
            />
            <HeaderHeightVar />
            <UnnycStartStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.title,
                    basicsLinkHtml: doc.basicsLink ? inlineMd(doc.basicsLink) : null,
                    ledeHtml: inlineMd(doc.lede),
                }}
                railItems={doc.sectionNav}
                concepts={{ title: doc.concepts?.title, ledeHtml: inlineMd(doc.concepts?.lede || ''), terms }}
                movementNow={{
                    title: doc.movementNow?.title,
                    ledeHtml: inlineMd(doc.movementNow?.lede || ''),
                    mapMarkers: doc.mapMarkers,
                    mapLegend: doc.mapLegend,
                    mapSource: doc.mapSource,
                    ctfg: getCtfgProjects(),
                    govoss: getGovossCatalogues(),
                    ospos: getOspoMapPoints(),
                }}
                movement={{ title: doc.movement?.title, timeline }}
            />
        </>
    );
}
