import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#1e40af', color: '#fff', borderRadius: '12px' },
        }}
      />
    </Layout>
  );
}
