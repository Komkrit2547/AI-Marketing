'use client';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const card = (
          <div
            className={`
              bg-white
              border border-gray-200
              rounded-[20px]
              p-5
              transition-all
              duration-200
              h-full
              flex flex-col justify-between
              group
              ${
                stat.href
                  ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
                  : ''
              }
            `}
          >
            {/* Top row: Label + Icon */}
            <div className="flex items-start justify-between mb-4">
              <p className="text-[15px] text-[#888] font-medium">{stat.label}</p>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF5D1] to-[#FFDFA6] border border-[#FFE8A1] shadow-[0_4px_10px_rgba(251,191,36,0.15)] hover:from-[#FFD05B] hover:to-[#FF9D00] hover:shadow-[0_6px_16px_rgba(251,191,36,0.4)] group-hover:from-[#FFD05B] group-hover:to-[#FF9D00] group-hover:shadow-[0_6px_16px_rgba(251,191,36,0.4)] hover:border-[#FFC145] group-hover:border-[#FFC145] transition-all duration-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#44403C] hover:text-[#27272A] group-hover:text-[#27272A] text-[22px] transition-colors duration-300">
                  {stat.icon}
                </span>
              </div>
            </div>

            {/* Number */}
            <p className="text-4xl font-bold text-[#1F2937]">{stat.value}</p>
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