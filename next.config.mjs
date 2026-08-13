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
