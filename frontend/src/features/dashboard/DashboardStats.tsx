'use client';

import { useNews } from '@/hooks/useNews';
import { useInsights } from '@/hooks/useInsights';
import { useCampaigns } from '@/hooks/useCampaigns';

import Link from 'next/link';

type DashboardStatsProps = {
  totalShops: number;
  totalTrends: number;
  totalCampaigns: number;
  totalAiInsights: number;
}

export default function DashboardStats({
  totalShops,
  totalTrends,
  totalCampaigns,
  totalAiInsights,
}: DashboardStatsProps){
  const stats = [
    {
      label: 'ร้านทั้งหมด',
      value: totalShops,
      icon: 'storefront',
      href: null,
    },
    {
      label: 'เทรนด์/เดือน',
      value: totalTrends,
      icon: 'Monitoring',
      href: '/news',
    },
    {
      label: 'แคมเปญทั้งหมด',
      value: totalCampaigns,
      icon: 'Campaign',
      href: '/campaigns',
    },
    {
      label: 'AI Intelligence',
      value: totalAiInsights,
      icon: 'auto_awesome',
      href: '/campaigns',
    },
  ];
  
  // const { data: newsData } = useNews(1, 1);
  // const { data: insightsData } = useInsights(1, 1);
  // const { data: campaignsData } = useCampaigns(1, 1);

  // const stats = [
    // {
    //   label: 'ร้านทั้งหมด',
    //   value: 0,
    //   icon: 'storefront',
    // },
    // {
    //   label: 'เทรนด์/เดือน',
    //   value: newsData?.pagination?.total ?? 0,
    //   icon: 'Monitoring',
    // },
    // {
    //   label: 'แคมเปญทั้งหมด',
    //   value: campaignsData?.pagination?.total ?? 0,
    //   icon: 'Campaign',
    // },
    // {
    //   label: 'AI Intelligence',
    //   value: insightsData?.pagination?.total ?? 0,
    //   icon: 'auto_awesome',
    // },
  // ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat) => {
        const card = (
          <div
            className={`
              bg-[#F8F6EF]
              border border-gray-300
              rounded-[24px]
              p-6
              transition-all
              duration-200 
              ${
                stat.href
                  ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
                  : ''
              }
            `}
          >

            <div className = "flex items-center justify-between">
              <div>
               <p className="mt-4 text-[#666] text-lg">{stat.label}</p>
               <p className="text-4xl font-medium text-[#4A4A57]">{stat.value}</p>
             </div>

             <div className="w-14 h-14 rounded-2xl bg-[#EFE7D5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#8B1E12] text-[28px]">
                  {stat.icon}
                </span>
              </div>
            </div>
          </div>
        );

        return stat.href ? (
          <Link key={stat.label} href={stat.href}>
            {card}
          </Link>
        ) : (
          <div key={stat.label}>
            {card}
          </div>
        );
      })}
    </div>
  );
}


// return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {stats.map((stat) => (
//         <div key={stat.label} className="bg-[#FFFEF5]
//             border-2
//             border-[#A8A8A8]
//             rounded-[30px]
//             p-8
//             h-[200px]
//             flex
//             flex-col
//             justify-between"
//             >
//           {/* <div className="flex items-center gap-4"> */}
//             <div>
//               <span className="material-symbols-outlined text-[#8B1E12] text-[34px]"> {stat.icon}</span>
//               {/* <span className="text-white text-xl font-bold">
//                 {stat.value}
//               </span> */}
//             </div>

//             <div>
//               <p className="mt-4 text-[#666] text-lg">{stat.label}</p>
//               <p className="text-5xl font-medium text-[#4A4A57]">{stat.value}</p>
//             </div>
//           {/* </div> */}
//         </div>
//       ))}
//     </div>
//   );