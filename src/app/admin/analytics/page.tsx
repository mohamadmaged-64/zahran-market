"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, ShoppingCart, DollarSign, Package } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/lib/types";

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner size="lg" />;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const ordersByStatus = [
    { label: "قيد الانتظار", count: orders.filter((o) => o.status === "pending").length, color: "bg-yellow-500" },
    { label: "تم التأكيد", count: orders.filter((o) => o.status === "confirmed").length, color: "bg-blue-500" },
    { label: "قيد التحضير", count: orders.filter((o) => o.status === "preparing").length, color: "bg-indigo-500" },
    { label: "تم الشحن", count: orders.filter((o) => o.status === "shipped").length, color: "bg-purple-500" },
    { label: "تم التوصيل", count: orders.filter((o) => o.status === "delivered").length, color: "bg-green-500" },
    { label: "ملغي", count: orders.filter((o) => o.status === "cancelled").length, color: "bg-red-500" },
  ];

  // Revenue by payment method
  const cashTotal = orders.filter((o) => o.payment_method === "cash").reduce((s, o) => s + o.total, 0);
  const cardTotal = orders.filter((o) => o.payment_method === "card").reduce((s, o) => s + o.total, 0);
  const pickupTotal = orders.filter((o) => o.payment_method === "pickup").reduce((s, o) => s + o.total, 0);

  const total = cashTotal + cardTotal + pickupTotal;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">الإحصائيات والتقارير</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500">إجمالي الإيرادات</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
          <p className="text-xs text-gray-500">إجمالي الطلبات</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgOrderValue)}</p>
          <p className="text-xs text-gray-500">متوسط قيمة الطلب</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Package className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{deliveredOrders}</p>
          <p className="text-xs text-gray-500">طلبات مكتملة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">حالة الطلبات</h3>
          <div className="space-y-3">
            {ordersByStatus.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by payment method */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الإيرادات حسب طريقة الدفع</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">الدفع عند الاستلام</p>
                <p className="text-xs text-gray-500">{total > 0 ? Math.round((cashTotal / total) * 100) : 0}%</p>
              </div>
              <p className="font-bold text-primary-600">{formatCurrency(cashTotal)}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">بطاقة ائتمان</p>
                <p className="text-xs text-gray-500">{total > 0 ? Math.round((cardTotal / total) * 100) : 0}%</p>
              </div>
              <p className="font-bold text-primary-600">{formatCurrency(cardTotal)}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">استلام من المتجر</p>
                <p className="text-xs text-gray-500">{total > 0 ? Math.round((pickupTotal / total) * 100) : 0}%</p>
              </div>
              <p className="font-bold text-primary-600">{formatCurrency(pickupTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
