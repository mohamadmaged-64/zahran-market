"use client";

import { useEffect } from "react";
import { X, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency, cn } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, subtotal, updateQuantity, removeItem, itemCount } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] animate-fade-in" onClick={() => setCartOpen(false)} />
      <div className={cn(
        "fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-gray-950 z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col",
        isCartOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">سلة التسوق</h2>
            <span className="text-sm text-gray-500">({itemCount})</span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">سلة التسوق فارغة</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">أضف منتجات إلى السلة</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 btn-primary"
              >
                تسوق الآن
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <img
                  src={item.product.image_url || "/images/placeholder.svg"}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-primary-600 font-bold mt-0.5">
                    {formatCurrency(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 text-xs mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline" /> إزالة
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="space-y-1.5">
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
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-800 pt-2">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary w-full flex items-center justify-center gap-2 text-center"
            >
              إتمام الطلب
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              متابعة التسوق
            </button>
          </div>
        )}
      </div>
    </>
  );
}
