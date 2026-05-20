import type { Metadata }  from 'next';
import { Inter }           from 'next/font/google';
import Providers           from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PayTrack Pro — Payment Transaction Dashboard',
  description: 'Real-time payment transaction monitoring system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Providers>
        <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">🏦 PayTrack Pro</h1>
          <span className="text-blue-200 text-sm">Payments Technology Dashboard</span>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </Providers>
      </body>
      </html>
  );
}