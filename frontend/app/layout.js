import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'GharSathi - Home Services Marketplace',
  description: 'Safe | Trusted | Verified | On Time - Book home services with confidence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
