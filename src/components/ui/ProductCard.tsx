"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const { addItem } = useCart();

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          -{discount}%
        </div>
      )}

      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          {product.stock} فقط
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center rounded-xl">
          <span className="text-white font-bold text-lg">غير متوفر</span>
        </div>
      )}

      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image_url || "/images/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600"
          >
            {product.category.name}
          </Link>
        )}

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({product.rating_count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">
              {product.price.toLocaleString("EG")}
            </span>
            <span className="text-xs text-gray-500">ج.م.</span>
            {product.compare_price && (
              <span className="text-sm text-gray-400 line-through">
                {product.compare_price.toLocaleString("EG")}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{product.unit}</span>
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}
