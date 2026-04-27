import Header from './Header';
import Footer from './Footer';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

export default function Layout({ children }) {
  useVisitorTracking();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
