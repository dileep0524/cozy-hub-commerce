import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Chart({ title, data, color, dataKey = 'count' }) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No data for this period
        </div>
      )}
    </div>
  );
}

export default function AnalyticsCharts({ analytics, loading }) {
  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-48 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Chart
        title="Visitors — Last 7 Days"
        data={analytics?.visitors_per_day}
        color="rgb(2,132,199)"
      />
      <Chart
        title="Enquiries — Last 7 Days"
        data={analytics?.enquiries_per_day}
        color="#10b981"
      />
    </div>
  );
}
