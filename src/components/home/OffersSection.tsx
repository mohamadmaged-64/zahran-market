"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";

export default function OffersSection() {
  const { offerProducts, loading } = useStore();

  if (loading || offerProducts.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              العروض والتخفيضات
            </h2>
          </div>
          <Link
            href="/offers"
            className="hidden md:flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {offerProducts.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/offers" className="btn-outline inline-flex items-center gap-2">
            استعرض جميع العروض
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
