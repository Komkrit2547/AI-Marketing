'use client';

import { useState, useEffect, useMemo } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { Business } from '@/types';

type Props = {
  selectedDate: string;
  selectedArea: string;
  searchQuery?: string;
  onTotalChange?: (total: number) => void;
};

export default function InsightList({
  selectedDate,
  selectedArea,
  searchQuery = '',
  onTotalChange,
}: Props) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const province =
    selectedArea === 'thap sakae'
      ? 'Prachuap Khiri Khan'
      : undefined;

  const { data, isLoading, error } = useBusinesses(
    page,
    limit,
    province
  );

  const shops = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return shops;
    const q = searchQuery.trim().toLowerCase();
    return shops.filter((shop) =>
      shop.name?.toLowerCase().includes(q)
    );
  }, [shops, searchQuery]);

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  useEffect(() => {
    if (data?.total !== undefined && onTotalChange) {
      onTotalChange(data.total);
    }
  }, [data?.total, onTotalChange]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-white">
        {/* Header */}
        <div className="grid grid-cols-12 border-b border-[#E4E4E7] px-7 py-4 text-[13px] font-semibold text-[#6a6a6a]">
          <div className="col-span-4">ชื่อร้าน</div>
          <div className="col-span-2">CATEGORY</div>
          <div className="col-span-2">เบอร์โทร</div>
          <div className="col-span-2">RATING</div>
          <div className="col-span-2 text-right">GOOGLE MAP</div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center bg-white">
            <p className="text-[15px] text-[#71717A]">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-[400px] items-center justify-center bg-white">
            <p className="text-[15px] text-red-500">
              เกิดข้อผิดพลาดในการโหลดข้อมูล
            </p>
          </div>
        ) : shops.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center bg-white">
            <p className="text-[15px] text-[#71717A]">
              No shop data available
            </p>
          </div>
        ) : (
          filteredShops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => setSelectedBusiness(shop)}
              className="
                group
                grid
                grid-cols-12
                items-center
                border-b
                border-[#F1F5F9]
                bg-white
                px-7
                py-3.5
                cursor-pointer
                transition-all
                duration-200
                hover:bg-[#FFFAF0]
              "
            >
              {/* Shop Name */}
              <div className="col-span-4">
                <p className="text-[15px] font-semibold text-[#18181B]">
                  {shop.name}
                </p>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#F4F4F5]
                    px-3
                    py-1
                    text-[13px]
                    font-medium
                    text-[#3F3F46]
                  "
                >
                  {shop.category || '-'}
                </span>
              </div>

              {/* Phone */}
              <div className="col-span-2 text-[15px] text-[#52525B]">
                {shop.phone || '-'}
              </div>

              {/* Rating */}
              <div className="col-span-2">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#FEF3C7]
                    px-3
                    py-1.5
                    text-[15px]
                    font-semibold
                    text-[#44403C]
                  "
                >
                  <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">
                    star
                  </span>
                  {shop.rating || '-'}
                </span>
              </div>

              {/* Google Map */}
              <div className="col-span-2 flex justify-end">
                {shop.googleUrl ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(shop.googleUrl, '_blank');
                    }}
                    className ="flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-[#44403C] bg-gradient-to-r from-[#FFF1C7] to-[#FFE3A3] border border-[#F8E5B3] shadow-[0_2px_6px_rgba(244,196,77,0.08)] transition-all duration-200 group-hover:from-[#FFE7A3] group-hover:to-[#FFD97A] group-hover:shadow-[0_8px_20px_rgba(244,196,77,0.25)] hover:scale-[1.04] hover:text-[#27272A] active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[18px]">
                      map
                    </span>
                    View Map
                  </button>
                ) : (
                  <span className="text-[#A1A1AA]">-</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-[#E4E4E7] bg-white p-5">
          <p className="text-[14px] text-[#71717A]">
            แสดง {shops.length} จาก {totalItems} รายการ
            (หน้า {page} / {totalPages})
          </p>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
              className="
                rounded-xl
                border
                border-[#E4E4E7]
                px-4
                py-2
                text-[14px]
                font-medium
                text-[#3F3F46]
                transition-all
                hover:bg-[#F8FAFC]
                disabled:opacity-50
              "
            >
              ก่อนหน้า
            </button>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={page === totalPages}
              className="
                rounded-xl
                border
                border-[#E4E4E7]
                px-4
                py-2
                text-[14px]
                font-medium
                text-[#3F3F46]
                transition-all
                hover:bg-[#F8FAFC]
                disabled:opacity-50
              "
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      <BusinessDetailModal
        business={selectedBusiness}
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
    </div>
  );
}