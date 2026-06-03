'use client';

import CampaignList from '@/features/campaigns/CampaignList';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignsPage() {
  const {data , error} = useCampaigns();

  if (error) {
    return (
      <div className="text-red-500">
        Error loading campaigns
      </div>
    );
  }

  const campaigns = data?.data ?? [];

  const aiDrafts = campaigns.filter(
    (item) => item.status === 'draft'
  );

  const usedIdeas = campaigns.filter(
    (item) => item.status === 'active' ||
              item.status === 'archived'
  );

  return (
    <div className="space-y-8">
      <div className="flex item-start judtify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#434553]">การจัดการแคมเปญ</h2>
          <p className="text-gray-500 mt-1">การจับคู่ข้อมูลและไอเดียแนะนำจาก AI</p>
        </div>

        {/* <button className="bg-[#F8B23D] hover:bg-[#F0A72D] px-4 py-2 rounded-lg text-text-[#434553] font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">
            add
          </span>
          เพิ่ม
        </button> */}
      </div>

      <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3 w-fit">
        <span className="material-symbols-outlined text-[#434553]">
          calendar_month
        </span>

        <input type="date" className = "bg-transparent outline-none text-[#434553]"/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">

        <div>
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#F4A321] pb-2">
            <div className = "flex items-center gap-2">
              <div className ="w-3 h-3 bg-[#F4A321] rounded-full"/>
              <h3 className="text-xl text-[#5D6270]">
                AI Drafts
              </h3>
            </div>

            <span className="text-xs text-gray-400">
              {aiDrafts.length}
            </span>
          </div>

          <CampaignList campaigns={aiDrafts}/>
        </div>

        {/* <div>
          <div className = "space-y-8">
            <div className ="bg-[#F8F6EF] border border-gray-400 rounded-[20px] h-[180px]"/>

            <div className ="bg-[#F8F6EF] border border-gray-400 rounded-[20px] h-[180px]"/>
          </div>
        </div> */}

        <div>
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#26A69A] pb-2">
            <div className ="flex items-center gap-2">
              <div className ="w-3 h-3 bg-[#26A69A] rounded-full"/>

              <h3 className="text-xl text-[#5D6270]">
                Used Ideas
              </h3>
            </div>

            <span className="text-xs text-gray-400">
              {usedIdeas.length}
            </span>
          </div>

          <CampaignList campaigns={usedIdeas}/>
      
          {/* <div className="bg-[#F8F6EF] border border-gray-400 rounded-[20px] h-[180px]"/> */}

        </div>

      </div>
    </div>
  );
}
 