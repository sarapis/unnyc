/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Payload CMS media (endorser logos / any future CMS imagery).
            {
                protocol: 'https',
                hostname: 'next.sarapis.org',
                pathname: '/**',
            },
        ],
    },
    async redirects() {
        return [
            // The campaign moved to the un.opensource.nyc SUBDOMAIN on
            // 2026-08-20, so the apex is free for a future opensource.nyc
            // homepage. Every other hostname folds into the subdomain.
            //
            // ⚠ EACH LEGACY HOST POINTS AT THE FINAL DESTINATION, never at
            // the apex, so nothing chains two redirects.
            //
            // ⚠ THE APEX RULE IS TEMPORARY BY DESIGN and lives here only
            // while this app owns the apex. The day opensource.nyc becomes
            // its own site, that will be a different Vercel project, apex
            // DNS repoints at it, and this rule becomes dead code — delete
            // it then rather than leaving a campaign app routing an apex it
            // no longer serves.
            //
            // ⚠ 307, NOT 308, deliberately. A permanent redirect is cached hard
            // by browsers and is very difficult to walk back — if anything is
            // wrong with opensource.nyc, a 308 would strand every visitor who
            // had already hit it. Flip `permanent` to true once the new domain
            // has been serving cleanly for a few days; SEO wants the 308
            // eventually, but not on day one of a cutover.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'unnyc.wegov.nyc' }],
                destination: 'https://un.opensource.nyc/:path*',
                permanent: false,
            },
            // www folds into the apex. Both are attached to this Vercel project
            // and www was answering 200, so the site was reachable on two
            // hostnames serving identical content, with nothing telling a
            // crawler which one wins. One host answering 200 was the fix that
            // did not need canonicals first — and every route now states its
            // own as well (2026-08-20, src/lib/seo.js), which matters because
            // these are 307s: a temporary redirect passes no ranking signal, so
            // the canonical is the durable half of the statement.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'opensource.nyc' }],
                destination: 'https://un.opensource.nyc/:path*',
                permanent: false,
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.opensource.nyc' }],
                destination: 'https://un.opensource.nyc/:path*',
                permanent: false,
            },
            // The eight principles became their own top-level page on 2026-08-13.
            // The printable one-pager moved with them, from /start/principles to
            // /principles/document — it had been linked from the old
            // /start#principles section and may be linked from outside the site.
            {
                source: '/start/principles',
                destination: '/principles/document',
                permanent: true,
            },
            // The principles section left /start in the same change. Anything
            // pointing at the old anchor lands on the page that now owns it.
            // (A fragment is not sent to the server, so this catches the path
            // only — the anchor is dropped, which is the right outcome here.)
            {
                source: '/start/principles/:path*',
                destination: '/principles/document',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
