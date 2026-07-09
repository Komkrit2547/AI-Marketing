'use client';

import { useState, useEffect } from 'react';
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
  const { data: weatherRes, isLoading: isWeatherLoading } = useWeather(selectedDate, selectedArea);

  const currentWeather = weatherRes?.data?.current;
  const forecast = weatherRes?.data?.forecast || [];
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

  const getWeatherIcon = (weatherText: string | undefined | null) => {
    if (!weatherText) return 'partly_cloudy_day';
    if (weatherText.includes('แดดจัด') || weatherText.includes('แจ่มใส')) return 'sunny';
    if (weatherText.includes('บางส่วน')) return 'partly_cloudy_day';
    if (weatherText.includes('เมฆมาก')) return 'cloudy';
    if (weatherText.includes('ฟ้าคะนอง') || weatherText.includes('พายุ')) return 'thunderstorm';
    if (weatherText.includes('ฝน')) return 'rainy';
    return 'partly_cloudy_day';
  };

  const [todayFormatted, setTodayFormatted] = useState('');

  useEffect(() => {
    const dateObj = selectedDate ? new Date(selectedDate) : new Date();
    setTodayFormatted(dateObj.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
    // Reset pagination when date changes
    setCurrentPage(1);
  }, [selectedDate, selectedArea]);

  return (
    <>
      <div className="grid grid-cols-12 gap-8 w-full mb-8 items-stretch">
        <div className="col-span-12 xl:col-span-4 flex flex-col">
          {/* Weather */}
          <div className="bg-white border border-[#E8EDF5] rounded-[32px] shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="flex items-center gap-4 px-8 py-7 border-b border-[#EEF2F7]">
              <div className="w-14 h-14 rounded-full bg-[#FCD34D] flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-800">
                  {getWeatherIcon(currentWeather?.weather)}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-[#262626]">
                สภาพอากาศ
              </h2>
            </div>

            {isWeatherLoading ? (
              <div className="flex flex-1 items-center justify-center min-h-[360px]">
                <p className="text-gray-400">Loading weather...</p>
              </div>
            ) : (!currentWeather && forecast.length === 0) ? (
              <div className="flex flex-1 items-center justify-center min-h-[360px]">
                <p className="text-gray-400">ไม่มีข้อมูลสภาพอากาศสำหรับวันนี้</p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full">
                {/* Current Weather (Top) */}
                {currentWeather ? (
                  <div className="flex flex-col items-center justify-center flex-1 px-8 pt-8 pb-10">
                    <p className="text-[64px] leading-none font-bold text-[#151515]">
                      {currentWeather.temperature ?? '--'}°
                    </p>
                    <p className="text-[20px] font-semibold text-[#262626] mt-5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#FCD34D]">{getWeatherIcon(currentWeather.weather)}</span>
                      {currentWeather.weather ?? 'N/A'}
                    </p>
                    <p className="mt-5 px-5 py-2 rounded-full bg-[#F3F4F6] text-[#262626] font-medium text-sm">
                      💧Humidity {currentWeather.humidity ?? '--'}%
                    </p>
                    <p className="text-xs text-[#A0A0A0] mt-6">
                      อัพเดทล่าสุด: {new Date(currentWeather.recordedAt || currentWeather.createdAt).toLocaleTimeString('th-TH')}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 px-8 pt-8 pb-10">
                    <p className="text-gray-400">ไม่มีข้อมูลสภาพอากาศปัจจุบัน</p>
                  </div>
                )}

                {/* 7-Day Forecast (Bottom) */}
                {forecast.length > 0 && (
                  <div className="px-6 py-6 border-t border-[#EEF2F7] bg-[#FAFAFA] overflow-x-auto">
                    <div className="flex flex-row gap-3 min-w-max pb-2">
                      {forecast.map((item: any) => (
                        <div key={item.id} className="flex flex-col items-center justify-center p-4 rounded-[18px] bg-white border border-[#E8EDF5] w-[100px] shadow-sm hover:border-[#F4B83A] transition-colors">
                          <span className="text-[#A0A0A0] text-sm font-semibold mb-2">
                            {item.dayName || new Date(item.forecastDate).toLocaleDateString('th-TH', { weekday: 'short' })}
                          </span>
                          <span className="material-symbols-outlined text-[#FCD34D] text-[32px] mb-2">
                            {getWeatherIcon(item.weather)}
                          </span>
                          <span className="text-[11px] text-[#262626] font-medium text-center mb-2 truncate w-full px-1">
                            {item.weather || 'ไม่มีข้อมูล'}
                          </span>
                          <div className="text-sm font-bold text-[#262626]">
                            {item.maxTemp ?? '--'}° <span className="text-xs text-[#A0A0A0] font-medium">/ {item.minTemp ?? '--'}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Trending */}
        <div className="col-span-12 xl:col-span-8 flex flex-col">
          <div className="bg-white border border-[#E8EDF5] rounded-[32px] shadow-sm overflow-hidden flex-1">
            <div className="flex items-center gap-4 px-8 py-7 border-b border-[#EEF2F7]">
              <div className="w-14 h-14 rounded-full bg-[#FCD34D] flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-800">
                  local_fire_department
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-[#262626]">
                กำลังถูกพูดถึง
              </h2>
            </div>

            <div className="p-6">
              {isNewsLoading ? (
                <div className="flex items-center justify-center min-h-[360px]">
                  <p className="text-gray-400">Loading trends...</p>
                </div>
              ) : trends.length === 0 ? (
                <div className="flex items-center justify-center min-h-[360px]">
                  <p className="text-gray-400">No trending topics for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trends.map((trend: any, index: number) => (
                    <div
                      key={trend.id}
                      className="flex items-center justify-between border border-[#EEF2F7] rounded-[24px] px-5 py-5 bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-[#F4B83A] text-[#262626]">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-[#262626]">{trend.title}</span>
                      </div>

                      <span className="px-4 py-2 rounded-full bg-[#F7EED9] text-[#434553] text-sm font-medium">{trend.category ?? 'General'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="col-span-12">
        <div className="bg-white border border-[#E8EDF5] rounded-[32px] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 px-8 py-7 border-b border-[#EEF2F7]">
            <div className="w-14 h-14 rounded-full bg-[#F7EED9] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#F4B83A]">
                article
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#262626]">
              ข่าวสาร
            </h2>
          </div>

          <div className="p-6">

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
                      className="border border-[#EEF2F7] rounded-[24px] px-6 py-6 cursor-pointer hover:border-[#F4B83A] hover:shadow-sm transition-all"
                    >
                      {/* <div className="flex justify-between items-start"> */}
                      <h3 className="font-semibold text-[18px] text-[#262626] line-clamp-2">
                        {item.contentPreview || item.content}
                      </h3>
                      {/* </div> */}
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-[#F7EED9] text-[#F4B83A] text-sm font-semibold">
                          {item.source} - {item.groupName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.postedAt ? new Date(item.postedAt).toLocaleDateString('th-TH') : ''}
                        </span>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full border border-[#E8EDF5] bg-white disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>

                    <span className="text-sm font-medium text-[#434553]">
                      หน้า {currentPage} จาก {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full border border-[#E8EDF5] bg-white disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#F7EED9] text-[#F4B83A] font-semibold text-sm mb-6">
              <span className="material-symbols-outlined text-base">source</span>
              {selectedNews.source} - {selectedNews.groupName}
            </div>
            <p className="text-[#262626] whitespace-pre-wrap leading-relaxed text-lg">
              {selectedNews.contentFull || selectedNews.content}
            </p>
            <div className="flex gap-6 mt-8 text-sm text-gray-500 border-t border-[#EEF2F7] pt-5">
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
                className="mt-8 block text-center bg-[#F4B83A] text-[#262626] font-semibold py-4 rounded-[18px] hover:bg-[#E8AD2F] transition-colors"
              >
                ดูโพสต์ต้นฉบับ
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
