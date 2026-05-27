'use client';

import { useDashboardStore } from '@/store/dashboard';

export default function Header() {
  const { toggleSidebar } = useDashboardStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-900 text-xl"
      >
        ☰
      </button>
      <div className="text-sm text-gray-500">AI Contextual Marketing Dashboard</div>
    </header>
  );
}
