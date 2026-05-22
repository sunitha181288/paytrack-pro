/** @type {import('next').NextConfig} */
const nextConfig = {

    // ── Allow SVG files via next/image ────────────────────────────
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.railway.app',
            },
            {
                protocol: 'https',
                hostname: '**.vercel.app',
            },
        ],
    },

    typescript: {
        ignoreBuildErrors: false,
    },

    eslint: {
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;