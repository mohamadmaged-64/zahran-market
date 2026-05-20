"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, DollarSign, Users, AlertTriangle, TrendingUp, ArrowUp, ArrowDown, Eye
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Order, DashboardStats } from "@/lib/types";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  icon: any;
  color: string;
}

function StatsCard({ title, value, change, changeType, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              changeType === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {changeType === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/orders?limit=10");
      const orders: Order[] = await res.json();
      setRecentOrders(orders.slice(0, 5));

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      setStats({
        total_orders: orders.length,
        total_revenue: totalRevenue,
        total_products: 0,
        total_customers: new Set(orders.map((o) => o.customer_phone)).size,
        pending_orders: pendingOrders,
        low_stock_products: 0,
        orders_by_status: [],
        revenue_by_month: [],
        recent_orders: orders.slice(0, 5),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner size="lg" />;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
    preparing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    confirmed: "تم التأكيد",
    preparing: "قيد التحضير",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
        <Link href="/admin/analytics" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
          <Eye className="w-4 h-4" /> تقرير كامل
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="إجمالي الطلبات"
          value={stats?.total_orders.toLocaleString("ar-SA") || "0"}
          icon={ShoppingCart}
          color="bg-blue-600"
        />
        <StatsCard
          title="الإيرادات"
          value={formatCurrency(stats?.total_revenue || 0)}
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatsCard
          title="الطلبات المعلقة"
          value={(stats?.pending_orders || 0).toLocaleString("ar-SA")}
          icon={AlertTriangle}
          color="bg-yellow-600"
        />
        <StatsCard
          title="العملاء"
          value={(stats?.total_customers || 0).toLocaleString("ar-SA")}
          icon={Users}
          color="bg-purple-600"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            عرض الكل
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="text-right p-4 font-medium">رقم الطلب</th>
                <th className="text-right p-4 font-medium">العميل</th>
                <th className="text-right p-4 font-medium">المبلغ</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">لا توجد طلبات</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{order.customer_name}</td>
                    <td className="p-4 font-bold text-primary-600">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="p-4">
                      <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                        تفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
