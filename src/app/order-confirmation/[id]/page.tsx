"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, MapPin, CreditCard, Clock, Phone, Store } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order, PaymentMethod } from "@/lib/types";

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "الدفع عند الاستلام",
  card: "بطاقة ائتمان",
  pickup: "استلام من المحل",
};

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/orders?id=${id}`)
        .then((r) => r.json())
        .then((data) => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="container-custom py-20"><LoadingSpinner size="lg" /></div>;
  if (!order) return <div className="container-custom py-20 text-center text-gray-500">الطلب غير موجود</div>;

  return (
    <div className="container-custom py-6">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            تم استلام طلبك بنجاح!
          </h1>
          <p className="text-gray-500">شكراً لتسوقك من زهران ماركت</p>
        </div>

        {/* Order info */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="font-bold text-gray-900 dark:text-white">رقم الطلب</span>
            </div>
            <span className="text-lg font-bold text-primary-600">{order.id.slice(0, 8)}</span>
          </div>
          <hr className="border-gray-200 dark:border-gray-700 mb-4" />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">تاريخ الطلب</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(order.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">رقم الجوال</p>
                <p className="font-medium text-gray-900 dark:text-white" dir="ltr">{order.customer_phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">عنوان التوصيل</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customer_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">طريقة الدفع</p>
                <p className="font-medium text-gray-900 dark:text-white">{paymentLabels[order.payment_method]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">المنتجات</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.image_url && (
                  <img src={item.image_url} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <hr className="border-gray-200 dark:border-gray-700 my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">التوصيل</span>
              <span>{order.delivery_fee === 0 ? "مجاني" : formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-primary-600">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-3">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            متابعة التسوق
          </Link>
          <br />
          <Link href="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
