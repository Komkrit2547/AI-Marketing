'use client';

import { Campaign } from '@/types';

const cardThemes: Record<
  string,
  {
    topBar: string;
    iconBg: string;
    captionBg: string;
    captionBorder: string;
    couponBg: string;
    couponBorder: string;
    buttonBg: string;
    buttonHover: string;
  }
> = {
  draft: {
    topBar: 'from-[#F4B83A] to-[#F7C95A]',
    iconBg: 'bg-[#F4B83A]',

    captionBg: 'bg-[#F8F4EC]',
    captionBorder: 'border-[#E7D4A5]',

    couponBg: 'bg-[#ECECEC]',
    couponBorder: 'border-[#D8D8D8]',

    buttonBg: 'bg-[#F4B83A]',
    buttonHover: 'hover:bg-[#E8AD2F]',
  },
  active: {
    topBar: 'from-[#BDBDBD] to-[#D7D7D7]',
    iconBg: 'bg-[#CFCFCF]',

    captionBg: 'bg-[#F5F5F5]',
    captionBorder: 'border-[#E4E4E4]',

    couponBg: 'bg-[#ECECEC]',
    couponBorder: 'border-[#D8D8D8]',

    buttonBg: 'bg-[#F4B83A]',
    buttonHover: 'hover:bg-[#E8AD2F]',
  },
  archived: {
    topBar: 'from-[#BDBDBD] to-[#D7D7D7]',
    iconBg: 'bg-[#CFCFCF]',

    captionBg: 'bg-[#F5F5F5]',
    captionBorder: 'border-[#E4E4E4]',

    couponBg: 'bg-[#ECECEC]',
    couponBorder: 'border-[#D8D8D8]',

    buttonBg: 'bg-[#F4B83A]',
    buttonHover: 'hover:bg-[#E8AD2F]',
  },
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
      <div className = "bg-white border border-[#E8EDF5] rounded-[32px] h-[250px] flex items-center justify-center">
        <p className="text-gray-400">No campaigns yet</p>
      </div>
    );
  }
  return (
    <div className = "space-y-6">
      {campaigns.map((item) => {
        const theme = 
          cardThemes[item.status] ||
          cardThemes.draft;
        return (
          <div key = {item.id}  
            className="
              group bg-white 
              rounded-[32px] 
              overflow-hidden border 
              border-[#E8EDF5] 
              shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:-translate-y-1
              hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <div className={`h-2 bg-gradient-to-r ${theme.topBar} `}/>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6"> 
                  <div
                    className={`
                        w-14 h-14
                        rounded-full
                        ${theme.iconBg}
                        flex items-center justify-center
                      `}>
                      <span className="material-symbols-outlined text-[#262626]">
                        auto_awesome
                      </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#262626]">
                    {item.title}
                  </h3>
                </div>
                {item.description && (
                  <p className = "text-[#666] text-lg leading-8 mb-6">
                    {item.description}
                  </p>
                )}

                {item.caption && (
                  <div 
                    className = {`
                      rounded-[24px]
                      border
                      ${theme.captionBorder}
                      ${theme.captionBg}
                      p-6 mb-5`}>
                    <div className="font-semibold text-[#F4B83A] mb-3">
                      # โพสต์แนะนำ
                    </div>
                    <p className = "text-[#333] leading-8">
                      {item.caption}
                    </p>
                  </div>
                )} 

                {item.couponText && (
                  <div
                    className = {`
                      rounded-[20px]
                      border
                      ${theme.couponBorder}
                      ${theme.couponBg}
                      px-6 py-5 mb-6`}
                  >
                    <p className = "font-semibold text-[#262626]">
                      🔖 Coupon: {item.couponText}
                    </p>
                  </div>
                )}

                {onAction && (
                  <button 
                    onClick={() => onAction(item.id)}
                    className = {`h-14 px-8 rounded-full ${theme.buttonBg} text-[#262626] font-semibold text-lg flex items-center gap-3 ${theme.buttonHover} transition-all`}
                  >
                    <span className="material-symbols-outlined">
                      arrow_right_alt
                    </span> 

                    {actionLabel ?? 'Action'}
                  </button>
                )}
              </div>
            </div>  
          );
      })}
    </div>
  );
}

    //     <div key = {item.id} className="bg-[#F8F6EF] border border-gray-300 rounded-[20px] p-4">
    //       <div className="flex items-center justify-between mb-2">
    //         <h3 className="font-semibold text-[#434553]">{item.title}</h3>
    //         <span 
    //           className={`text-xs px-2 py-1 rounded-full font-medium ${
    //           statusColors[item.status] || 'bg-gray-100'
    //           }`}
    //         > 
    //           {item.title}
    //         </span>
    //       </div>

    //       {item.description && (
    //         <p className="text-sm text-gray-600">
    //           {item.description}
    //         </p>
    //       )}
        // return (
        //   <div key={item.id} className="bg-[#F8F6EF] border border-gray-300 rounded-[20px] p-4">
        //     <div className="flex items-center justify-between mb-2">
        //       <h3 className="font-semibold text-[#434553]">{item.title}</h3>
        //       <span 
        //         className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700"
        //       > 
        //         {item.status}
        //       </span>
        //     </div>

        //     {item.description && (
        //       <p className="text-sm text-gray-600">
        //         {item.description}
        //       </p>
        //     )}

        //     {item.caption && (
        //       <div className="mt-2 bg-gray-50 rounded p-2">
        //         <p className="text-sm italic text-gray-600">
        //           "{item.caption}"
        //         </p>
        //       </div>
        //     )}

            // {item.couponText && (
            //   <div className="mt-2 bg-gray-50 rounded p-2">
            //     <p className="text-sm text-purple-700 font-medium">
            //       Coupon: {item.couponText}
            //     </p>
            //   </div>
            // )}
            // {onAction && (
            //   <button
            //     className="mt-2 px-4 py-2 bg-[#F8B23D] hover:bg-[#F0A72D] text-[#434553] font-medium rounded-lg flex items-center gap-1 w-fit"
            //     onClick={() => onAction(item.id)}
            //   >
            //     {actionLabel ?? 'Action'}
            //     <span className="material-symbols-outlined text-[18px]">
            //       arrow_forward
            //     </span>
//               </button>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
