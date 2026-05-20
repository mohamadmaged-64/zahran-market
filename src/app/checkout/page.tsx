"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowLeft, MapPin, CreditCard, Banknote, Store, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import MapPicker from "@/components/ui/MapPicker";
import { formatCurrency, cn } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, SITE_NAME } from "@/lib/constants";
import { PaymentMethod, DeliveryLocation } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">السلة فارغة</h1>
          <p className="text-gray-500 mb-6">أضف منتجات إلى السلة أولاً</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!customerName.trim()) { toast.error("يرجى إدخال الاسم"); return; }
    if (!customerPhone.trim()) { toast.error("يرجى إدخال رقم الهاتف"); return; }
    if (!customerAddress.trim()) { toast.error("يرجى إدخال العنوان"); return; }

    setSubmitting(true);
    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        delivery_location: deliveryLocation || { lat: 0, lng: 0, address: customerAddress },
        notes,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          image_url: i.product.image_url,
        })),
        subtotal,
        delivery_fee: delivery,
        total,
        payment_method: paymentMethod,
        status: "pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("فشل إنشاء الطلب");

      const { order } = await res.json();
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error("حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/cart" className="hover:text-primary-600">سلة التسوق</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">إتمام الطلب</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Personal info */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">المعلومات الشخصية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الجوال *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01xxxxxxxx"
                  className="input-field"
                  dir="ltr"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان *</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="أدخل عنوان التوصيل"
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات إضافية..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery location */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">موقع التوصيل</h2>
            </div>
            <MapPicker
              onLocationSelect={(lat, lng, address) => {
                setDeliveryLocation({ lat, lng, address });
                if (!customerAddress) setCustomerAddress(address);
              }}
            />
          </div>

          {/* Step 3: Payment */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">طريقة الدفع</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  paymentMethod === "cash"
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                )}
              >
                <Banknote className="w-6 h-6 text-green-600" />
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">الدفع عند الاستلام</p>
                  <p className="text-xs text-gray-500">ادفع نقداً عند التوصيل</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  paymentMethod === "card"
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                )}
              >
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">بطاقة ائتمان</p>
                  <p className="text-xs text-gray-500">فيزا / ماستركارد</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("pickup")}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  paymentMethod === "pickup"
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                )}
              >
                <Store className="w-6 h-6 text-purple-600" />
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">استلام من المتجر</p>
                  <p className="text-xs text-gray-500">استلم طلبك بنفسك</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-36">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ملخص الطلب</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image_url || "/images/placeholder.svg"}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.product.price)}</p>
                  </div>
                  <p className="text-xs font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 dark:border-gray-700 mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">التوصيل</span>
                <span className={delivery === 0 ? "text-green-500" : ""}>
                  {delivery === 0 ? "مجاني" : formatCurrency(delivery)}
                </span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري إنشاء الطلب...
                </>
              ) : (
                <>
                  تأكيد الطلب
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
