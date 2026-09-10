import UnnycCrosswalkStoryscroller from '@/components/unnyc/primer/UnnycCrosswalkStoryscroller';
import './crosswalk.css';
import HeaderHeightVar from '@/components/unnyc/primer/HeaderHeightVar';
import { getContent, inlineMd } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

/** Each reason heading is `### N. Title` (see content/crosswalk.md); split
 * that into {id, n, title} once, up front, so the rail and the article
 * blocks stay in sync from one source instead of two. Falls back to the
 * raw label if a heading is ever written without a leading number. */
function reasonFromBlock(block, i) {
    const m = block.label.match(/^(\d+)\.\s*(.+)$/);
    const n = m ? Number(m[1]) : i + 1;
    return {
        id: `reason-${n}`,
        n,
        title: m ? m[2] : block.label,
        html: block.html,
    };
}

// Read per call, NOT once at module scope — see the note in crosswalk/
// page.js's own history: content/crosswalk.md isn't a module dependency, so
// a module-level getContent() call is evaluated once per server process and
// edits to the markdown wouldn't show up in `next dev` until a restart.
export async function generateMetadata() {
    const { meta } = getContent('crosswalk');
    return pageMetadata(meta, '/crosswalk');
}

/**
 * /crosswalk — "Open Source for NYC", storyscroller layout (2026-09).
 * Reimplements a Claude Design handoff: a hero, a sticky "Estimated Annual
 * Rent" card beside the intro argument, and the six reasons as a sticky
 * icon-swapping sidebar beside numbered article blocks. Sibling of the
 * /principles storyscroller — same palette, sidebar shape and motion
 * system, reimplemented here against this page's own content.
 *
 * ALL COPY LIVES IN content/crosswalk.md. See docs/EDITING-CONTENT.md.
 */
export default function CrosswalkPage() {
    const doc = getContent('crosswalk');
    const { sections } = doc;
    const reasons = sections.intro.blocks.map(reasonFromBlock);

    return (
        <>
            <HeaderHeightVar />
            <UnnycCrosswalkStoryscroller
                hero={{
                    kicker: doc.heroKicker,
                    titleHtml: doc.heroTitle,
                    ledeHtml: inlineMd(doc.lede),
                }}
                rentCard={doc.rentCard}
                intro={sections.intro.html}
                reasons={reasons}
            />
        </>
    );
}
