'use client';

import { useState } from 'react';
import NewsList from '@/features/news/NewsList';

export default function NewsPage() {

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedArea, setSelectedArea] = useState('ทับสะแก');


  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-4xl font-bold text-[#FBBF24] mb-2">
          เทรนด์ในพื้นที่
        </h2>

        <p className="text-[#fff]-500 mt-1">
          วิเคราะห์เทรนด์และข่าวสารในพื้นที่
        </p>
      </div>

      <div className="flex flex-wrap gap-4">

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

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="material-symbols-outlined text-[#FBBF24] text-xl">
            location_on
          </span>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-transparent outline-none text-[#434553]"
          >
            <option value="ทับสะแก">ทับสะแก</option>
          </select>
        </div>
      </div>

      <NewsList
        selectedDate={selectedDate}
        selectedArea={selectedArea}
      />
    </div>
  );
}
