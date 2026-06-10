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
    <div className="min-h-screen bg-[#F5F8FC] space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-[#FBBF24] mb-2">การจัดการแคมเปญ</h2>
        <p className="text-[#fff]-500 mt-1">การจับคู่ข้อมูลและไอเดียแนะนำจาก AI</p>
      </div>

      <div className="flex items-center gap-4 bg-white rounded-[24px] px-6 py-4 shadow-sm border border-[#E8EDF5] w-fit">
        <span className="material-symbols-outlined text-[#FBBF24]">
          calendar_month
        </span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-transparent outline-none text-[#434553]"
        />
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6 border-b-2 border-[#F4A321] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#F4A321] rounded-full" />
              <h3 className="text-2xl font-bold text-[#0F172A]">AI Drafts</h3>
            </div>
            <span className="min-w-[36px] h-[32px] px-3 rounded-full bg-[#F7EED9] flex items-center justify-center font-semibold">
              {aiDrafts.length}
            </span>
          </div>
          <CampaignList
            campaigns={aiDrafts}
            onAction={handleMoveToUsed}
            actionLabel="Move to Used Ideas"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 border-b-2 border-[#26A69A] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#26A69A] rounded-full" />
              <h3 className="text-2xl font-bold text-[#0F172A]">Used Ideas</h3>
            </div>
            <span className="min-w-[36px] h-[32px] px-3 rounded-full bg-[#DDF8F0] flex items-center justify-center font-semibold">
              {usedIdeas.length}
            </span>
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