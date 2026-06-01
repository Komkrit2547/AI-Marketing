'use client';

import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboard';

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/news', label: 'Local Trends', icon: 'Whatshot' },
  { href: '/insights', label: 'Local Shop', icon: 'Storefront' },
  { href: '/campaigns', label: 'Campaign', icon: 'campaign' },
];

export default function Sidebar() {
  const { sidebarOpen } = useDashboardStore();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-[#FFF9C4] text-black transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-[#ffb300]">
        <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
          AI Marketing
        </h1>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFEE58] transition-colors"
          >
            <span  className="material-symbols-outlined">{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
