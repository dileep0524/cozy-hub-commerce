import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import EnquiryTable from '@/components/admin/EnquiryTable';
import { getEnquiries } from '@/services/admin';

export default function Enquiries() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 });
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = useCallback(async (params) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) return;

    setLoading(true);
    try {
      const res = await getEnquiries({ page: params.page, limit: 15, status: params.status, search: params.search });
      const result = res.data.data;
      setData(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.total_pages || 1);
      setPage(result.page || 1);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries(filters);
  }, [fetchEnquiries, filters]);

  const handleFilter = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <Head>
        <title>Enquiries — CozyHub Admin</title>
      </Head>
      <AdminLayout title="Enquiries">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Enquiries</h2>
            <p className="text-sm text-gray-500">{total} total enquiries</p>
          </div>
        </div>
        <EnquiryTable
          data={data}
          total={total}
          page={page}
          totalPages={totalPages}
          loading={loading}
          onPageChange={handlePageChange}
          onFilter={handleFilter}
        />
      </AdminLayout>
    </>
  );
}
