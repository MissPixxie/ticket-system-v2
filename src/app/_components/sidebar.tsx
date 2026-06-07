"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  id: string;
  label: string;
  route: string;
  icon?: React.ReactNode;
};

export default function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="primary-background min-h-screen w-72 border-r border-white/10 backdrop-blur-xl">
      <div className="flex flex-col pt-6 text-white">
        <div className="mb-6 px-6 text-sm font-semibold tracking-widest text-white/40 uppercase">
          Navigation
        </div>

        {menuItems.map((item) => {
          // to remove home always being marked active due to pathname starting with /dashboard/user
          const isActive =
            item.route === "/dashboard/user"
              ? pathname === item.route
              : pathname.startsWith(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`group text-md flex w-full items-center gap-3 px-6 py-4 font-medium transition-all duration-200 ${
                isActive ? "bg-white/10 text-white" : "hover:bg-white/10"
              } `}
            >
              {item.icon && (
                <span
                  className={`text-lg transition ${
                    isActive
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  } `}
                >
                  {item.icon}
                </span>
              )}

              <span
                className={`transition ${
                  isActive ? "translate-x-1" : "group-hover:translate-x-1"
                } `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
