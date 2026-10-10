import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Trading Analyst Pro',
  description: 'AI-powered trading analysis dashboard for market structure, technical indicators and paper trading.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
