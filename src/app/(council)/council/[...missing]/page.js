import { notFound } from 'next/navigation';

/* Twin of src/app/(un)/[...missing]/page.js — read that one. Unknown paths on
 * council.opensource.nyc are rewritten to /council/<path>; this catch-all claims
 * them for the Council group so the 404 renders inside the Council layout. */
export default function Missing() {
    notFound();
}
