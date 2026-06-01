import DashboardStats from '@/features/dashboard/DashboardStats';
// import InsightList from '@/features/insights/InsightList';
// import NewsList from '@/features/news/NewsList';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-500">AI-powered marketing insights for your local business.</p>
      </div>

      <DashboardStats />

      {/* <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest AI Insights</h3>
        <InsightList />
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent News</h3>
        <NewsList />
      </section> */}
      {/* Top Shop */}
        <div className="lg:col-span-5">
          <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8 h-full">
            <span className="material-symbols-outlined text-[#8B1E12] text-[32px]">
              Local_Fire_Department
            </span>

            <h2 className="text-3xl font-semibold text-[#434553]">
              ร้านยอดฮิต
            </h2>

            <div className="space-y-4 text-lg text-[#5D6270]">
              <p>1. -</p>
              <p>2. -</p>
              <p>3. -</p>
              <p>4. -</p>
              <p>5. -</p>
            </div>
          </div>
        </div>

        {/* Keyword Cloud */}
        <div className="lg:col-span-12">
          <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#8B1E12] text-[32px]">
                search
              </span>

              <h2 className="text-3xl font-semibold text-[#434553]">
                กลุ่มคำยอดฮิต
              </h2>
            </div>

            <div className="h-[250px] rounded-2xl bg-[#F1EFE8] flex items-center justify-center">
              <p className="text-gray-400">
                Keyword Cloud
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
