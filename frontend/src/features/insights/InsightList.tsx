'use client';

import { useState, useEffect } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Business } from '@/types';

type Props = {
  selectedDate: string;
  selectedArea: string;
  onTotalChange?: (total: number) => void;
};

export default function InsightList({
  selectedDate,
  selectedArea,
  onTotalChange,
}: Props) {
  const [page, setPage] = useState(1);
  const limit = 20;
  
  // Only search by province/area if it's selected. 
  // For demonstration, map 'thap sakae' or let backend handle fuzzy matching.
  const province = selectedArea === 'thap sakae' ? 'Prachuap Khiri Khan' : undefined;

  const { data, isLoading, error } = useBusinesses(page, limit, province);

  const shops = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    if (data?.total !== undefined && onTotalChange) {
      onTotalChange(data.total);
    }
  }, [data?.total, onTotalChange]);


  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-12 bg-[#ffecb3] px-6 py-4 text-sm font-semibold text-[#5D6270]">
          <div className="col-span-3">ชื่อร้าน</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">เบอร์โทร</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-3">Google Map</div>
        </div>

        {/* State Handling */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px] bg-white">
            <p className="text-gray-400 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px] bg-white">
            <p className="text-red-500 text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] bg-white">
            <p className="text-gray-400 text-lg">No shop data available</p>
          </div>
        ) : (
          shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => setSelectedBusiness(shop)}
              className="grid grid-cols-12 px-6 py-5 border-t border-gray-200 items-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="col-span-3">
                <p className="font-semibold text-[#434553]">{shop.name}</p>
              </div>

              <div className="col-span-2 text-[#5D6270]">
                {shop.category || '-'}
              </div>

              <div className="col-span-2 text-[#5D6270]">
                {shop.phone || '-'}
              </div>

              <div className="col-span-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  ⭐ {shop.rating || '-'}
                </span>
              </div>

              <div className="col-span-3">
                {shop.googleUrl ? (
                  <a
                    href={shop.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    View Map
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">
            แสดง {shops.length} จาก {totalItems} รายการ (หน้า {page} / {totalPages})
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <BusinessDetailModal
        business={selectedBusiness}
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
    </div>
  );
}
