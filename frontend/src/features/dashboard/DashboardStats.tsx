'use client';

import { useNews } from '@/hooks/useNews';
import { useInsights } from '@/hooks/useInsights';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function DashboardStats() {
  const { data: newsData } = useNews(1, 1);
  const { data: insightsData } = useInsights(1, 1);
  const { data: campaignsData } = useCampaigns(1, 1);

  const stats = [
    {
      label: 'News Items',
      value: newsData?.pagination?.total ?? 0,
      color: 'bg-blue-500',
    },
    {
      label: 'AI Insights',
      value: insightsData?.pagination?.total ?? 0,
      color: 'bg-purple-500',
    },
    {
      label: 'Campaigns',
      value: campaignsData?.pagination?.total ?? 0,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">
                {stat.value}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
