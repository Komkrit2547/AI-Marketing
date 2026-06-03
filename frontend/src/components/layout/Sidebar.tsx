'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/news', label: 'Local Trends', icon: 'Whatshot' },
  { href: '/insights', label: 'Local Shop', icon: 'Storefront' },
  { href: '/campaigns', label: 'Campaign', icon: 'campaign' },
];

export default function Sidebar() {
  const { sidebarOpen } = useDashboardStore();
  const pathname = usePathname();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-[#F3EFB9] text-black transition-all duration-300 flex flex-col border-r border-[#E8D97A]`}
    >
      <div className="p-4 border-b border-[#ffb300]">
        <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
          AI Marketing
        </h1>
      </div>
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-4 py-3 transition-all duration-200 
              ${
                isActive
                  ? `bg-[#F3E34D] text-[#1F2937] font-semibold`
                  : `text-[#434553] hover:bg-[#F7EE9A]`
              }`}
            >
              <span  className="material-symbols-outlined">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
