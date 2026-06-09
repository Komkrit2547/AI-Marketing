'use client';

import { Campaign } from '@/types';

const cardThemes: Record<
  string, 
  {
    topBar: string;
    iconBg: string;
    couponBg: string;
    couponBorder: string;
  }

>= {
  default: {
    topBar: 'from-[#5B6EF5] to-[#08B3DF]',
    iconBg: 'bg-[#08B3DF]',
    couponBg: 'bg-[#FFF5F7]',
    couponBorder: 'border-[#FFD5DF]',
  },
  active: {
    topBar: 'from-[#14B8A6] to-[#4DD4C6]',
    iconBg: 'bg-[#22C7D8]',
    couponBg: 'bg-[#FFF5F7]',
    couponBorder: 'border-[#FFD5DF]',
  },
  archived: {
    topBar: 'from-[#EC4899] to-[#FF5AAE]',
    iconBg: 'bg-[#F06292]',
    couponBg: 'bg-[#FFF5F7]',
    couponBorder: 'border-[#FFD5DF]',
  },
};

interface CampaignListProps {
  campaigns: Campaign[];
  onAction?: (id: string) => void;
  actionLabel?: string; 
}


// const statusColors: Record<string, string> = {
//   draft: 'bg-gray-100 text-gray-700',
//   active: 'bg-green-100 text-green-700',
//   archived: 'bg-yellow-100 text-yellow-700',
// }; 

// interface CampaignListProps {
//   campaigns: Campaign[];
//   onAction?: (id: string) => void;
//   actionLabel?: string;
// } 

export default function CampaignList({
  campaigns,
  onAction,
  actionLabel,
}: CampaignListProps) {
  if (campaigns.length === 0){
    return (
      <div className = "bg-white border border-[#E8EDF5] rounded-[32px] h-[250px] flex items-center justify-center">
        <p className="text-gray-400">No campaigns yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map((item) => {
        const theme = cardThemes[item.status] || cardThemes.default;

        return (
          <div key={item.id} className="bg-[#F8F6EF] border border-gray-300 rounded-[20px] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#434553]">{item.title}</h3>
              <span 
                className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700"
              > 
                {item.status}
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
                className="mt-2 px-4 py-2 bg-[#F8B23D] hover:bg-[#F0A72D] text-[#434553] font-medium rounded-lg flex items-center gap-1 w-fit"
                onClick={() => onAction(item.id)}
              >
                {actionLabel ?? 'Action'}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
