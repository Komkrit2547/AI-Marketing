'use client';

import { Business } from '@/types';

type Props = {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function BusinessDetailModal({ business, isOpen, onClose }: Props) {
  if (!isOpen || !business) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#ffecb3] px-6 py-4 flex items-center justify-between border-b border-[#E5D7A3]">
          <h2 className="text-xl font-bold text-[#434553]">รายละเอียดร้านค้า</h2>
          <button 
            onClick={onClose}
            className="text-[#5D6270] hover:text-red-500 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-2xl leading-none">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-[#434553]">
          
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-[#434553]">{business.name}</h3>
            {business.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                {business.category}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#434553] mt-0.5">location_on</span>
                <div>
                  <p className="font-semibold">ที่อยู่</p>
                  <p className="text-gray-600 text-sm mt-1">{business.address || '-'}</p>
                  <p className="text-gray-600 text-sm">
                    {business.city && `${business.city}, `}{business.province}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#434553] mt-0.5">call</span>
                <div>
                  <p className="font-semibold">เบอร์ติดต่อ</p>
                  <p className="text-gray-600 text-sm mt-1">{business.phone || '-'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-yellow-500 mt-0.5">star</span>
                <div>
                  <p className="font-semibold">เรตติ้ง</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold">{business.rating || '-'}</span>
                    <span className="text-gray-500 text-sm">({business.reviewCount || 0} รีวิว)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#434553] mt-0.5">language</span>
                <div>
                  <p className="font-semibold">ช่องทางออนไลน์</p>
                  <div className="mt-1 space-y-1">
                    {business.website ? (
                      <a href={business.website} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline text-sm truncate max-w-xs">
                        {business.website}
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">-</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(business.latitude && business.longitude) && (
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-xl">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">my_location</span>
                 พิกัด: {business.latitude}, {business.longitude}
               </div>
               {business.googleUrl && (
                  <a 
                    href={business.googleUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    เปิดใน Google Maps
                  </a>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
