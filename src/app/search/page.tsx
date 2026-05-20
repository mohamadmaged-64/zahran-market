"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Product } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchProducts } = useStore();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchProducts(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }
  }, [query, searchProducts]);

  if (!query.trim()) {
    return (
      <div className="text-center py-20">
        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">أدخل كلمة للبحث</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-500 mb-6">
        نتائج البحث عن &ldquo;<span className="text-primary-600 font-medium">{query}</span>&rdquo;
        {' '}({results.length} منتج)
      </p>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد نتائج</p>
          <p className="text-gray-400 text-sm mt-1">جرب كلمات بحث مختلفة</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 mt-4">
            تصفح جميع المنتجات
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container-custom py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">البحث</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">نتائج البحث</h1>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
