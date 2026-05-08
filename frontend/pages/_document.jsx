import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1a1c1e" />
        <meta name="description" content="SettleSmart - Zero-onboarding group expense splitter" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%231f2937' width='192' height='192'/><text x='50%' y='50%' font-size='100' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='central'>💰</text></svg>" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%231f2937' width='100' height='100'/><text x='50' y='50' font-size='60' fill='white' text-anchor='middle' dominant-baseline='central'>💰</text></svg>" />
        
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'} />
        
        {/* Font optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            }
          `
        }} />
      </body>
    </Html>
  );
}
