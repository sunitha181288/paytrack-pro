function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        // Clear error
        throw new Error(
            `Missing required environment variable: ${key}\n` +
            `Add it to .env.local (local) or Vercel dashboard (production)`
        );
    }
    return value;
}

export const config = {
    // Required — app breaks immediately if missing
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8080',

    // Public vars — safe to expose to browser
    appName:    process.env.NEXT_PUBLIC_APP_NAME    ?? 'PayTrack Pro',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
    environment:process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development',

    // Helper
    isDev:  process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
    isProd: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
};