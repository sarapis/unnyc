import Link from 'next/link';

import { getContent } from '@/lib/content';

/**
 * UnnycKeepGoing — the "Let's keep going" band at the foot of /start,
 * /principles, /crosswalk and /success.
 *
 * Same shape as /resources' older `foot:` band (see UnnycResourcesStoryscroller
 * and the `foot:` block in content/resources.md), which is where the pattern
 * comes from. ⚠ That one is NOT this component: it keeps its own wording and
 * its own shorter list. Two implementations of one band is a smell; unifying
 * them is a one-line change plus deleting that block, but it would also change
 * /resources' wording and add /principles to its links, so it is an owner
 * decision rather than a tidy-up.
 *
 * ⚠ ALL COPY AND EVERY DESTINATION LIVE ONCE, in content/keep-going.md. This
 * component drops the row whose `href` matches the page it is rendered on, so
 * a page never links to itself. Four near-identical `foot:` blocks in four
 * markdown files is the shape that let the homepage contradict /crosswalk's
 * own reason titles within a day — see CLAUDE.md.
 *
 * ⚠ A SERVER COMPONENT, deliberately: it calls `getContent`, which is
 * server-only (`node:fs`). That is what keeps the call sites to one line each.
 * Never add `'use client'` here — import it from a client storyscroller and
 * the build breaks on the fs import. It is rendered as a SIBLING after each
 * storyscroller in that route's `page.js`, not inside one, for the same reason.
 *
 * `getContent` is called inside the component rather than at module scope
 * because the markdown is not a module dependency — at module scope it is
 * evaluated once per dev-server process and edits need a restart to appear.
 */
export default function UnnycKeepGoing({ currentPath }) {
    const doc = getContent('keep-going');
    const links = (doc.links || []).filter((l) => l.href !== currentPath);
    if (!links.length) return null;

    return (
        <section className="unnyc-keep-going">
            <div className="unnyc-container unnyc-container--narrow">
                <p data-reveal="1">{doc.text}</p>
                <div className="unnyc-keep-going__links" data-reveal="1" data-delay="100">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`unnyc-keep-going__btn unnyc-keep-going__btn--${l.style}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
