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
const TITLE = 'LangPass — Lock the apps. Learn the language.';
const DESCRIPTION =
  'LangPass locks the apps that eat your nights until you have done your language reps. Five quick exercises buy 30 minutes of phone time, then the wall comes back. A real Screen Time fare gate on your worst habit — German, Spanish, Portuguese and more.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s · LangPass',
  },
  description: DESCRIPTION,
  keywords: [
    'language learning app',
    'learn German',
    'app blocker',
    'screen time',
    'focus app',
    'digital wellbeing',
    'vocabulary trainer',
    'CEFR German A1',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'LangPass',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'LangPass — lock the apps, learn the language.' }],
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
  category: 'education',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
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
