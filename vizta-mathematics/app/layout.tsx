import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import RegisterSW from './RegisterSW';
import './globals.css';

const GA_ID = 'G-7547KXG4HX';

export const metadata: Metadata = {
  title: 'Vizta Mathematics',
  description: 'Self-paced Grade 9 Mathematics that works offline once opened.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b2a4a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <RegisterSW />
      </body>
      {/* Google Analytics (gtag.js). Same GA4 property as the rest of the site
          so student traffic lands in one place. */}
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
