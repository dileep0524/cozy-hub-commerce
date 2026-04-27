import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trackVisit } from '@/services/visitor';

export function useVisitorTracking() {
  const router = useRouter();

  useEffect(() => {
    trackVisit(router.pathname);
  }, [router.pathname]);
}
