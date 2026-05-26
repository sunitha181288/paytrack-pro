import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PayTrack Pro — Payment Transaction Dashboard',
    description: 'Real-time payment transaction monitoring system built for Payments Technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Providers>

            {/* ── Top Navigation Bar ── */}
            <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">

                <div className="flex items-center gap-3">
                    <img
                        src="/images/icons/bank.svg"
                        alt="PayTrack Pro Bank Icon"
                        width={36}
                        height={36}
                    />
                    <div>
                        <h1 className="text-xl font-bold leading-none">PayTrack Pro</h1>
                        <p className="text-blue-300 text-xs leading-none mt-0.5">
                            Payments Technology
                        </p>
                    </div>
                </div>

                {/* Right — Status indicator */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-blue-200 text-xs">Live</span>
                    </div>
                    <span className="text-blue-400 text-xs hidden md:block">
                 Payments Technology Portfolio
              </span>
                </div>

            </nav>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-gray-100 mt-12 py-6 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/icons/bank.svg"
                            alt="PayTrack Pro"
                            width={20}
                            height={20}
                        />
                        <span className="text-gray-400 text-xs">
                  PayTrack Pro — Built for Payments Technology
                </span>
                    </div>
                    <span className="text-gray-300 text-xs">
                Java · Spring Boot · Kafka · Next.js 14 · TypeScript
              </span>
                </div>
            </footer>

        </Providers>
        </body>
        </html>
    );
}
