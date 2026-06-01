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
      label: 'ร้านทั้งหมด',
      value: 0,
      icon: 'storefront',
    },
    {
      label: 'เทรนด์/เดือน',
      value: newsData?.pagination?.total ?? 0,
      icon: 'Monitoring',
    },
    {
      label: 'แคมเปญทั้งหมด',
      value: campaignsData?.pagination?.total ?? 0,
      icon: 'Campaign',
    },
    {
      label: 'AI Intelligence',
      value: insightsData?.pagination?.total ?? 0,
      icon: 'auto_awesome',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[#8B1E12]">
                {stat.icon}
              </span>
              {/* <span className="text-white text-xl font-bold">
                {stat.value}
              </span> */}
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
