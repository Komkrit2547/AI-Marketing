'use client';

import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboard';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/news', label: 'News', icon: '📰' },
  { href: '/insights', label: 'AI Insights', icon: '🤖' },
  { href: '/campaigns', label: 'Campaigns', icon: '📢' },
];

export default function Sidebar() {
  const { sidebarOpen } = useDashboardStore();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-700">
        <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>
          AI Marketing
        </h1>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
          >
            <span>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
