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
};

export default nextConfig;
