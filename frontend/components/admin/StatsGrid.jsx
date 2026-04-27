import {
  UsersIcon,
  InboxIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

export default function StatsGrid({ analytics, loading }) {
  const stats = [
    {
      label: 'Total Visitors',
      value: analytics?.total_visitors ?? 0,
      icon: UsersIcon,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Total Enquiries',
      value: analytics?.total_enquiries ?? 0,
      icon: InboxIcon,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100',
    },
    {
      label: 'Conversion Rate',
      value: analytics ? `${analytics.conversion_rate.toFixed(1)}%` : '0%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
    {
      label: 'New Enquiries',
      value: analytics?.new_enquiries ?? 0,
      icon: BellAlertIcon,
      color: 'bg-yellow-50 text-yellow-600',
      border: 'border-yellow-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div key={s.label} className={`card border ${s.border}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
