'use client';

import DashboardStats from '@/features/dashboard/DashboardStats';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useNews } from '@/hooks/useNews';
import { useDashboard } from '@/hooks/useDashboard';
import { useState, useMemo } from 'react';

export default function HomePage() {
  const [selectedMonthStr, setSelectedMonthStr] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  const dashboardParams = useMemo(() => {
    if (!selectedMonthStr) return undefined;
    const [yearStr, monthStr] = selectedMonthStr.split('-');
    return {
      year: parseInt(yearStr, 10),
      month: parseInt(monthStr, 10),
    };
  }, [selectedMonthStr]);

  const {data: campaignsData} = useCampaigns();
  const {data: newsData} = useNews();
  const {data: dashboardData} = useDashboard(dashboardParams);
  const campaigns = campaignsData?.data ?? [];
  
  const totalShops = dashboardData?.totalShops ?? 0; // ร้านทั้งหมดจาก Backend
  const totalTrends = dashboardData?.currentMonthTrends ?? 0; // จำนวนเทรนด์ในเดือนนี้
  const totalCampaigns = dashboardData?.totalMonthlyCampaigns ?? 0; // จำนวน Campaign ของเดือนนี้
  const totalAiInsights = dashboardData?.totalMonthlyAiInsights ?? 0; // AI Drafts ของเดือนนี้

  const topShops = dashboardData?.topPopularShops ?? [];
  const keywords = dashboardData?.keywords ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#FBBF24] mb-1">Dashboard Overview</h2>
          <p className="text-[#fff]-500">AI-powered marketing insights for your local business.</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 py-2 px-5 gap-3 hover:shadow-md transition-shadow duration-300">
            {/* Left Yellow Calendar Icon */}
            <span className="material-symbols-outlined text-[#FBBF24] text-[24px]">calendar_month</span>
            
            <input
              type="month"
              value={selectedMonthStr}
              onChange={(e) => setSelectedMonthStr(e.target.value)}
              className="appearance-none bg-transparent text-[#1e3a8a] font-medium text-[16px] outline-none cursor-pointer min-w-[130px] w-auto focus:ring-0 p-0 border-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer relative z-10"
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards — Full Width */}
      <DashboardStats 
        totalShops={totalShops}
        totalTrends={totalTrends}
        totalCampaigns={totalCampaigns}
        totalAiInsights={totalAiInsights}
      />

      {/* Bottom Section: Keyword Cloud (left) + Top Shops (right) */}
      <div className="grid grid-cols-12 gap-6">

        {/* กลุ่มคำยอดฮิต — Left */}
        <div className="col-span-12 xl:col-span-7">
          <div className="bg-white border border-gray-200 rounded-[24px] p-7 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5D1] to-[#FFDFA6] border border-[#FFE8A1] shadow-[0_4px_10px_rgba(251,191,36,0.15)] group-hover:from-[#FFD05B] group-hover:to-[#FF9D00] group-hover:shadow-[0_6px_16px_rgba(251,191,36,0.4)] group-hover:border-[#FFC145] transition-all duration-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#44403C] group-hover:text-[#27272A] text-[26px] transition-colors duration-300">
                  search
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#D97706] transition-colors duration-300">
                กลุ่มคำยอดฮิต
              </h2>
            </div>

            <div className="min-h-[250px] max-h-[350px] overflow-y-auto rounded-2xl bg-[#FAFAF8] relative group-hover:bg-[#FFFDF5] group-hover:shadow-inner transition-all duration-300">
              {keywords.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[250px]">
                  <p className="text-gray-400">
                    No keyword data available
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 p-6 justify-center content-start min-h-[250px]">
                  {keywords.map((keyword, index) => {
                    const colors = ['text-orange-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-red-500', 'text-yellow-600'];
                    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
                    
                    const color = colors[index % colors.length];
                    const size = sizes[(index * 3) % sizes.length];

                    return (
                      <span
                        key={keyword}
                        className={`${color} ${size} font-medium max-w-full break-words text-center leading-tight hover:scale-110 hover:drop-shadow-md transition-all duration-300 cursor-pointer select-none`}
                      >
                        {keyword}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ร้านยอดฮิต — Right */}
        <div className="col-span-12 xl:col-span-5">
          <div className="bg-white border border-gray-200 rounded-[24px] p-7 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5D1] to-[#FFDFA6] border border-[#FFE8A1] shadow-[0_4px_10px_rgba(251,191,36,0.15)] group-hover:from-[#FFD05B] group-hover:to-[#FF9D00] group-hover:shadow-[0_6px_16px_rgba(251,191,36,0.4)] group-hover:border-[#FFC145] transition-all duration-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#44403C] group-hover:text-[#27272A] text-[26px] transition-colors duration-300">
                  local_fire_department
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-[#D97706] transition-colors duration-300">
                ร้านยอดฮิต
              </h2>
            </div>

            {topShops.length === 0 ? (
              <div className="flex items-center justify-center h-[250px]">
                <p className="text-gray-400">
                  No shop data available
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {topShops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 hover:bg-orange-50 hover:shadow-sm cursor-pointer group/item"
                  >
                    {/* Numbered Badge */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] shadow-[0_2px_4px_rgba(244,196,77,0.3)] flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    {/* Shop Name */}
                    <span className="text-[16px] text-[#374151] font-medium group-hover/item:text-[#D97706] transition-colors">{shop.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
