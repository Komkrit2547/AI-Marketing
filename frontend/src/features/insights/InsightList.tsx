'use client';

import { useInsights } from '@/hooks/useInsights';

export default function InsightList() {
  const { data, isLoading, error } = useInsights();

  if (isLoading) return <div className="text-gray-500">Loading insights...</div>;
  if (error) return <div className="text-red-500">Error loading insights</div>;

  const insights = data?.data ?? [];

  return (
    <div className="space-y-4">
      {insights.length === 0 && (
        <p className="text-gray-500">No AI insights yet. n8n workflow will generate them.</p>
      )}
      {insights.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <p className="text-gray-700 mt-2 text-sm">{item.summary}</p>
          {item.recommendation && (
            <div className="mt-3 bg-blue-50 rounded p-3">
              <p className="text-sm font-medium text-blue-800">Recommendation:</p>
              <p className="text-sm text-blue-700">{item.recommendation}</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
