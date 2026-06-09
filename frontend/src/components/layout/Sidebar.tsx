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
      className={`
        ${sidebarOpen ? 'w-72' : 'w-24'}
        bg-[#262626] 
        border-r
        border-[#303030] 
        flex
        flex-col
        transition-all
        duration-300 
      `}
    >
      <div
        className={`
          py-6
          ${sidebarOpen
            ? 'px-7'
            : 'flex justify-center'
          }
        `}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div
            className={`
              rounded-full 
              bg-gradient-to-br
              from-[#F5B33C] 
              via-[#F7C95A] 
              to-[#FFD66B] 
              flex items-center 
              justify-center shadow-sm
            ${sidebarOpen
                ? 'w-14 h-14'
                : 'w-16 h-16'
              }
          `}
          >
            <span
              className={`
                material-symbols-outlined
                text-black

                ${sidebarOpen
                  ? 'text-[24px]'
                  : 'text-[28px]'
                }
              `}
            >
              auto_awesome
            </span>
          </div>

          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-[20px] text-white">
                AI Marketing
              </h1>
              <p className="text-[15px] text-[#BDBDBD]">
                Thap Sakae
              </p>
            </div>
          )}
        </div>
      </div>

      <nav
        className={`
          flex-1
          mt-6
          space-y-8

          ${sidebarOpen
            ? 'px-7'
            : 'px-0'
          }
        `}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center transition-all duration-300
                ${sidebarOpen
                  ? `
                      gap-4
                      px-5
                      py-4
                      rounded-[24px]
                    `
                  : `
                      w-[58px]
                      h-[72px]
                      mx-auto
                      justify-center
                      rounded-[28px]
                    `
                }
                ${isActive
                  ? `bg-[#F2F2F2] text-[#262626] font-semibold shadow-[0_4px_12px_rgba(255,255,255,0.08)]`
                  : `text-[#F5F5F5] hover:bg-[#333333]`
                } 
              `}
            >
              <span
                className={`
                  material-symbols-outlined

                  ${sidebarOpen
                    ? 'text-[24px]'
                    : 'text-[30px]'
                  }
                `}
              >
                {item.icon}
              </span>

              {sidebarOpen && (
                <span className="text-[18px] font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>

  );
}
