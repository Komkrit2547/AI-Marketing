'use client';

import { useState } from 'react';
import InsightList from '@/features/insights/InsightList';

export default function InsightsPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedArea, setSelectedArea] = useState('thap sakae');
  const [totalShops, setTotalShops] = useState(0);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3">
          <span className="material-symbols-outlined text-[#434553]">
            calendar_month
          </span>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3">
          <span className="material-symbols-outlined text-[#434553]">
            location_on
          </span>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option value="thap sakae">ทับสะแก</option>
          </select>
        </div>
      </div>

      <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#434553]">
            ร้านค้าในพื้นที่
          </h2>

          <div className="bg-[#EFE7D5] px-4 py-2 rounded-xl">
            <span className="text-[#434553] font-semibold">
              ทั้งหมด {totalShops} ร้าน
            </span>
          </div>
        </div>
        
        <InsightList
          selectedDate={selectedDate}
          selectedArea={selectedArea}
          onTotalChange={setTotalShops}
        />

      </div>

    </div>
  );
}