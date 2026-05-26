/** @type {import('next').NextConfig} */
const nextConfig = {

    // ── ESLint — ignore during Vercel build completely ────────────
    // ESLint runs on commit via Husky instead (pre-commit hook)
    eslint: {
        ignoreDuringBuilds: true,
    },

    // ── TypeScript — still check types at build time ──────────────
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