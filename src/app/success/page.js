import UnnycSuccessStoryscroller from '@/components/unnyc/primer/UnnycSuccessStoryscroller';
import './success.css';
/* The "Let's keep going" band's look. ⚠ Shared with the other three
 * storyscroller routes — page CSS is per-route, so every route that renders
 * UnnycKeepGoing must import it or the band is unstyled on a fresh load.
 * See src/app/keep-going.css. */
import '../keep-going.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import UnnycKeepGoing from '@/components/unnyc/primer/UnnycKeepGoing';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

/** Marker an editor writes on its own line to place the stats row mid-prose
 * (see content/success.md) — `marked` renders a lone `{{stats}}` line as its
 * own paragraph, so splitting on the literal `<p>{{stats}}</p>` string cuts
 * the case's prose in two around it. */
const STATS_MARKER = '<p>{{stats}}</p>';

export async function generateMetadata() {
    const { meta } = getContent('success');
    return pageMetadata(meta, '/success');
}

/**
 * /success — "what success looks like", storyscroller layout (2026-09).
 * Reimplements a Claude Design handoff: a hero (with a dashed "New York
 * City — Next" card standing in for a case study NYC hasn't written yet),
 * Barcelona/Munich/Paris as full narrative case studies beside a sticky
 * icon-swapping sidebar, and a "Recent Successes" focus carousel. Sibling
 * of the other storyscrollers — same palette and sidebar shape.
 *
 * ALL COPY LIVES IN content/success.md. See docs/EDITING-CONTENT.md.
 */
export default function SuccessPage() {
    const doc = getContent('success');

    const cases = doc.cases.map((c, i) => {
        const html = doc.sections[c.id]?.html ?? '';
        const [before, after] = html.includes(STATS_MARKER) ? html.split(STATS_MARKER) : [html, ''];
        return {
            id: c.id,
            title: c.title,
            bannerSrc: c.banner?.src,
            bannerAlt: c.banner?.alt,
            beforeHtml: before,
            afterHtml: after,
            stats: c.stats,
            sourcesHtml: c.sources?.length
                ? c.sources.map((s) => inlineMd(s)).join(' · ')
                : null,
            priority: i === 0,
        };
    });

    const railItems = [
        ...doc.cases.map((c) => ({ id: c.id, label: c.title.split(':')[0] })),
        { id: 'cases', label: 'Recent Successes' },
    ];

    return (
        <>
            <HeaderHeightVar />
            <UnnycSuccessStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.heroTitle,
                    ledeHtml: inlineMd(doc.lede),
                    nycLabel: doc.heroNycLabel,
                    nycSublabel: doc.heroNycSublabel,
                }}
                railItems={railItems}
                cases={cases}
                caseGrid={doc.caseGrid}
            />
            {/* Sibling of the storyscroller, not inside it: UnnycKeepGoing is a
                SERVER component (it reads its own copy via getContent) and the
                storyscroller is 'use client'. It drops the link to this page. */}
            <UnnycKeepGoing currentPath="/success" />
        </>
    );
}
