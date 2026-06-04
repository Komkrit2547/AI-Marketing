'use client';

import DashboardStats from '@/features/dashboard/DashboardStats';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useNews } from '@/hooks/useNews';
import { useDashboard } from '@/hooks/useDashboard';
// import InsightList from '@/features/insights/InsightList';
// import NewsList from '@/features/news/NewsList';

export default function HomePage() {
  const {data: campaignsData} = useCampaigns();
  const {data: newsData} = useNews();
  const {data: dashboardData} = useDashboard();

  const campaigns = campaignsData?.data ?? [];
  const news = newsData?.data ?? [];
  
  const totalShops = dashboardData?.totalShops ?? 0; // ร้านทั้งหมดจาก Backend
  const totalTrends = dashboardData?.currentMonthTrends ?? 0; // จำนวนเทรนด์ในเดือนนี้
  const totalCampaigns = campaignsData?.pagination?.total ?? 0; //จำนวน Campaign ทั้งหมด ใช้ pagination.total เพื่อรองรับข้อมูลหลายหน้า

  const totalAiInsights = campaigns.filter(
    (campaign) => campaign.status === 'draft'
  ).length; //AI Drafts

  const topShops = dashboardData?.topPopularShops ?? []; // ร้านยอดฮิต 5 อันดับ

  const keywords = dashboardData?.keywords ?? []; // Keyword Cloud


  // //Backend มาแล้วค่อยใช้
  // const { data, isLoading, error } =
  //   seDashboard(selectedDate);

  // const stats = {
  //   totalShops: data?.totalShops ?? 0,
  //   totalTrends: data?.totalTrends ?? 0,
  //   totalCampaigns: data?.totalCampaigns ?? 0,
  //   totalAiInsights: data?.totalAiInsights ?? 0,

  //   const topShops = data?.topShops ?? [];
  //   const keywords = data?.keywords ?? [];
  // };


  // Placeholder รอ Backend
  // const stats = {
  //   totalShops: 0,
  //   totalTrends: 0,
  //   totalCampaigns: 0,
  //   totalAiInsights: 0,
  // }; 

  // const topShops: { id: number; name: string }[] = [];
  // const keywords: string[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-500">AI-powered marketing insights for your local business.</p>
      </div>

      {/* Top Shop */}
      <div className="grid grid-cols-12 gap-8">
        <div className = "col-span-12 xl:col-span-7" >
          <DashboardStats 
            totalShops={totalShops}
            totalTrends={totalTrends}
            totalCampaigns={totalCampaigns}
            totalAiInsights={totalAiInsights}
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <div className="bg-[#F8F6EF] border-2 border-[#A8A8A8] rounded-[30px] p-8 h-full" >
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#8B1E12] text-[32px]">
                Local_Fire_Department
              </span>

              <h2 className="text-3xl font-semibold text-[#434553]">
                ร้านยอดฮิต
              </h2>
            </div>

            {topShops.length === 0 ?(
              <div className="flex items-center justify-center h-[250px]">
                <p className="text-gray-400">
                  No shop data available
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-lg text-[#5D6270]">
                {topShops.map((shop, index) => (
                  <p key={shop.id}>
                    {index + 1}. {shop.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Keyword Cloud */}
        <div className="lg:col-span-12">
          <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-[#8B1E12] text-[35px]">
                search
              </span>

              <h2 className="text-3xl font-semibold text-[#434553]">
                กลุ่มคำยอดฮิต
              </h2>
            </div>

            <div className="min-h-[250px] rounded-2xl bg-[#F1EFE8] flex items-center justify-center relative overflow-hidden">

              {keywords.length === 0 ? (
                <p className="text-gray-400">
                  No keyword data available
                </p>
              ) : (
                <div className="flex flex-wrap gap-x-12 gap-y-8 p-10 justify-center items-center w-full h-full">
                  {keywords.map((keyword, index) => {
                    const colors = ['text-orange-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-red-500', 'text-yellow-600'];
                    const sizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
                    
                    const color = colors[index % colors.length];
                    const size = sizes[(index * 3) % sizes.length];
                    // Create a scattered look with margins
                    const marginTop = (index % 3 === 0) ? '-20px' : (index % 3 === 1) ? '30px' : '0px';

                    return (
                      <span
                        key={keyword}
                        className={`${color} ${size} font-medium hover:scale-125 transition-transform duration-300 cursor-default select-none`}
                        style={{ marginTop }}
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

      </div>
    </div>
  );
}
