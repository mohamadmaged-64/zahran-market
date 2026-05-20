"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-slide-up">
      <img
        src={item.product.image_url || "/images/placeholder.svg"}
        alt={item.product.name}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
          {item.product.name}
        </h4>
        <p className="text-primary-600 font-bold mt-1">
          {formatCurrency(item.product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-500" />
        </button>
        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="text-left min-w-[80px]">
        <p className="font-bold text-gray-900 dark:text-white">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>

      <button
        onClick={() => removeItem(item.product.id)}
        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}
