'use client';

import { useInsights } from '@/hooks/useInsights';

type Props = {
  selectedDate: string;
  selectedArea: string;
};

export default function InsightList({
  selectedDate,
  selectedArea,
}: Props) {

  // const {data, isLoading} = useInsights(
  //   selectedDate,
  //   selectedArea,
  // );

  // const shops = data?.data ?? []; Backend มาแล้ว

  const shops: any[] = [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">

      <div className="grid grid-cols-12 bg-[#ffecb3] px-6 py-4 text-sm font-semibold text-[#5D6270]">

        <div className="col-span-3">
          ชื่อร้าน
        </div>

        <div className="col-span-2">
          Category
        </div>

        <div className="col-span-2">
          เบอร์โทร
        </div>

        <div className="col-span-2">
          Rating
        </div>

        <div className="col-span-3">
          Google Map
        </div>

      </div>

      {/* Empty State */}
      {shops.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] bg-white">
          <p className="text-gray-400 text-lg">
            No shop data available
          </p>
        </div>
      ) : (
        shops.map((shop) => (
          <div
            key={shop.id} 
            className="grid grid-cols-12 px-6 py-5 border-t border-gray-200 items-center bg-white hover:bg-gray-50"
          >
            <div className="col-span-3">

              <p className="font-semibold text-[#434553]">
                {shop.name}
              </p>
            </div>

            <div className="col-span-2 text-[#5D6270]">
              {shop.category}
            </div>

            <div className="col-span-2 text-[#5D6270]">
              {shop.phone}
            </div>

            <div className="col-span-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                ⭐ {shop.rating}
              </span>
            </div>

            <div className="col-span-3">
              <a
                href={shop.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <span className="material-symbols-outlined text-[18px]">
                  map
                </span>

                View Map
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}





// export default function InsightList() {
//   const { data, isLoading, error } = useInsights();

//   if (isLoading) return <div className="text-gray-500">Loading insights...</div>;
//   if (error) return <div className="text-red-500">Error loading insights</div>;

//   const insights = data?.data ?? [];

//   return (
//     <div className="space-y-4">
//       {insights.length === 0 && (
//         <p className="text-gray-500">No AI insights yet. n8n workflow will generate them.</p>
//       )}
//       {insights.map((item) => (
//         <div key={item.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
//           <h3 className="font-semibold text-gray-900">{item.title}</h3>
//           <p className="text-gray-700 mt-2 text-sm">{item.summary}</p>
//           {item.recommendation && (
//             <div className="mt-3 bg-blue-50 rounded p-3">
//               <p className="text-sm font-medium text-blue-800">Recommendation:</p>
//               <p className="text-sm text-blue-700">{item.recommendation}</p>
//             </div>
//           )}
//           <p className="text-xs text-gray-400 mt-2">
//             {new Date(item.createdAt).toLocaleString()}
//           </p>
//         </div>
//       ))} 
//     </div>
//   );
// }
