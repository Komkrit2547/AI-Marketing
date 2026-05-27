'use client';

import { useCampaigns } from '@/hooks/useCampaigns';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

export default function CampaignList() {
  const { data, isLoading, error } = useCampaigns();

  if (isLoading) return <div className="text-gray-500">Loading campaigns...</div>;
  if (error) return <div className="text-red-500">Error loading campaigns</div>;

  const campaigns = data?.data ?? [];

  return (
    <div className="space-y-4">
      {campaigns.length === 0 && (
        <p className="text-gray-500">No campaigns yet.</p>
      )}
      {campaigns.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                statusColors[item.status] || 'bg-gray-100'
              }`}
            >
              {item.status}
            </span>
          </div>
          {item.description && (
            <p className="text-gray-700 text-sm">{item.description}</p>
          )}
          {item.caption && (
            <div className="mt-2 bg-gray-50 rounded p-2">
              <p className="text-sm text-gray-600 italic">&ldquo;{item.caption}&rdquo;</p>
            </div>
          )}
          {item.couponText && (
            <div className="mt-2 bg-purple-50 rounded p-2">
              <p className="text-sm text-purple-700 font-medium">Coupon: {item.couponText}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
