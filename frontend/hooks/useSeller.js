import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSellerStore from '@/store/sellerStore';

export function useSeller() {
  const router = useRouter();
  const { seller, isAuthenticated, hydrate } = useSellerStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/seller/login');
    }
  }, [ready, isAuthenticated, router]);

  return { seller, ready: ready && isAuthenticated };
}
