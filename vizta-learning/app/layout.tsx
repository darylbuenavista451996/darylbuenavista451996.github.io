import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const GA_ID = 'G-7547KXG4HX';

export const metadata: Metadata = {
  title: 'Vizta Learning',
  description: 'Self-paced Media Arts learning for Grade 9 and Grade 10.',
  // Favicon is provided by app/icon.png (Next.js file convention).
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b2a4a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
      {/* Google Analytics (gtag.js). Same GA4 property as the public site so
          student lesson traffic and site traffic land in one place. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </html>
  );
}
