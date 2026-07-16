import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'GharSathi - Home Services Marketplace',
  description: 'Safe | Trusted | Verified | On Time - Book home services with confidence. Plumbing, electrical, carpentry, cleaning & more.',
  keywords: 'home services, plumber, electrician, carpenter, cleaning, painting, India',
  openGraph: {
    title: 'GharSathi - Home Services Marketplace',
    description: 'Safe | Trusted | Verified | On Time - Book home services with confidence.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GharSathi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GharSathi - Home Services Marketplace',
    description: 'Safe | Trusted | Verified | On Time - Book home services with confidence.',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
