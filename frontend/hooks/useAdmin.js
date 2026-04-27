import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAdminStore from '@/store/adminStore';

export function useAdmin() {
  const router = useRouter();
  const { admin, hydrate } = useAdminStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { admin, ready };
}
