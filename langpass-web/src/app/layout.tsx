import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const SITE = 'https://langpass.app';
const TITLE = 'LangPass — Recovery, one good day at a time';
const DESCRIPTION =
  'A private AI injury-recovery companion. Tap where it hurts, check in each morning, get a plan tuned to how you feel — and keep your comeback as a beautifully illustrated journey. Your data never leaves your phone.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s · LangPass',
  },
  description: DESCRIPTION,
  keywords: [
    'injury recovery app',
    'rehab exercises',
    'physical therapy companion',
    'pain tracking',
    'recovery plan',
    'tennis elbow exercises',
    'AI physiotherapy',
    'sports injury rehab',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'LangPass',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'LangPass — recovery, one good day at a time' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  appleWebApp: { title: 'LangPass' },
  category: 'health & fitness',
};

export const viewport: Viewport = {
  themeColor: '#F6F3EE',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
