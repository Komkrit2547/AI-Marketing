import DashboardStats from '@/features/dashboard/DashboardStats';
import InsightList from '@/features/insights/InsightList';
import NewsList from '@/features/news/NewsList';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-500">AI-powered marketing insights for your local business.</p>
      </div>

      <DashboardStats />

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest AI Insights</h3>
        <InsightList />
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent News</h3>
        <NewsList />
      </section>
    </div>
  );
}
