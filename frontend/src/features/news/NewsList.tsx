'use client';

import { useNews } from '@/hooks/useNews';
import { useState } from 'react';

export default function NewsList() {
  // const { data, isLoading, error } = useNews();

  // if (isLoading) return <div className="text-gray-500">Loading news...</div>;
  // if (error) return <div className="text-red-500">Error loading news</div>;

  // const newsItems = data?.data ?? [];

  // return (
  //   <div className="space-y-4">
  //     {newsItems.length === 0 && (
  //       <p className="text-gray-500">No news items yet. n8n workflow will populate this.</p>
  //     )}
  //     {newsItems.map((item) => (
  //       <div key={item.id} className="bg-white rounded-lg shadow p-4">
  //         <div className="flex items-start justify-between">
  //           <div>
  //             <h3 className="font-semibold text-gray-900">{item.title}</h3>
  //             <p className="text-sm text-gray-500 mt-1">
  //               {item.source} · {item.category && `${item.category} · `}
  //               {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
  //             </p>
  //           </div>
  //         </div>
  //         {item.content && (
  //           <p className="text-gray-700 mt-2 text-sm line-clamp-2">{item.content}</p>
  //         )}
  //         {item.url && (
  //           <a
  //             href={item.url}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="text-blue-600 text-sm mt-2 inline-block hover:underline"
  //           >
  //             Read more →
  //           </a>
  //         )}
  //       </div>
  //     ))}
  //   </div>
  // );

  const [date, setDate] = useState('');
  const [area, setArea] = useState('ทับสะแก');

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-6">

        {/* Date */}
        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-2">
          <span className="material-symbols-outlined text-[#434553]">
            calendar_month
          </span>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              bg-transparent
              outline-none
              text-[#434553]
            "
          />
        </div>
      {/* Area */}
        <div className="flex items-center gap-3 bg-[#F8F6EF] border border-gray-300 rounded-lg px-4 py-2">
          <span className="material-symbols-outlined text-[#434553]">
            location_on
          </span>

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="
              bg-transparent
              outline-none
              text-[#434553]
              cursor-pointer
            "
          >
            <option value="ทับสะแก">ทับสะแก</option>
          </select>
        </div>
      </div>

      {/* Weather + Trending */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-[#F8F6EF] border border-gray-400 rounded-[24px] p-8">
          <h2 className="text-3xl font-semibold text-[#434553] mb-6">
            สภาพอากาศ
          </h2>

          <div className="h-[260px] bg-[#F4F0E3] rounded-2xl" />
        </div>


      </div>

      {/* News */}
      <div className="bg-[#F8F6EF] border border-gray-400 rounded-[24px] p-8">
        <h2 className="text-3xl font-semibold text-[#434553] mb-6">
          ข่าวสาร
        </h2>

        <div className="h-[320px] bg-[#F4F0E3] rounded-2xl" />
      </div>
    </div>
  );
}
