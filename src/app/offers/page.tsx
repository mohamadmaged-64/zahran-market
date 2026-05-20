"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, ChevronLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OffersPage() {
  const { offerProducts, loading } = useStore();

  if (loading) return <div className="container-custom py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="container-custom py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">العروض والتخفيضات</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-orange-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">العروض والتخفيضات</h1>
      </div>

      {offerProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">لا توجد عروض حالياً</p>
          <p className="text-gray-400 text-sm mt-1">ترقبوا العروض القادمة</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 mt-4">
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
