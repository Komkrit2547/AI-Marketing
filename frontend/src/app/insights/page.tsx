'use client';

import { useState, useMemo } from 'react';
import InsightList from '@/features/insights/InsightList';

export default function InsightsPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedArea, setSelectedArea] = useState('thap sakae');
  const [totalShops, setTotalShops] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#FBBF24] mb-2">Local Shop</h1>
        <p className="text-[#fff]-500">สำรวจร้านค้าและธุรกิจในพื้นที่ทับสะแก</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="material-symbols-outlined text-[#FBBF24] text-xl">
            calendar_month
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="material-symbols-outlined text-[#FBBF24] text-xl">
            location_on
          </span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 appearance-none pr-4"
          >
            <option value="thap sakae">ทับสะแก</option>
          </select>
          <span className="material-symbols-outlined text-gray-400 text-sm -ml-2">
            expand_more
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#FCD34D] w-10 h-10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-800">store</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              ร้านค้าในพื้นที่
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A017] text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="ค้นหาร้านค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-[220px] rounded-full border border-[#F0E0B0] bg-[#FFFDF5] text-sm text-gray-700 placeholder-[#C4A96A] outline-none transition-all duration-200 focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 focus:shadow-[0_0_12px_rgba(251,191,36,0.15)]"
              />
            </div>
            <div className="inline-flex items-center justify-center rounded-full px-5 py-2 bg-gradient-to-r from-[#ffb83e] to-[#ffd06a] shadow-[0_4px_12px_rgba(244,196,77,0.25)]">
              <span className="text-[#1F2937] font-bold text-[15px]">
                ทั้งหมด {totalShops} ร้าน
              </span>
            </div>
          </div>
        </div>

        <InsightList
          selectedDate={selectedDate}
          selectedArea={selectedArea}
          searchQuery={searchQuery}
          onTotalChange={setTotalShops}
        />

      </div>

    </div>
  );
}