'use client';

import { useState } from 'react';
import { useNews, useWeather } from '@/hooks/useNews';

type Props = {
  selectedDate: string;
  selectedArea: string;
};

export default function NewsList({
  selectedDate,
  selectedArea,
}: Props) {
  const { data: newsData, isLoading: isNewsLoading } = useNews(selectedDate);
  const { data: weatherRes, isLoading: isWeatherLoading } = useWeather();

  const weather = weatherRes?.data;
  const trends = newsData?.data?.trending || [];
  const news = newsData?.data?.news || [];

  const [selectedNews, setSelectedNews] = useState<any>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  
  const currentNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-12 gap-6 relative">
      {/* Weather */}
      <div className="col-span-12 xl:col-span-4 flex flex-col">
        <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#8B1E12]">
              partly_cloudy_day
            </span>
            <h2 className="text-2xl font-semibold text-[#434553]">
              สภาพอากาศ
            </h2>
          </div>

          {isWeatherLoading ? (
             <div className="flex-1 flex items-center justify-center min-h-[220px]">
               <p className="text-gray-400">Loading weather...</p>
             </div>
          ) : weather ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
              <p className="text-[5rem] leading-none font-bold text-[#434553]">
                {weather.temperature ?? '--'}°
              </p>
              <p className="text-2xl font-medium text-[#434553] mt-4">
                {weather.weather ?? 'N/A'}
              </p>
              <p className="text-base text-gray-500 mt-2">
                Humidity {weather.humidity ?? '--'}%
              </p>
              <p className="text-xs text-gray-400 mt-4">
                อัพเดทล่าสุด: {new Date(weather.createdAt).toLocaleTimeString('th-TH')}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[220px]">
              <p className="text-gray-400">No weather data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="col-span-12 xl:col-span-8 flex flex-col">
        <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8 flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#8B1E12]">
              local_fire_department
            </span>
            <h2 className="text-2xl font-semibold text-[#434553]">
              กำลังถูกพูดถึง
            </h2>
          </div>

          {isNewsLoading ? (
            <div className="flex items-center justify-center min-h-[220px]">
               <p className="text-gray-400">Loading trends...</p>
             </div>
          ) : trends.length === 0 ? (
            <div className="flex items-center justify-center min-h-[220px]">
              <p className="text-gray-400">No trending topics for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trends.map((trend: any, index: number) => (
                <div 
                  key={trend.id} 
                  className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#8B1E12] font-bold">#{index + 1}</span>
                    <span className="text-[#434553] font-medium">{trend.title}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{trend.category ?? 'General'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News */}
      <div className="col-span-12">
        <div className="bg-[#F8F6EF] border border-gray-400 rounded-[28px] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#8B1E12]">
              article
            </span>
            <h2 className="text-2xl font-semibold text-[#434553]">
              ข่าวสาร
            </h2>
          </div>

          {isNewsLoading ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-400">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-400">No news available for this date</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentNews.map((item: any) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedNews(item)}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-[#434553] line-clamp-1 flex-1">
                        {item.contentPreview || item.content}
                      </h3>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{item.source} - {item.groupName}</span>
                      <span>
                        {item.postedAt ? new Date(item.postedAt).toLocaleDateString('th-TH') : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  
                  <span className="text-sm font-medium text-[#434553]">
                    หน้า {currentPage} จาก {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-[#8B1E12] font-semibold mb-4">
              <span className="material-symbols-outlined text-base">source</span>
              {selectedNews.source} - {selectedNews.groupName}
            </div>
            <p className="text-[#434553] whitespace-pre-wrap leading-relaxed text-lg">
              {selectedNews.contentFull || selectedNews.content}
            </p>
            <div className="flex gap-6 mt-8 text-sm text-gray-500 border-t pt-4 border-gray-100">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">thumb_up</span>
                {selectedNews.reactionCount} Reactions
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">comment</span>
                {selectedNews.commentCount} Comments
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">share</span>
                {selectedNews.shareCount} Shares
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                {selectedNews.postedAt ? new Date(selectedNews.postedAt).toLocaleString('th-TH') : ''}
              </span>
            </div>
            {selectedNews.postUrl && (
              <a 
                href={selectedNews.postUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 block text-center bg-[#F8F6EF] text-[#434553] font-semibold py-3 rounded-xl hover:bg-[#eae6d5] transition-colors"
              >
                ดูโพสต์ต้นฉบับ
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
