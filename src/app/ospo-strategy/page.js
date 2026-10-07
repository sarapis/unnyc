import UnnycOspoStoryscroller from '@/components/unnyc/primer/UnnycOspoStoryscroller';
import './ospo-strategy.css';
/* The "Let's keep going" band's look. ⚠ Shared with the other storyscroller
 * routes — page CSS is per-route, so every route that renders UnnycKeepGoing
 * must import it or the band is unstyled on a fresh load.
 * See src/app/keep-going.css. */
import '../keep-going.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycKeepGoing from '@/components/unnyc/primer/UnnycKeepGoing';
import { getContent, getOspoCatalogue, getOspoPlaybooks, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import StructuredData from '@/components/unnyc/StructuredData';
import { articleLd } from '@/lib/structured-data';

export async function generateMetadata() {
    const { meta } = getContent('ospo-strategy');
    return pageMetadata(meta, '/ospo-strategy');
}

/**
 * Each city's Playbooks card opens on the same photo its case study uses on
 * /success — read from content/success.md's `cases[].banner`, keyed by the
 * shared id (`munich` in both files), so the two pages can't show different
 * images for one city. A city with no case study simply has no banner.
 */
function withBanners(catalogue) {
    const banners = Object.fromEntries(
        (getContent('success').cases ?? []).map((c) => [c.id, c.banner]).filter(([, b]) => b?.src),
    );
    return catalogue.map((entry) => ({ ...entry, banner: banners[entry.case.id] ?? null }));
}

/**
 * /ospo-strategy — the self-contained case for an Open Source Program Office
 * inside New York City government: the per-city Playbooks (fact card + an
 * expandable catalogue of every source, one JSON file per city), an executive
 * summary presented as an official memo (also printable at
 * /ospo-strategy/document), a longer policy brief, and the supporting links a
 * working group would need. Sibling of the other storyscrollers — same hero,
 * sticky rail, reveal system and foot band.
 *
 * ALL COPY LIVES IN content/ospo-strategy.md; every city's facts and sources
 * in content/ospo-catalogue/<city>.json. See docs/EDITING-CONTENT.md. The
 * memo header and the recommendations are read by BOTH this page and the
 * printable, so they stay one text.
 */
export default function OspoStrategyPage() {
    const doc = getContent('ospo-strategy');
    const { summary, brief } = doc.sections;
    const catalogue = withBanners(getOspoCatalogue());
    const ranked = getOspoPlaybooks();

    return (
        <>
            <StructuredData
                data={articleLd({
                    path: '/ospo-strategy',
                    headline: doc.meta.ogTitle,
                    description: doc.meta.description,
                })}
            />
            <HeaderHeightVar />
            <UnnycOspoStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.title,
                    ledeHtml: inlineMd(doc.lede),
                    documentCta: doc.summary.documentCta,
                }}
                railItems={doc.sectionNav}
                playbooks={{
                    ...doc.playbooks,
                    ledeHtml: inlineMd(doc.playbooks.lede),
                    cases: catalogue,
                    /* The ranked directory above the cards; null when the JSON
                       is absent. An entry's case links to its card only when
                       that case has one. */
                    directory: ranked
                        ? {
                              ...doc.playbooks.directory,
                              ledeHtml: inlineMd(doc.playbooks.directory?.lede),
                              items: ranked.items,
                              missing: ranked.missing,
                              caseIds: catalogue.map((e) => e.case.id),
                          }
                        : null,
                }}
                memo={doc.memo}
                summary={{
                    title: doc.summary.title,
                    ledeHtml: inlineMd(doc.summary.lede),
                    introHtml: summary.html,
                    blocks: summary.blocks,
                    recommendationsTitle: doc.summary.recommendationsTitle,
                    recommendations: doc.summary.recommendations,
                    documentCta: doc.summary.documentCta,
                    signCta: doc.summary.signCta,
                }}
                brief={{
                    title: doc.brief.title,
                    ledeHtml: inlineMd(doc.brief.lede),
                    introHtml: brief.html,
                    blocks: brief.blocks,
                }}
                resources={{
                    title: doc.resources.title,
                    ledeHtml: inlineMd(doc.resources.lede),
                    groups: doc.resources.groups,
                }}
            />
            {/* Sibling of the storyscroller, not inside it: UnnycKeepGoing is a
                SERVER component (it reads its own copy via getContent) and the
                storyscroller is 'use client'. It drops the link to this page. */}
            <UnnycKeepGoing currentPath="/ospo-strategy" />
        </>
    );
}
