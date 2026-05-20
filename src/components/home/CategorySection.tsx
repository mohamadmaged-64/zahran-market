"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import CategoryCard from "@/components/ui/CategoryCard";

export default function CategorySection() {
  const { categories, loading } = useStore();

  if (loading || categories.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">التصنيفات</h2>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.slice(0, 16).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        <div className="mt-4 text-center md:hidden">
          <Link href="/products" className="btn-outline text-sm px-4 py-2">
            عرض جميع التصنيفات
          </Link>
        </div>
      </div>
    </section>
  );
}
