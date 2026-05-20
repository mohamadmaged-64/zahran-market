"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProducts() {
  const { featuredProducts, loading } = useStore();

  if (loading || featuredProducts.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">منتجات مميزة</h2>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredProducts.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            عرض جميع المنتجات
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
