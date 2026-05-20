"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Eye } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order, OrderStatus } from "@/lib/types";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث حالة الطلب");
      loadOrders();
      setSelectedOrder(null);
    } catch {
      toast.error("فشل تحديث الحالة");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.includes(search) ||
      o.customer_phone.includes(search) ||
      o.id.includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الطلبات</h1>
        <span className="text-sm text-gray-500">إجمالي الطلبات: {orders.length}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم العميل أو رقم الجوال..."
            className="input-field pr-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">جميع الحالات</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                <th className="text-right p-4 font-medium">رقم الطلب</th>
                <th className="text-right p-4 font-medium">العميل</th>
                <th className="text-right p-4 font-medium">رقم الجوال</th>
                <th className="text-right p-4 font-medium">المبلغ</th>
                <th className="text-right p-4 font-medium">الدفع</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">لا توجد طلبات</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{order.customer_name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400" dir="ltr">{order.customer_phone}</td>
                    <td className="p-4 font-bold text-primary-600">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {order.payment_method === "cash" ? "نقداً" : order.payment_method === "card" ? "بطاقة" : "استلام"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">العميل</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">رقم الجوال</p>
                  <p className="font-medium text-gray-900 dark:text-white" dir="ltr">{selectedOrder.customer_phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">العنوان</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer_address}</p>
                </div>
                <div>
                  <p className="text-gray-500">طريقة الدفع</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedOrder.payment_method === "cash" ? "الدفع عند الاستلام" : selectedOrder.payment_method === "card" ? "بطاقة ائتمان" : "استلام من المتجر"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">التاريخ</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(selectedOrder.created_at)}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-gray-500 text-sm">ملاحظات</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <hr className="border-gray-200 dark:border-gray-700" />

              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">المنتجات</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{item.product_name} × {item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المجموع</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">التوصيل</span>
                  <span>{selectedOrder.delivery_fee === 0 ? "مجاني" : formatCurrency(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary-600">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">تحديث الحالة</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(selectedOrder.id, key)}
                    disabled={selectedOrder.status === key}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedOrder.status === key
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
