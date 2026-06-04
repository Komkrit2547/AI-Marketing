'use client';

import { Campaign } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
}; 

interface CampaignListProps {
  campaigns: Campaign[];
  onAction?: (id: string) => void;
  actionLabel?: string;
}

export default function CampaignList({
  campaigns,
  onAction,
  actionLabel,
}: CampaignListProps) {
  if (campaigns.length === 0){
    return (
      <div className = "bg-[#F8F6EF] border border-gray-400 rounded-[20px] h-[180px] flex items-center justify-center">
        <p className="text-gray-400">No campaigns yet</p>
      </div>
    );
  }

  return (
    <div className = "space-y-4">
      {campaigns.map((item) => (
        <div key = {item.id} className="bg-[#F8F6EF] border border-gray-300 rounded-[20px] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#434553]">{item.title}</h3>
            <span 
              className={`text-xs px-2 py-1 rounded-full font-medium ${
              statusColors[item.status] || 'bg-gray-100'
              }`}
            > 
              {item.title}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600">
              {item.description}
            </p>
          )}

          {item.caption && (
            <div className="mt-2 bg-gray-50 rounded p-2">
              <p className="text-sm italic text-gray-600">
                "{item.caption}"
              </p>
            </div>
          )}

          {item.couponText && (
            <div className="mt-2 bg-gray-50 rounded p-2">
              <p className="text-sm text-purple-700 font-medium">
                Coupon: {item.couponText}
              </p>
            </div>
          )}
          {onAction && (
            <button
              className="mt-2 px-4 py-2 bg-[#F8B23D] hover:bg-[#F0A72D] text-[#434553] font-medium rounded-lg flex items-center gap-1"
              onClick={() => onAction(item.id)}
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
              {actionLabel ?? 'Action'}
            </button>
          )}
        
        </div>
      ))}
    </div>
  );
}
  // const { data, isLoading, error } = useCampaigns();

  // if (isLoading) return <div className="text-gray-500">Loading campaigns...</div>;
  // if (error) return <div className="text-red-500">Error loading campaigns</div>;

  // const campaigns = data?.data ?? [];

  // return (
  //   <div className="space-y-4">
  //     {campaigns.length === 0 && (
  //       <p className="text-gray-500">No campaigns yet.</p>
  //     )}
  //     {campaigns.map((item) => (
  //       <div key={item.id} className="bg-white rounded-lg shadow p-4">
  //         <div className="flex items-center justify-between mb-2">
  //           <h3 className="font-semibold text-gray-900">{item.title}</h3>
  //           <span
  //             className={`text-xs px-2 py-1 rounded-full font-medium ${
  //               statusColors[item.status] || 'bg-gray-100'
  //             }`}
  //           >
  //             {item.status}
  //           </span>
  //         </div>
  //         {item.description && (
  //           <p className="text-gray-700 text-sm">{item.description}</p>
  //         )}
  //         {item.caption && (
  //           <div className="mt-2 bg-gray-50 rounded p-2">
  //             <p className="text-sm text-gray-600 italic">&ldquo;{item.caption}&rdquo;</p>
  //           </div>
  //         )}
  //         {item.couponText && (
  //           <div className="mt-2 bg-purple-50 rounded p-2">
  //             <p className="text-sm text-purple-700 font-medium">Coupon: {item.couponText}</p>
  //           </div>
  //         )}
  //       </div>
  //     ))}
  //   </div>
  // );
// }
