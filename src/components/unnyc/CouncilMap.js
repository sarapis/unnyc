'use client';

import dynamic from 'next/dynamic';

/* The same map / and /start draw, client-only for the same reason they give
 * (176 country paths belong in a cached JS chunk, not in every HTML response —
 * see the note at the top of UnnycWorldMap). `ssr: false` is only allowed in a
 * client component, hence this two-line wrapper for the Council homepage, which
 * is otherwise a server component. */
const UnnycWorldMap = dynamic(() => import('./primer/UnnycWorldMap'), { ssr: false });

export default function CouncilMap(props) {
    return <UnnycWorldMap {...props} />;
}
