export const config = {
    // Backend URL — Next.js Route Handlers use this server-side only
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8080',

    // Public vars — safe to expose to browser (NEXT_PUBLIC_ prefix)
    appName:     process.env.NEXT_PUBLIC_APP_NAME    ?? 'PayTrack Pro',
    appVersion:  process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development',

    // Helpers
    isDev:  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
    isProd: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
};
