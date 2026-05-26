/** @type {import('next').NextConfig} */
const nextConfig = {

    // ── ESLint — warn but don't fail build ───────────────────────
    // Errors still fail. Warnings (like no-img-element) do not.
    eslint: {
        ignoreDuringBuilds: false,
    },

    // ── TypeScript — errors still fail build ─────────────────────
    typescript: {
        ignoreBuildErrors: false,
    },

    // ── Images — allow SVG ────────────────────────────────────────
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            { protocol: 'https', hostname: '**.railway.app' },
            { protocol: 'https', hostname: '**.vercel.app' },
        ],
    },
};

export default nextConfig;