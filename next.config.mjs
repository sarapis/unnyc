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
            // opensource.nyc became the primary domain on 2026-08-19; both
            // hostnames point at this one Vercel project, so the old one is
            // folded into the new one here rather than at the DNS layer.
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
                destination: 'https://opensource.nyc/:path*',
                permanent: false,
            },
            // www folds into the apex. Both are attached to this Vercel project
            // and www was answering 200, so the site was reachable on two
            // hostnames serving identical content — and this app emits NO
            // canonical tag on any route, so nothing told a crawler which one
            // wins. One host answering 200 is the fix that does not require
            // adding canonicals first.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.opensource.nyc' }],
                destination: 'https://opensource.nyc/:path*',
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
