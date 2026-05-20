"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/ui/CartItemCard";
import { formatCurrency, cn } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">سلة التسوق فارغة</h1>
          <p className="text-gray-500 mb-6">لم تقم بإضافة أي منتجات بعد</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          سلة التسوق ({itemCount})
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          تفريغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-36">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رسوم التوصيل</span>
                <span className={cn("font-medium", delivery === 0 ? "text-green-500" : "")}>
                  {delivery === 0 ? "مجاني" : formatCurrency(delivery)}
                </span>
              </div>
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="text-xs text-orange-500">
                  أضف {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} للحصول على توصيل مجاني
                </p>
              )}
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              إتمام الطلب
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
