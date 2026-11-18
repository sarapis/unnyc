import { notFound } from 'next/navigation';

/* ⚠ THIS IS HOW AN UNKNOWN URL GETS THE SITE'S NAV ON ITS 404.
 * Since 2026-11 there are two root layouts — (un) and (council) — and no
 * app/layout.js, so a URL matching no route has no layout to render inside and
 * Next serves a bare 404. This catch-all claims every unmatched path for the UN
 * site and calls notFound(), which renders Next's 404 INSIDE this group's
 * layout, as production always did. The Council site has its own twin at
 * (council)/council/[...missing]; its static `council` segment wins for
 * Council paths. */
export default function Missing() {
    notFound();
}
