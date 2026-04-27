import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', borderRadius: '10px' },
          success: { iconTheme: { primary: 'rgb(2,132,199)', secondary: '#fff' } },
        }}
      />
    </>
  );
}
