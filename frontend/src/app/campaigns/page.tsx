'use client';

import { useState } from 'react';
import CampaignList from '@/features/campaigns/CampaignList';
import { useCampaigns, useUpdateCampaignStatus } from '@/hooks/useCampaigns';

export default function CampaignsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const { data, error, isLoading } = useCampaigns(1, 20, selectedDate);
  const updateStatus = useUpdateCampaignStatus();

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

  const handleMoveToUsed = (id: string) => {
    updateStatus.mutate({ id, status: 'active' });
  };

  const handleMoveToDraft = (id: string) => {
    updateStatus.mutate({ id, status: 'draft' });
  };

  return (
    <div className="space-y-8">
      <div className="flex item-start judtify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#434553]">การจัดการแคมเปญ</h2>
          <p className="text-gray-500 mt-1">การจับคู่ข้อมูลและไอเดียแนะนำจาก AI</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3 w-fit">
        <span className="material-symbols-outlined text-[#434553]">
          calendar_month
        </span>
        <input
          type="date"
          className="bg-transparent outline-none text-[#434553]"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#F4A321] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F4A321] rounded-full" />
              <h3 className="text-xl text-[#5D6270]">AI Drafts</h3>
            </div>
            <span className="text-xs text-gray-400">{aiDrafts.length}</span>
          </div>
          <CampaignList
            campaigns={aiDrafts}
            onAction={handleMoveToUsed}
            actionLabel="Move to Used Ideas"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#26A69A] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#26A69A] rounded-full" />
              <h3 className="text-xl text-[#5D6270]">Used Ideas</h3>
            </div>
            <span className="text-xs text-gray-400">{usedIdeas.length}</span>
          </div>
          <CampaignList
            campaigns={usedIdeas}
            onAction={handleMoveToDraft}
            actionLabel="Move to Drafts"
          />
        </div>
      </div>
    </div>
  );
}