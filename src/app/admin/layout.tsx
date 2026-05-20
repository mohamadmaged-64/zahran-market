"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Tags, BarChart3, Percent, Settings, Store, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
  { icon: Package, label: "المنتجات", href: "/admin/products" },
  { icon: Tags, label: "التصنيفات", href: "/admin/categories" },
  { icon: ShoppingCart, label: "الطلبات", href: "/admin/orders" },
  { icon: Percent, label: "العروض", href: "/admin/offers" },
  { icon: BarChart3, label: "الإحصائيات", href: "/admin/analytics" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Admin navbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom flex items-center justify-between h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-gray-900 dark:text-white">لوحة الإدارة</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            العودة للمتجر
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 min-h-[calc(100vh-56px)] sticky top-0">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 text-xs whitespace-nowrap min-w-fit",
                    isActive ? "text-primary-600" : "text-gray-500"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
