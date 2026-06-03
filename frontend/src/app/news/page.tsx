'use client';

import { useState } from 'react';
import NewsList from '@/features/news/NewsList';

export default function NewsPage() {

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // // const {data,isLoading,error,} = useNews(selectedDate);
  // // const weather = data?.weather;
  // // const trends = data?.trends ?? [];
  // // const news = data?.news ?? []; Backend มาแล้วค่อยใช้

  // // Placeholder รอ Backend
  // const weather = null;

  // const trends: {
  //   keyword: string;
  //   count: number;
  // }[] = [];

  // const news: {
  //   id: number;
  //   titel: string;
  //   source?: string;
  //   date?: string;
  // }[] = [];


  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold text-[#434553]">
          Local Trends
        </h2>

        <p className="text-gray-500 mt-1">
          วิเคราะห์เทรนด์และข่าวสารในพื้นที่
        </p>
      </div>

      <div className="flex flex-wrap gap-4">

        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3 w-fit">
          <span className="material-symbols-outlined text-[#434553]">
            calendar_month
          </span>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent outline-none text-[#434553]"
          />
        </div>

        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-3">
          <span className="material-symbols-outlined text-[#434553]">
            location_on
          </span>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-transparent outline-none text-[#434553]"
          >
            <option value="Thap Sakae ">ทับสะแก</option>
          </select>
        </div>
      </div>

      <NewsList 
        selectedDate = {selectedDate}
        selectedArea={selectedArea}
      />
    </div>
  );
}
