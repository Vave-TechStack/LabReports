import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: {
    default: 'MediLab Diagnostics - Advanced Blood Testing Laboratory',
    template: '%s | MediLab Diagnostics',
  },
  description: "India's most trusted blood diagnostic laboratory with NABL accreditation. Book blood tests online, home collection available, accurate results in 6-24 hours.",
  keywords: ['blood test', 'diagnostic lab', 'pathology lab', 'health checkup', 'blood test at home', 'MediLab', 'lab report'],
  authors: [{ name: 'MediLab Diagnostics' }],
  creator: 'MediLab Diagnostics',
  publisher: 'MediLab Diagnostics',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://medilab.com',
    siteName: 'MediLab Diagnostics',
    title: 'MediLab Diagnostics - Advanced Blood Testing Laboratory',
    description: "India's most trusted blood diagnostic laboratory. Book online, home collection, accurate reports.",
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediLab Diagnostics',
    description: "India's most trusted blood diagnostic laboratory.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F766E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
