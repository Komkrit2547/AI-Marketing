import InsightList from '@/features/insights/InsightList';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <p className="text-gray-500">AI-generated marketing insights and recommendations.</p>
      </div>
      <InsightList />
    </div>
  );
}
