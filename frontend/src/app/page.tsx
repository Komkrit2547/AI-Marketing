'use client';

import DashboardStats from '@/features/dashboard/DashboardStats';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useNews } from '@/hooks/useNews';
// import { campaignsService } from '@/services/campaigns';
// import InsightList from '@/features/insights/InsightList';
// import NewsList from '@/features/news/NewsList';

export default function HomePage() {
  const {data: campaignsData} = useCampaigns();
  const {data: newsData} = useNews();

  const campaigns = campaignsData?.data ?? [];
  const news = newsData?.data ?? [];
  
  const totalShops = 0; // ร้านทั้งหมด รอ Backend ร้านค้า
  const totalTrends = news.length; // จำนวนข่าวทั้งหมด
  const totalCampaigns = campaignsData?.pagination?.total ?? 0; //จำนวน Campaign ทั้งหมด ใช้ pagination.total เพื่อรองรับข้อมูลหลายหน้า

  const totalAiInsights = campaigns.filter(
    (campaign) => campaign.status === 'draft'
  ).length; //AI Drafts

  const topShops: {
    id: number;
    name: string;
  }[] = []; // ร้านยอดฮิต

  const keywords: string[] = []; // Keyword Cloud


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

            <div className="min-h-[250px] rounded-2xl bg-[#F1EFE8] flex items-center justify-center">

              {keywords.length === 0 ? (
                <p className="text-gray-400">
                  No keyword data available
                </p>
              ) : (
                <div className="flex flex-wrap gap-3 p-6">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-white px-4 py-2 rounded-full text-[#434553] shadow-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
