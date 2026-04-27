import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsGrid from '@/components/admin/StatsGrid';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { getAnalytics } from '@/services/admin';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) return;

    getAnalytics()
      .then((res) => setAnalytics(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — CozyHub Admin</title>
      </Head>
      <AdminLayout title="Dashboard">
        <div className="space-y-8">
          <StatsGrid analytics={analytics} loading={loading} />
          <AnalyticsCharts analytics={analytics} loading={loading} />
        </div>
      </AdminLayout>
    </>
  );
}
