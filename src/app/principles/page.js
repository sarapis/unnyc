import UnnycPrinciplesStoryscroller from '@/components/unnyc/primer/UnnycPrinciplesStoryscroller';
import '../primer.css';
import './principles.css';
/* The "Let's keep going" band's look. ⚠ Shared with the other three
 * storyscroller routes — page CSS is per-route, so every route that renders
 * UnnycKeepGoing must import it or the band is unstyled on a fresh load.
 * See src/app/keep-going.css. */
import '../keep-going.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycKeepGoing from '@/components/unnyc/primer/UnnycKeepGoing';
import { getContent, getUnEndorsers, inlineMd, principlesResolve } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { DATASETS } from '@/lib/datasets';
import StructuredData from '@/components/unnyc/StructuredData';
import { endorserListLd, datasetLd } from '@/lib/structured-data';

// Read per call, NOT at module scope — see the note in crosswalk/page.js.
export async function generateMetadata() {
    const { meta } = getContent('principles');
    return pageMetadata(meta, '/principles');
}

/**
 * /principles — the UN Open Source Principles, storyscroller layout
 * (2026-09). Reimplements a Claude Design handoff (a hero, the eight
 * principles as two vertical "stems" that grow with the read, a sticky
 * icon-swapping sidebar, the endorser directory) against this repo's own
 * content and tokens. All the actual markup/motion lives in
 * UnnycPrinciplesStoryscroller — this file's job is reading content and
 * shaping it into that component's props.
 *
 * ALL COPY LIVES IN content/principles.md. See docs/EDITING-CONTENT.md.
 *
 * `groupsGrid` already IS the two-stem split this design needs (Software:
 * open-by-default lead + 3; Community: contribute-back lead + 3) — the same
 * key the previous grid layout used — so this reads it via
 * principlesResolve() rather than inventing a second grouping to keep in
 * step with content/principles.md's single source of truth.
 */
export default function PrinciplesPage() {
    const doc = getContent('principles');
    const endorsers = getUnEndorsers();
    const { principlesDoc, sections } = doc;

    const gridSections = principlesResolve(principlesDoc, 'groupsGrid');
    const groups = gridSections.map((g, i) => {
        const toItem = (p, isLead) => {
            const section = sections[p.slug] || { html: '', blocks: [] };
            return {
                slug: p.slug,
                icon: p.icon,
                title: p.titleCanonical || p.title,
                lead: isLead,
                groupLabel: g.title,
                byline: isLead ? (p.body || [])[0] || p.desc : p.desc,
                html: section.html,
                gap: section.blocks[0] || null,
            };
        };
        return {
            id: String(i + 1),
            label: g.title,
            lead: toItem(g.lead, true),
            items: g.items.map((p) => toItem(p, false)),
        };
    });

    return (
        <>
            {/* The endorser directory. All 150 names are server-rendered, so
                the list describes what the page actually contains. */}
            <StructuredData
                data={endorserListLd({
                    organizations: endorsers?.organizations ?? [],
                    path: '/principles',
                    name: 'Organizations endorsing the UN Open Source Principles',
                    source: endorsers?.source,
                    sourceUrl: endorsers?.sourceUrl,
                })}
            />
            {/* The same list as a citable Dataset, pointing at the published
                JSON. Envelope comes from src/lib/datasets.js, so the licence and
                count here are the ones that file serves. */}
            <StructuredData
                data={datasetLd({ dataset: DATASETS['un-endorsers'](), path: '/principles' })}
            />
            <HeaderHeightVar />

            <UnnycPrinciplesStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.heroTitle,
                    ledeHtml: inlineMd(doc.lede),
                }}
                groups={groups}
                endorsers={{ organizations: endorsers?.organizations, copy: doc.endorsers }}
            />
            {/* Sibling of the storyscroller, not inside it: UnnycKeepGoing is a
                SERVER component (it reads its own copy via getContent) and the
                storyscroller is 'use client'. It drops the link to this page. */}
            <UnnycKeepGoing currentPath="/principles" />
        </>
    );
}
